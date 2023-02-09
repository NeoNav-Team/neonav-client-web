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
import { theme } from '../utilites/theme';
import { Provider  as NnPoivder } from '../components/context/nnContext';
import HeaderContainer from '@/components/headerContainer';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <ThemeProvider theme={theme} >
          <NnPoivder>
            <HeaderContainer />
            {children}
          </NnPoivder>
        </ThemeProvider>
      </body>
    </html>
  )
}
