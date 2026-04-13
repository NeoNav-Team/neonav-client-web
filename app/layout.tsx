'use client'
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
import { theme } from '../utilities/theme';
import { Provider  as NnPoivder } from '../components/context/nnContext';
import HeaderContainer from '@/components/headerContainer';
import PwaManager from '@/components/pwaManager';
import Div100vh from 'react-div-100vh';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#002566" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="NeoNav" />
        <link rel="manifest" href="/manifest.json" crossOrigin="use-credentials"/>
      </head>
      <body>
        <ThemeProvider theme={theme} >
          <NnPoivder>
            <PwaManager />
            <Div100vh>
              <HeaderContainer />
              {children}
            </Div100vh>
          </NnPoivder>
        </ThemeProvider>
      </body>
    </html>
  )
}
