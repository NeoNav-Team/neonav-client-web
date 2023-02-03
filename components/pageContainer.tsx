import Head from 'next/head';
import styles from '../styles/Page.module.css';

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
    <div className={styles.container}>
      <Head>
        <title>{mixedTitle}</title>
        <meta name="description" content="NeoNav Web Client" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        {children}
      </main>
    </div>
  )
}