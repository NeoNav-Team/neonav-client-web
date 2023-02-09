import { 
    Box,
    Container,
    Grid
} from '@mui/material';
import IconFrame from './iconFrame';
import Kitty from './svgr/kitty';
import Cash from './svgr/cash';
import Channels from './svgr/channels';
import TanChat from './svgr/tanchat';
import NeoSites from './svgr/neosites';
import Contacts from './svgr/contacts';
import Notes from './svgr/notes';
import Announcements from './svgr/annoucements';
import Notifcations from './svgr/notifications';
import Help from './svgr/help';
import UserSettings from './svgr/usersettings';

interface HomeViewProps {}

export default function HomeView(props:HomeViewProps):JSX.Element {
    //TODO: refact this to dynamically take an array of "app" data -- icon, label, link
    const fixedHeight = '16vh';

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
                        <IconFrame icon={<TanChat fontSize="inherit" />} title="Tan / Chat"/>
                    </Box>
                    </Grid>
                    <Grid item xs={4}>
                         <Box
                     display="flex"
                     justifyContent="center"
                     alignItems="center"
                     minHeight={fixedHeight}
                    >
                        <IconFrame icon={<Channels fontSize="inherit" />} title="Channels"/>
                    </Box>
                    </Grid>
                    <Grid item xs={4}>
                         <Box
                     display="flex"
                     justifyContent="center"
                     alignItems="center"
                     minHeight={fixedHeight}
                    >
                        <IconFrame icon={<Cash fontSize="inherit" />} title="Credits"/>
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
                        <IconFrame icon={<NeoSites fontSize="inherit" />} title="NeoSites"/>
                    </Box>
                    </Grid>
                    <Grid item xs={4}>
                         <Box
                     display="flex"
                     justifyContent="center"
                     alignItems="center"
                     minHeight={fixedHeight}
                    >
                        <IconFrame icon={<Contacts fontSize="inherit" />} title="Contacts"/>
                    </Box>
                    </Grid>
                    <Grid item xs={4}>
                         <Box
                     display="flex"
                     justifyContent="center"
                     alignItems="center"
                     minHeight={fixedHeight}
                    >
                        <IconFrame icon={<Notes fontSize="inherit" />} title="Notes"/>
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
                        <IconFrame icon={<Announcements fontSize="inherit" />} title="Annoucements"/>
                    </Box>
                    </Grid>
                    <Grid item xs={4}>
                         <Box
                     display="flex"
                     justifyContent="center"
                     alignItems="center"
                     minHeight={fixedHeight}
                    >
                        <IconFrame icon={<Notifcations fontSize="inherit" />} title="Notifcations"/>
                    </Box>
                    </Grid>
                    <Grid item xs={4}>
                         <Box
                     display="flex"
                     justifyContent="center"
                     alignItems="center"
                     minHeight={fixedHeight}
                    >
                        <IconFrame icon={<Help fontSize="inherit" />} title="Help"/>
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
                        <IconFrame icon={<Kitty fontSize="inherit" />} title="Kitty"/>
                    </Box>
                    </Grid>
                    <Grid item xs={4}>
                         <Box
                     display="flex"
                     justifyContent="center"
                     alignItems="center"
                     minHeight={fixedHeight}
                    ></Box>
                </Grid>
                </Grid>
            </Grid>
        </Container>
  )
}