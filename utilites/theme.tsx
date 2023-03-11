import { createTheme, ThemeOptions } from '@mui/material/styles';

interface ExtendedThemeOptions extends ThemeOptions {
    palette?: {},
    fab?: {},
}
  
const defaultTheme = createTheme();

export const themeOptions: ExtendedThemeOptions = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#42c6ff',
            contrastText: "var(--color-0)"
        },
        secondary: {
            main: '#ff00a0',
        },
        background: {
            default: '#120458',
            paper: 'rgba(18,4,88,0.90)',
        },
        text: {
            primary: '#ffffff',
            secondary: 'rgba(255,255,255,0.6)',
            disabled: 'rgba(255,255,255,0.38)',
        },
        error: {
            main: '#ff124f',
        },
        info: {
            main: '#00b8ff',
        },
        warning: {
            main: '#f96363',
        },
        success: {
            main: '#00ff9f',
        },
        transparent: defaultTheme.palette.augmentColor({
            color: { 
                main: 'rgba(0,0,0,0)',
                contrastText: '#ffffff',
            },
            name: "transparent"
        })
    },
    typography: {
        fontFamily: 'Jura',
        body1: {
            fontFamily: 'Roboto',
        },
        body2: {
            fontFamily: 'Roboto',
        },
        h1: {
            filter: 'drop-shadow(rgb(255, 255, 255) 0px 0px 5px)',
        },
        h2: {
            filter: 'drop-shadow(rgb(255, 255, 255) 0px 0px 5px)',
        },
        h3: {
            filter: 'drop-shadow(rgb(255, 255, 255) 0px 0px 5px)',
        },
        h4: {
            filter: 'drop-shadow(rgb(255, 255, 255) 0px 0px 5px)',
        },
        h5: {
            filter: 'drop-shadow(rgb(255, 255, 255) 0px 0px 5px)',
        },
    },
    shape: {
        borderRadius: 4,
    },
    components: {
        MuiFab: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                    clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                    background: 'radial-gradient(var(--background-color), var(--color-0)) 100% 100% / 100% 100%',
                    border: '2px solid var(--background-color)',
                },
            },
        },
    },
    spacing: 8,
};

export const theme = createTheme(themeOptions);