'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import {
  Box,
  Container,
  Grid,
  Modal,
  Typography
} from '@mui/material';
import MyQRCode from './myQRCode';
import QrCodeReader from './qrCodeReader';
import styles from '../styles/generic.module.css';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import QrCodeIcon from '@mui/icons-material/QrCode';
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import EngineeringIcon from '@mui/icons-material/Engineering';
import CastleIcon from '@mui/icons-material/Castle';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import AssignmentIcon from '@mui/icons-material/Assignment';
import IconFrame from './iconFrame';
import Kitty from './svgr/kitty';
import Cash from './svgr/cash';
import TanChat from './svgr/tanchat';
import NeoSites from './svgr/neosites';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import Map from './svgr/map';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Notifications from './svgr/notifications';
import Help from './svgr/help';
import UserSettings from './svgr/usersettings';

interface HomeViewProps { }

const fixedHeight = '16vh';

export default function HomeView(props: HomeViewProps): JSX.Element {
  //TODO: refactor this to dynamically take an array of "app" data -- icon, label, link

  const [openModel, setOpenModel] = useState(false);
  const [submenu, setSubmenu] = useState('groupSettings');
  const router = useRouter();
  const handleModelOpen = (submenu: string) => {
    setSubmenu(submenu);
    setOpenModel(true);
  }
  const handleModelClose = () => setOpenModel(false);
  const handleIDScan = (result:string) => {
    if (result.length >= 5) {
      router.push(`/contacts/${result}#scan`);
    }
  }

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
    <Container sx={{ marginTop: '64px', minHeight: 'calc(100vh - 128px)' }}>
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
                <IconFrame icon={<TanChat fontSize="inherit" />} title="Tan / Chat" />
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
                <IconFrame icon={<NeoSites fontSize="inherit" />} title="NeoSites" />
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
                <IconFrame icon={<Cash fontSize="inherit" />} title="Credits" />
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
              onClick={() => handleModelOpen('discoverSettings')}
            >
              <IconFrame
                icon={<TravelExploreIcon sx={{ filter: 'drop-shadow(rgb(67, 179, 230) 0px 0px 4px)' }} fontSize="inherit" />}
                title="Discover"
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
              <Link href="/garden">
                <IconFrame
                  icon={<LocalFloristIcon sx={{ filter: 'drop-shadow(rgb(67, 179, 230) 0px 0px 4px)' }} fontSize="inherit" />}
                  title="Jaden / Garden"
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
              <Link href="/factions">
                <IconFrame icon={<CastleIcon fontSize="inherit" />} title="Factions" />
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
                icon={<Diversity1Icon sx={{ filter: 'drop-shadow(rgb(67, 179, 230) 0px 0px 4px)' }} fontSize="inherit" />}
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
              <Link href="/notifications">
                <IconFrame icon={<Notifications fontSize="inherit" />} title="Notifications" />
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
                <IconFrame icon={<Help fontSize="inherit" />} title="Help" />
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
              onClick={() => handleModelOpen('userSettings')}
            >
              <IconFrame icon={<UserSettings fontSize="inherit" />} title="Settings" />
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
                <IconFrame icon={<Map fontSize="inherit" />} title="Map" />
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
                <IconFrame icon={<Kitty fontSize="inherit" />} title="Kitty" />
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
                        icon={<RoomPreferencesIcon sx={{ filter: 'drop-shadow(rgb(67, 179, 230) 0px 0px 4px)' }} fontSize="inherit" />}
                        title="Channels" />
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
                        icon={<ManageAccountsIcon sx={{ filter: 'drop-shadow(rgb(67, 179, 230) 0px 0px 4px)' }} fontSize="inherit" />}
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
                        icon={<EngineeringIcon sx={{ filter: 'drop-shadow(rgb(67, 179, 230) 0px 0px 4px)' }} fontSize="inherit" />}
                        title="Factions"
                      />
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
                    <Link href="/clipboard">
                      <IconFrame
                        icon={<AssignmentIcon sx={{ filter: 'drop-shadow(rgb(67, 179, 230) 0px 0px 4px)' }} fontSize="inherit" />}
                        title="Clipboard" />
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
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight={fixedHeight}
                  >
                  </Box>
                </Grid>
              </Grid>
            </div>
          )}
          {submenu === 'discoverSettings' && (
            <div
              className={styles.submenuPane}
              data-augmented-ui="tl-clip tr-clip-x  bl-clip br-clip  both"
            >
              <Typography sx={modelTitleStyle}>User Settings</Typography>
              <Grid container item spacing={3}>
                <Grid item xs={4}>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight={fixedHeight}
                  >
                    <Link href="/garden/search">
                      <IconFrame
                        icon={<PersonSearchIcon sx={{ filter: 'drop-shadow(rgb(67, 179, 230) 0px 0px 4px)' }} fontSize="inherit" />}
                        title="Search People" />
                    </Link>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight={fixedHeight}
                    onClick={() => handleModelOpen('qrCodeScan')}
                  >
                    <IconFrame
                      icon={<QrCodeScannerIcon sx={{ filter: 'drop-shadow(rgb(67, 179, 230) 0px 0px 4px)' }} fontSize="inherit" />}
                      title="QR Code Scanner" />
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight={fixedHeight}
                    onClick={() => handleModelOpen('myQRCode')}
                  >
                    <IconFrame
                      icon={<QrCodeIcon sx={{ filter: 'drop-shadow(rgb(67, 179, 230) 0px 0px 4px)' }} fontSize="inherit" />}
                      title="My QR Code"
                    />
                  </Box>
                </Grid>
              </Grid>
            </div>
          )}
          {submenu === 'userSettings' && (
            <div
              className={styles.submenuPane}
              data-augmented-ui="tl-clip tr-clip-x  bl-clip br-clip  both"
            >
              <Typography sx={modelTitleStyle}>User Settings</Typography>
              <Grid container item spacing={3}>
                <Grid item xs={4}>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight={fixedHeight}
                  >
                    <Link href="/profile">
                      <IconFrame
                        icon={<ContactPageIcon sx={{ filter: 'drop-shadow(rgb(67, 179, 230) 0px 0px 4px)' }} fontSize="inherit" />}
                        title="Profile" />
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
                    <Link href="/security">
                      <IconFrame
                        icon={<AdminPanelSettingsIcon sx={{ filter: 'drop-shadow(rgb(67, 179, 230) 0px 0px 4px)' }} fontSize="inherit" />}
                        title="Security"
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
          {submenu === 'qrCodeScan' && (
            <div
              className={styles.qrScanPane}
              data-augmented-ui="tl-clip tr-clip  bl-clip br-clip  both"
            >
              <QrCodeReader successHandler={result => handleIDScan(result)} />
            </div>
          )}
        </Box>
      </Modal>
    </Container>
  )
}