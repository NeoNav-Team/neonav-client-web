/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import styles from '../styles/generic.module.css';
import { Context as NnContext } from './context/nnContext';
import { NnProfileAuth, NnProviderValues, } from './context/nnTypes';
import SimpleScrollContainer from './simpleScrollContainer';
import { requestAndSubscribePush, unsubscribeFromPush } from './pwaManager';
import {
  Container,
  Box,
  Button,
  CircularProgress,
  Divider,
  InputAdornment,
  IconButton,
  Link,
  Typography,
  TextField,
  Tooltip,
} from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import { Stack } from '@mui/system';
import { use100vh } from 'react-div-100vh';

interface UserSecurityAppProps { };

const passwordChangeUrl = 'https://auth.neonav.net/changepassword';
const logoutUrl = 'https://auth.neonav.net/logout';
const defaultAuth = {
  userid: '',
  email: '',
  emailverified: false,
  lastlogin: '',
  lastip: '',
}
const flexContainer = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'nowrap',
  justifyContent: 'center',
  alignContent: 'space-around',
  alignItems: 'stretch',
};
const flexBody = {
  order: 0,
  flex: '1',
  alignSelf: 'auto',
  width: '100%',
  minWidth: '100%',
  minHeight: '50vh',
  overflow: 'hidden',
};
const input = {
  width: '100%',
  margin: '10px 0'
};

export default function UserSecurityApp(props: UserSecurityAppProps): JSX.Element {
  const FULL_HEIGHT = use100vh() || 600;
  const FLEX_HEIGHT = FULL_HEIGHT - 75;
  const SCROLL_HEIGHT = FULL_HEIGHT - 114;
  const {
    state,
    fetchUserProfile = () => { },
  }: NnProviderValues = useContext(NnContext);
  const AuthProfile: NnProfileAuth = useMemo(() => {
    return state?.network?.entity?.auth || defaultAuth;
  }, [state]);
  const [SecurityFetched, setSecurityFetched] = useState(false);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission | null>(null);

  useEffect(() => {
    if ('Notification' in window) {
      setNotifPermission(Notification.permission);
    }
  }, []);

  const handleEnableNotifications = async () => {
    const granted = await requestAndSubscribePush();
    setNotifPermission(granted ? 'granted' : Notification.permission);
  };

  const handleDisableNotifications = async () => {
    await unsubscribeFromPush();
    setNotifPermission('default');
  };

  const goFetchSecurity = useCallback(() => {
    if (!SecurityFetched) {
      fetchUserProfile();
      setSecurityFetched(true);
    }
  }, [SecurityFetched, fetchUserProfile]);

  const handleMouseUpDownIgnore = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  
  const [showCopyTooltip, setShowCopyTooltip] = React.useState(false);
  
  const setClipboard = () => {
    let userid = AuthProfile?.userid;
    if (userid && window.isSecureContext) {
      navigator.clipboard.writeText(userid);
      setShowCopyTooltip(true);
      setTimeout(() => setShowCopyTooltip(false), 3000); // 3 is a magic number https://www.youtube.com/watch?v=J8lRKCw2_Pk
    }
  }

  useEffect(() => {
    goFetchSecurity();
  }, [goFetchSecurity, AuthProfile]);

  return (
    <Container disableGutters style={{ height: '100%' }}>
      <div
        className={styles.darkPane}
        style={{ height: '100%', maxHeight: 'calc(100% - 74px)', marginTop: '70px' }}
        data-augmented-ui="tl-clip-x tr-rect br-clip bl-clip both"
      >
        <Box sx={{ ...flexContainer, minHeight: FLEX_HEIGHT, maxHeight: FLEX_HEIGHT }}>
          <Box sx={{ ...flexBody, maxHeight: SCROLL_HEIGHT }}>
            {SecurityFetched && (
              AuthProfile && Object.keys(AuthProfile).length !== 0 ? (
                <SimpleScrollContainer>
                  <Box sx={{ minWidth: '100%', minHeight: '100%' }}>
                    <Stack spacing={0} sx={{ display: 'flex' }}>
                      <Divider variant="middle" color="primary"><Typography variant="h6">Account Details</Typography></Divider>
                      <Tooltip title="User ID Copied to Clipboard!" placement="top" open={showCopyTooltip} disableFocusListener disableHoverListener disableTouchListener >
                        <TextField
                          name="userid"
                          value={AuthProfile?.userid}
                          label="User ID"
                          variant="outlined"
                          style={input}
                          onClick={setClipboard}
                          InputProps={{
                            readOnly: true,
                            endAdornment:
                              <InputAdornment position="end">
                                {window.isSecureContext && <IconButton 
                                  aria-label='Copy User ID'
                                  onClick={setClipboard}
                                  onMouseDown={handleMouseUpDownIgnore}
                                  onMouseUp={handleMouseUpDownIgnore}
                                  edge="end"
                                >
                                  <ContentCopyIcon />
                                </IconButton>}
                              </InputAdornment>
                          }}
                        />
                      </Tooltip>
                      <TextField
                        name="email"
                        value={AuthProfile?.email}
                        label="Email"
                        variant="outlined"
                        style={input}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      <TextField
                        name="verified"
                        value={AuthProfile?.emailverified ? 'Email has been verified.' : 'NOT verified, please check your email.'}
                        label="Verified"
                        variant="outlined"
                        error={!AuthProfile?.emailverified}
                        style={input}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      <Divider variant="middle" color="primary"><Typography variant="h6">Security Details</Typography></Divider>
                      <TextField
                        name="lastLogin"
                        value={AuthProfile?.lastlogin}
                        label="Last Login"
                        variant="outlined"
                        style={input}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      <TextField
                        name="lastIp"
                        value={AuthProfile?.lastip}
                        label="Last Known IP"
                        variant="outlined"
                        style={input}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      <Divider variant="middle" color="primary"><Typography variant="h6">NeoNav Auth</Typography></Divider>
                      <Link href={passwordChangeUrl}>
                        <Button
                          variant="contained"
                          component="label"
                          endIcon={<ExitToAppIcon />}
                          style={input}
                        >
                          Change Password
                        </Button>
                      </Link>
                      <Link href={logoutUrl}>
                        <Button
                          variant="contained"
                          component="label"
                          endIcon={<ExitToAppIcon />}
                          style={input}
                        >
                          Logout
                        </Button>
                      </Link>
                      {notifPermission !== null && (
                        <>
                          <Divider variant="middle" color="primary"><Typography variant="h6">Push Notifications</Typography></Divider>
                          {notifPermission === 'granted' && (
                            <Button
                              variant="outlined"
                              endIcon={<NotificationsActiveIcon />}
                              style={input}
                              onClick={handleDisableNotifications}
                            >
                              Notifications Enabled — click to disable
                            </Button>
                          )}
                          {notifPermission === 'denied' && (
                            <Button
                              variant="outlined"
                              disabled
                              endIcon={<NotificationsOffIcon />}
                              style={input}
                            >
                              Notifications Blocked — enable in browser settings
                            </Button>
                          )}
                          {notifPermission === 'default' && (
                            <Button
                              variant="contained"
                              endIcon={<NotificationsIcon />}
                              style={input}
                              onClick={handleEnableNotifications}
                            >
                              Enable Notifications
                            </Button>
                          )}
                        </>
                      )}
                    </Stack>
                  </Box>
                </SimpleScrollContainer>
              ) : (
                <Stack
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  sx={{ minHeight: '100%' }}
                >
                  <CircularProgress color="secondary" />
                </Stack>
              ))}
          </Box>
        </Box>
      </div>
    </Container>
  )
}
