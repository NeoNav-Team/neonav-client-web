'use client';
import { useContext, useEffect } from 'react';
import { Context as NnContext } from '../components/context/nnContext';
import { NnProviderValues } from '../components/context/nnTypes';
import { 
    Container,
} from '@mui/material';
import styles from '../styles/generic.module.css';

interface CashAppProps {
}

export default function CashApp(props:CashAppProps):JSX.Element {

    const {
        state,
        fetchNetworkStatus = () => {},
      }: NnProviderValues = useContext(NnContext);
    
      const { network } = state;
      const { location } = network;
    
      useEffect(() => {
        fetchNetworkStatus();
      }, []);

    return (
        <Container disableGutters sx={{marginTop: '74px'}}>
            <div
                className={styles.darkPane}
                data-augmented-ui="tl-clip-x tr-rect br-clip bl-clip both"
                style={{
                    minHeight: 'calc(100vh - 84px)'
                }}
            >
                <h1>{location}</h1>
            </div>
        </Container>
    )
}