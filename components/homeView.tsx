'use client';
import { useState } from 'react';
import Link from 'next/link';
import { 
  Box,
  Container,
  Grid,
  Modal,
  Typography
} from '@mui/material';
import MyQRCode from './myQRCode';
import styles from '../styles/generic.module.css';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import QrCodeIcon from '@mui/icons-material/QrCode';
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import EngineeringIcon from '@mui/icons-material/Engineering';
import CastleIcon from '@mui/icons-material/Castle';
import IconFrame from './iconFrame';
import Kitty from './svgr/kitty';
import Cash from './svgr/cash';
import TanChat from './svgr/tanchat';
import NeoSites from './svgr/neosites';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import Map from './svgr/map';
import Notes from './svgr/notes';
import Notifcations from './svgr/notifications';
import Help from './svgr/help';
import UserSettings from './svgr/usersettings';

interface HomeViewProps {}

const fixedHeight = '16vh';

export default function HomeView(props:HomeViewProps):JSX.Element {
  //TODO: refact this to dynamically take an array of "app" data -- icon, label, link

  const [openModel, setOpenModel] = useState(false);
  const [submenu, setSubmenu] = useState('groupSettings');
  const handleModelOpen = (submenu:string) => {
    setSubmenu(submenu);
    setOpenModel(true);
  }
  const handleModelClose = () => setOpenModel(false);

  const modelStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    maxWidth: '800px',
    boxShadow: 24,
  };
  const modelTitleStyle = {
    fontFamily: 'Jura',
    fontSize: '18px',
    letterSpacing: '0.1rem',
    padding: '10px 16px 0',
    filter: 'drop-shadow(rgb(255, 255, 255) 0px 0px 4px)',
  }
      
  return (
    <Container sx={{marginTop: '64px', minHeight: 'calc(100vh - 128px)'}}>
      <Grid container spacing={1}>
        <Grid container item spacing={3}
        >
          <Grid item xs={4}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight={fixedHeight}
            >
              <Link href="/chat">
                <IconFrame icon={<TanChat fontSize="inherit" />} title="Tan / Chat"/>
              </Link>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight={fixedHeight}
            >
              <Link href="/sites">
                <IconFrame icon={<NeoSites fontSize="inherit" />} title="NeoSites"/>
              </Link>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight={fixedHeight}
            >
              <Link href="/cash">
                <IconFrame icon={<Cash fontSize="inherit" />} title="Credits"/>
              </Link>
            </Box>
          </Grid>
        </Grid>
        <Grid container item spacing={3}>
          <Grid item xs={4}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight={fixedHeight}
              onClick={() => handleModelOpen('groupSettings')}
            >
              <IconFrame 
                icon={<Diversity1Icon sx={{filter: 'drop-shadow(rgb(67, 179, 230) 0px 0px 4px)'}} fontSize="inherit" />}
                title="HR Portal"
              />
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight={fixedHeight}
            >
              <IconFrame 
                icon={<LocalFloristIcon sx={{filter: 'drop-shadow(rgb(67, 179, 230) 0px 0px 4px)'}} fontSize="inherit" />}
                title="Jaden / Garden"
              />
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight={fixedHeight}
            >
              <Link href="/factions">
                <IconFrame icon={<CastleIcon fontSize="inherit" />} title="Factions"/>
              </Link>
            </Box>
          </Grid>
        </Grid>
        <Grid container item spacing={3}>
          <Grid item xs={4}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight={fixedHeight}
              onClick={() => handleModelOpen('myQRCode')}
            >
              <IconFrame 
                icon={<QrCodeIcon sx={{filter: 'drop-shadow(rgb(67, 179, 230) 0px 0px 4px)'}} fontSize="inherit" />}
                title="My QRCode"
              />
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight={fixedHeight}
            >
              <Link href="/notify">
                <IconFrame icon={<Notifcations fontSize="inherit" />} title="Notifcations"/>
              </Link>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight={fixedHeight}
            >
              <Link href="/help">
                <IconFrame icon={<Help fontSize="inherit" />} title="Help"/>
              </Link>
            </Box>
          </Grid>
        </Grid>
        <Grid container item spacing={3}>
          <Grid item xs={4}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight={fixedHeight}
            >
              <IconFrame icon={<UserSettings fontSize="inherit" />} title="Settings"/>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight={fixedHeight}
            >
              <Link href="/map">
                <IconFrame icon={<Map fontSize="inherit" />} title="Map"/>
              </Link>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight={fixedHeight}
            >
              <Link href="/">
                <IconFrame icon={<Kitty fontSize="inherit" />} title="Kitty"/>
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Modal
        open={openModel}
        onClose={handleModelClose}
      >
        <Box sx={modelStyle}>
          {submenu === 'groupSettings' && (
            <div
              className={styles.submenuPane}
              data-augmented-ui="tl-clip tr-clip-x  bl-clip br-clip  both"
            >
              <Typography sx={modelTitleStyle}>Group Settings</Typography>
              <Grid container item spacing={3}>
                <Grid item xs={4}>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight={fixedHeight}
                  >
                    <Link href="/channels">
                      <IconFrame
                        icon={<RoomPreferencesIcon sx={{filter: 'drop-shadow(rgb(67, 179, 230) 0px 0px 4px)'}} fontSize="inherit" />}
                        title="Channels"/>
                    </Link>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight={fixedHeight}
                  >
                    <Link href="/contacts">
                      <IconFrame
                        icon={<ManageAccountsIcon sx={{filter: 'drop-shadow(rgb(67, 179, 230) 0px 0px 4px)'}} fontSize="inherit" />}
                        title="Contacts"
                      />
                    </Link>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight={fixedHeight}
                  >
                    <Link href="/factions/admin">
                      <IconFrame
                        icon={<EngineeringIcon sx={{filter: 'drop-shadow(rgb(67, 179, 230) 0px 0px 4px)'}} fontSize="inherit" />}
                        title="Factions"
                      />
                    </Link>
                  </Box>
                </Grid>
              </Grid>
            </div>
          )}
          {submenu === 'myQRCode' && (
            <div
              className={styles.qrcodePane}
              data-augmented-ui="tl-clip tr-clip  bl-clip br-clip  both"
            >
              <MyQRCode size={420} />
            </div>
          )}
        </Box>
      </Modal>
    </Container>
  )
}