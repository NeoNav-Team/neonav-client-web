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
import AccountCircle from '@mui/icons-material/AccountCircle';
import AppsIcon from '@mui/icons-material/Apps';
import styles from '../styles/generic.module.css';
import Logo from './svgr/logo';

interface PageContainerProps {}

export default function HeaderContainer(props:PageContainerProps):JSX.Element {
  return (

      <AppBar color='secondary'>
        <div
          className={styles.indigoPane}
          data-augmented-ui="tl-clip tr-clip both"
        >
        <Container>
          <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1} minHeight={64}>
              <Grid display="flex" justifyContent="center" alignItems="bottom">
                <IconButton disableRipple={true}>
                  <Logo sx={{ fontSize: 48, marginTop: 1 }} />
                </IconButton>
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
            <IconButton
              size="large"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box>
            <Grid container spacing={1} minHeight={64}>
              <Grid display="flex" justifyContent="center" alignItems="bottom">
                <IconButton disableRipple={true}>
                  <AppsIcon sx={{ fontSize: 48, marginTop: 1 }} />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
          </Toolbar>
        </Container>
        </div>
      </AppBar>
  )
}