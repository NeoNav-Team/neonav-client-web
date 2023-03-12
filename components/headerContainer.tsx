'use client';
import { useContext, useEffect, useState } from 'react';
import { Context as NnContext } from '../components/context/nnContext';
import { NnProviderValues } from '../components/context/nnTypes';
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

interface PageContainerProps {}

export default function HeaderContainer(props:PageContainerProps):JSX.Element {

  const {
    state, 
    initContext = () => {},
    fetchNetworkStatus = () => {},
    fetchUserContacts = () => {},
    fetchUserFactions = () => {},
    longPollMessages = (since:string) => {},
  }: NnProviderValues = useContext(NnContext);  
  const [ initialized, setInitialized ] = useState(false)

  useEffect(() => {
    //get inital values on page load
    if(!initialized) { 
      initContext();
      fetchNetworkStatus();
      fetchUserContacts();
      fetchUserFactions();
      setInitialized(true);
      longPollMessages('now');
    }
  }, [fetchNetworkStatus, fetchUserContacts, fetchUserFactions,  initContext, longPollMessages, initialized]);

  return (

    <AppBar color='secondary'>
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
              <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                <Badge badgeContent={1} color="secondary">
                  <ChatIcon />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
              >
                <Badge badgeContent={1} color="secondary">
                  <NotificationsIcon fill="#fff" />
                </Badge>
              </IconButton>
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