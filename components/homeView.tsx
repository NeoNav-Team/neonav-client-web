import { 
    Box,
    Container,
    Grid
} from '@mui/material';
import IconFrame from './iconFrame';
import Kitty from './svgr/kitty';

interface PageContainerProps {}

export default function HomeView(props:PageContainerProps):JSX.Element {
    //TODO: refact this to dynamically take an array of "app" data -- icon, label, link


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
                     minHeight="20vh"
                    >
                        <IconFrame icon={<Kitty fontSize="inherit" />} title="Kitty"/>
                    </Box>
                    </Grid>
                    <Grid item xs={4}>
                         <Box
                     display="flex"
                     justifyContent="center"
                     alignItems="center"
                     minHeight="20vh"
                    >
                        <IconFrame icon={<Kitty fontSize="inherit" />} title="Kitty"/>
                    </Box>
                    </Grid>
                    <Grid item xs={4}>
                         <Box
                     display="flex"
                     justifyContent="center"
                     alignItems="center"
                     minHeight="20vh"
                    >
                        <IconFrame icon={<Kitty fontSize="inherit" />} title="Kitty"/>
                    </Box>
                </Grid>
                </Grid>
                <Grid container item spacing={3}>
                <Grid item xs={4}>
                         <Box
                     display="flex"
                     justifyContent="center"
                     alignItems="center"
                     minHeight="20vh"
                    >
                        <IconFrame icon={<Kitty fontSize="inherit" />} title="Kitty"/>
                    </Box>
                    </Grid>
                    <Grid item xs={4}>
                         <Box
                     display="flex"
                     justifyContent="center"
                     alignItems="center"
                     minHeight="20vh"
                    >
                        <IconFrame icon={<Kitty fontSize="inherit" />} title="Kitty"/>
                    </Box>
                    </Grid>
                    <Grid item xs={4}>
                         <Box
                     display="flex"
                     justifyContent="center"
                     alignItems="center"
                     minHeight="20vh"
                    >
                        <IconFrame icon={<Kitty fontSize="inherit" />} title="Kitty"/>
                    </Box>
                </Grid>
                </Grid>
                <Grid container item spacing={3}>
                <Grid item xs={4}>
                         <Box
                     display="flex"
                     justifyContent="center"
                     alignItems="center"
                     minHeight="20vh"
                    >
                        <IconFrame icon={<Kitty fontSize="inherit" />} title="Kitty"/>
                    </Box>
                    </Grid>
                    <Grid item xs={4}>
                         <Box
                     display="flex"
                     justifyContent="center"
                     alignItems="center"
                     minHeight="20vh"
                    >
                        <IconFrame icon={<Kitty fontSize="inherit" />} title="Kitty"/>
                    </Box>
                    </Grid>
                    <Grid item xs={4}>
                         <Box
                     display="flex"
                     justifyContent="center"
                     alignItems="center"
                     minHeight="20vh"
                    >
                        <IconFrame icon={<Kitty fontSize="inherit" />} title="Kitty"/>
                    </Box>
                </Grid>
                </Grid>
            </Grid>
        </Container>
  )
}