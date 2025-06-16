'use client';
import { useContext, useEffect, useState, useMemo } from 'react';
import { Context as NnContext } from '../components/context/nnContext';
import { restrictedChannels, globalChannel } from '../utilities/constants';
import { NnProviderValues, LooseObject } from '../components/context/nnTypes';
import Link from 'next/link';
import { 
  AppBar,
  Badge,
  Box,
  Container,
  Grid,
  IconButton,
  Toolbar,
  Typography
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AppsIcon from '@mui/icons-material/Apps';
import styles from '../styles/generic.module.css';
import Logo from './svgr/logo';
import SelectFaction from './selectFaction';
import Alerts from './alerts';
import Announcement from './announcement';

interface PageContainerProps {}

export default function HeaderContainer(props:PageContainerProps):JSX.Element {

  const {
    state, 
    initContext = () => {},
    fetchClipboardEntities = () => {},
    fetchNetworkStatus = () => {},
    fetchUserContacts = () => {},
    fetchUserFactions = () => {},
    fetchUserChannels = () => {},
    fetchUnreadCount = () => {},
    longPollMessages = (since:string) => {},
  }: NnProviderValues = useContext(NnContext);  
  const [ initialized, setInitialized ] = useState(false);
  const unread:LooseObject = useMemo(() => {
    return state?.network?.selected?.unread || {};
  }, [state]);

  useEffect(() => {
    //get initial values on page load
    if(!initialized) { 
      initContext();
      fetchClipboardEntities();
      fetchNetworkStatus();
      fetchUserContacts();
      fetchUserFactions();
      fetchUserChannels();
      fetchUnreadCount();
      setInitialized(true);
      longPollMessages('now');
    }
  }, [
    fetchNetworkStatus,
    fetchUserContacts,
    fetchClipboardEntities,
    fetchUserFactions,
    fetchUserChannels,
    fetchUnreadCount,
    initContext,
    longPollMessages,
    initialized]);

  const totalUnread = (unread:LooseObject) => {
    let totalUnread = 0;
    Object.keys(unread).map(channel => {
      if (channel !== globalChannel && restrictedChannels.indexOf(channel) === -1) {
        totalUnread = totalUnread + unread[channel];
      }
    });
    return totalUnread;
  }

  function notificationsLabel(count: number) {
    if (count === 0) {
      return 'no notifications';
    }
    if (count > 99) {
      return 'more than 99 notifications';
    }
    return `${count} notifications`;
  }

  function mailLabel(count: number) {
    if (count === 0) {
      return 'no new mails';
    }
    if (count > 99) {
      return 'more than 99 new mails';
    }
    return `show ${count} new mails` ;
  }


  return (

    <AppBar color='secondary'>
      <Announcement />
      <Alerts />
      <div
        className={styles.indigoPane}
        data-augmented-ui="tl-clip tr-clip both"
      >
        <Container disableGutters>
          <Toolbar disableGutters>
            <Box>
              <Grid container spacing={1} minHeight={64}>
                <Grid display="flex" justifyContent="center" alignItems="bottom">
                  <Link href="/">
                    <IconButton disableRipple={true}>
                      <Logo sx={{ fontSize: 48, marginTop: 1, marginLeft: 2 }} />
                    </IconButton>
                  </Link>
                </Grid>
                <Grid 
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  sx={{ display: { xs: 'none', sm: 'flex' } }}
                >
                  <Typography variant="h4">N E O N A V</Typography>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'flex', md: 'flex' } }}>
              <Link href="/channels">
                <IconButton size="large" aria-label={mailLabel(totalUnread(unread))} color="inherit">
                  <Badge badgeContent={totalUnread(unread)} color="secondary">
                    <ChatIcon />
                  </Badge>
                </IconButton>
              </Link>
              <Link href="/notifications">
                <IconButton size="large" aria-label={notificationsLabel(unread[restrictedChannels[0]])} color="inherit">
                  <Badge badgeContent={unread[restrictedChannels[0]]} color="secondary">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Link>
              <SelectFaction />
            </Box>
            <Box>
              <Grid container spacing={1} minHeight={64}>
                <Grid display="flex" justifyContent="center" alignItems="bottom">
                  <Link href="/">
                    <IconButton>
                      <AppsIcon sx={{ fontSize: 48, marginTop: 1 }} />
                    </IconButton>
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Toolbar>
        </Container>
      </div>
    </AppBar>
  )
}
