'use client';
import { useCallback, useContext, useEffect, useState } from 'react';
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
        fetchUserWallets = () => {},
     }: NnProviderValues = useContext(NnContext);
    const userid = state?.user?.profile?.auth?.userid;
    const wallets = state?.user?.wallets;
    const [ fetched, setFetched ] = useState(false);

    const goFetchUserWallets = useCallback(() => {
        if (!fetched) {
            setFetched(true)
            fetchUserWallets();
        }
    }, [fetchUserWallets, fetched])

    useEffect(() => {
        const walletSize = wallets && wallets.length;
        walletSize === 0 && goFetchUserWallets();
    }, [wallets, fetchUserWallets, fetched, goFetchUserWallets]);

    return (
        <Container disableGutters sx={{marginTop: '74px'}}>
            <div
                className={styles.darkPane}
                data-augmented-ui="tl-clip-x tr-rect br-clip bl-clip both"
                style={{
                    minHeight: 'calc(100vh - 84px)'
                }}
            >
                <h1>{userid}</h1>
                <h1>{JSON.stringify(wallets)}</h1>
            </div>
        </Container>
    )
}