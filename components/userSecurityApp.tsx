/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import styles from '../styles/generic.module.css';
import { Context as NnContext } from './context/nnContext';
import { NnProviderValues, nnEntity, } from './context/nnTypes';
import SimpleScrollContainer from './simpleScrollContainer';
import FooterNav from './footerNav';
import {
  Container,
  Box,
  Typography,
  Divider,
  CircularProgress,
  TextField,
} from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import SaveIcon from '@mui/icons-material/Save';
import { Stack } from '@mui/system';
import { use100vh } from 'react-div-100vh';

interface UserSecurityAppProps { };

type Form = {
  password?: string;
}
type FormKey =
  'password';

const defaultForm = {
  password: '',
};

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

const flexFooter = {
  order: 0,
  flex: '0 1 24px',
  alignSelf: 'flex-end',
  width: '100%',
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
    fetchUserProfile = () => {},
    updateUserProfile = (document: any, update: any) => {},
  }: NnProviderValues = useContext(NnContext);
  const Profile: nnEntity = useMemo(() => {
    return state?.network?.entity?.auth || {};
  }, [state]);
  const accountId = state?.network?.selected?.account || '';
  const isAdmin = accountId === Profile?.auth?.userid;
  const [SecurityFetched, setSecurityFetched] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<Form>(defaultForm);
  const { password } = form;

  const goFetchSecurity = useCallback(() => {
    if (!SecurityFetched) {
      fetchUserProfile();
      setSecurityFetched(true);
    }
  }, [SecurityFetched, fetchUserProfile]);

  const updateDefaultForm = (Profile: nnEntity) => {
    let updatedDefaultForm: Form = defaultForm;
    Object.keys(updatedDefaultForm).map(function (key) {
      if ((Profile as any)[key]) (updatedDefaultForm as any)[key] = (Profile as any)[key]
    });
    setForm(updatedDefaultForm);
  }

  useEffect(() => {
    goFetchSecurity();
  }, [goFetchSecurity, Profile]);

  useEffect(() => {
    if (Object.keys(Profile).length >= 3) {
      updateDefaultForm(Profile);
    }
  }, [Profile]);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event?.target;
    setForm({ ...form, [name]: value });
  }

  const saveSecurityChanges = () => {
    const doc = {
      _id: state?.network?.entity?._id,
      _rev: state?.network?.entity?._rev,
    }
    updateUserProfile(doc, form);
  }

  const bigButtonAction = () => {
    if (editMode) {
      saveSecurityChanges();
    } else {
      goFetchSecurity(); //get latest before editing
    }
    setEditMode(!editMode);
  }

  return (
    <Container disableGutters style={{ height: '100%' }}>
      <div
        className={styles.darkPane}
        style={{ height: '100%', maxHeight: 'calc(100% - 74px)', marginTop: '70px' }}
        data-augmented-ui="tl-clip-x tr-rect br-clip bl-clip both"
      >
        <Box sx={{ ...flexContainer, minHeight: FLEX_HEIGHT, maxHeight: FLEX_HEIGHT }}>
          <Box sx={{ ...flexBody, maxHeight: SCROLL_HEIGHT }}>
            {SecurityFetched ? (
              Profile && Object.keys(Profile).length !== 0 ? (
                <SimpleScrollContainer>
                  <Box sx={{ minWidth: '100%', minHeight: '100%' }}>
                    <Stack spacing={0} sx={{ display: 'flex' }}>
                      <Divider variant="middle" color="primary"><Typography variant="h6">Account Details</Typography></Divider>
                      <TextField
                        name="userid"
                        value={Profile?.auth?.userid}
                        label="User ID"
                        variant="outlined"
                        style={input}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      <TextField
                        name="email"
                        value={Profile?.auth?.email}
                        label="Email"
                        variant="outlined"
                        style={input}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      <TextField
                        name="verified"
                        value={Profile?.auth?.emailverified}
                        label="Verified"
                        variant="outlined"
                        style={input}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      <Divider variant="middle" color="primary"><Typography variant="h6">Security Details</Typography></Divider>
                      <TextField
                        name="lastLogin"
                        value={Profile?.auth?.lastlogin}
                        label="Last Login"
                        variant="outlined"
                        style={input}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      <TextField
                        name="lastIp"
                        value={Profile?.auth?.lastip}
                        label="Last Known IP"
                        variant="outlined"
                        style={input}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      <Divider variant="middle" color="primary"><Typography variant="h6">Change Password</Typography></Divider>
                      <TextField
                        name="password"
                        value={password}
                        onChange={changeHandler}
                        label="Password"
                        variant="outlined"
                        style={input}
                        InputProps={{
                          readOnly: editMode,
                        }}
                      />
                    </Stack>
                  </Box>
                </SimpleScrollContainer>
              ) : (
                <Typography variant='h2'> 404 Security Not Found</Typography>
              )) : (
              <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                sx={{ minHeight: '100%' }}
              >
                <CircularProgress color="secondary" />
              </Stack>
            )}
          </Box>
          <Box sx={flexFooter}>
            <FooterNav
              bigHexProps={{
                icon: editMode ? <SaveIcon /> : <BorderColorIcon />,
                disabled: isAdmin,
                handleAction: bigButtonAction,
              }}
            />
          </Box>
        </Box>
      </div>
    </Container>
  )
}