import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/jura/400.css';
import '@fontsource/jura/500.css';
import '@fontsource/jura/700.css';
import '../styles/vars.css';
import '../styles/globals.css';
import '../styles/augmented-ui.min.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../utilites/theme';
import { Provider  as NnPoivder } from '../components/context/nnContext';


export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme} >
      <NnPoivder>
        <Component {...pageProps} />
      </NnPoivder>
    </ThemeProvider>)
  ;
}
