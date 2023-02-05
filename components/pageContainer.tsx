import Head from 'next/head';
import { Container } from '@mui/material';
import HeaderContainer from './headerContainer';
import HomeView from './homeView';

interface PageContainerProps {
  title?: string;
  children?: React.ReactNode;
}

export default function PageContainer(props:PageContainerProps):JSX.Element {
  const { children, title } = props;
  let mixedTitle = 'N E O N A V';
  if (typeof title !== 'undefined') {
    mixedTitle = mixedTitle + `  [ ${title} ]`;
  }
  return (
    <>
      <Head>
        <title>{mixedTitle}</title>
        <meta name="description" content="NeoNav Web Client" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
      <HeaderContainer />
        <HomeView />
        {children}
      </Container>
    </>
  )
}