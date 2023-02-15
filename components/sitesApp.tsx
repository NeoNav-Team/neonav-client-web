'use client';
import Iframe from 'react-iframe';
import { Fab } from '@mui/material';
import Link from 'next/link';
import ListIcon from '@mui/icons-material/List';
import { positions } from '@mui/system';

interface PageContainerProps {
  index?: string;
  indexBtn?: boolean;
}

const NEOSITES_INDEX = 'https://sites.neonav.net'

export default function SitesApp(props:PageContainerProps):JSX.Element {
  const { index, indexBtn } = props;

  return (<>
        <Iframe url={index || NEOSITES_INDEX}
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