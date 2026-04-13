'use client';
import Iframe from 'react-iframe';
import { Fab } from '@mui/material';
import Link from 'next/link';
import ListIcon from '@mui/icons-material/List';
import { useSearchParams } from 'next/navigation';

interface PageContainerProps {
  index?: string;
  indexBtn?: boolean;
}

const NEOSITES_INDEX = 'https://sites.neonav.net'

export default function SitesApp(props:PageContainerProps):JSX.Element {
  const { index, indexBtn } = props;
  const searchParams = useSearchParams();
  const siteParam = searchParams ? searchParams.get('site') : null;
  const iframeUrl = siteParam
    ? new URL(siteParam, NEOSITES_INDEX + '/').href
    : (index || NEOSITES_INDEX);

  return (<>
    <Iframe url={iframeUrl}
      width="100%"
      height="100%"
      display="block"
      name="neosites"
      frameBorder={0}
      styles={{marginTop: '64px', maxHeight: 'calc(100% - 64px)'}}
      position="relative"
    />
    {indexBtn && (
      <div style={{position: 'absolute', bottom: 20, right: 10,}}>
        <Link href={index || NEOSITES_INDEX} target="neosites">
          <Fab color="secondary" aria-label="index">
            <ListIcon  sx={{ fontSize: '40px'}} />
          </Fab>
        </Link>
      </div>
    )}
  </>)
}