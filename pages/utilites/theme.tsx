import { createTheme, ThemeOptions } from '@mui/material/styles';

interface ExtendedThemeOptions extends ThemeOptions {
    props?: {
        MuiAppBar?: {
            color: string;
        }
    }
    overrides?: {
        MuiAppBar?: {
            colorInherit?: {
                backgroundColor?: string,
                color?: string,
            }
        },
        MuiButton?: {
            root?: {
                background?: string,
                border?: number,
                borderRadius?: number,
                boxShadow?: string,
                color?: string,
                height?: number,
                padding?: string,
              },
        }
    }
}

  export const themeOptions: ExtendedThemeOptions = {
    palette: {
      mode: 'light',
      primary: {
        main: '#42c6ff',
      },
      secondary: {
        main: '#ff00a0',
      },
      background: {
        default: '#120458',
        paper: 'rgba(0,0,0,0)',
      },
      text: {
        primary: 'rgba(255,255,255,0.87)',
        secondary: 'rgba(255,255,255,0.6)',
        disabled: 'rgba(255,255,255,0.38)',
        //hint: '#5440bb', //does not exist on type
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
    },
    typography: {
      fontFamily: 'Jura',
      body1: {
        fontFamily: 'Roboto',
      },
      body2: {
        fontFamily: 'Roboto',
      },
    },
    props: {
      MuiAppBar: {
        color: 'inherit',
      },
    },
    overrides: {
      MuiAppBar: {
        colorInherit: {
          backgroundColor: '#689f38',
          color: '#fff',
        },
      },
      MuiButton: {
        root: {
          background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
          border: 0,
          borderRadius: 3,
          boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
          color: 'white',
          height: 48,
          padding: '0 30px',
        },
      },
    },
    shape: {
      borderRadius: 4,
    },
    spacing: 8,
  };
  
export const theme = createTheme(themeOptions);