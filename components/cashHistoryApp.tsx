'use client';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import styles from '../styles/generic.module.css';
import Link from 'next/link';
import { Context as NnContext } from '../components/context/nnContext';
import { NnProviderValues } from '../components/context/nnTypes';
import SimpleScrollContainer from './simpleScrollContainer';
import ItemTransaction from './itemTransaction';
import InputBalance from './inputBalance';
import { 
    Container,
    Box,
    Fab,
} from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import { Stack } from '@mui/system';


interface CashAppProps {};

const flexContainer = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'space-around',
    alignItems: 'stretch',
};
  
const flexHeader = {
    order: 0,
    flex: '0 1 64px',
    alignSelf: 'flex-start',
    width: '100%',
};

const flexBody = {
    order: 0,
    flex: '1',
    alignSelf: 'auto',
    width: '100%',
    overflow: 'hidden',
};

const flexFooter = {
    order: 0,
    flex: '0 1 24px',
    alignSelf: 'flex-end',
    width: '100%',
};

export default function CashApp(props: CashAppProps):JSX.Element {

    const { 
        state,
        fetchUserWallets = () =>{},
        fetchUserWalletHistory = (walletId:string) => {},
     }: NnProviderValues = useContext(NnContext);

    const [ walletFetched, setWalletFetched ] = useState(false);
    const [ transactionsFetched, setTransactionsFetched ] = useState(false);
    const [ selected, setSelected ] = useState(0);
    const wallets = state?.user?.wallets;
    const wallet = wallets && wallets[selected];
    const balance = wallet ? wallet?.balance : null;
    const transactions = wallet ? wallet?.transactions : null;

    const goFetchWallets = useCallback(() => {
        if (!walletFetched) {
            fetchUserWallets();
            setWalletFetched(true);
        }
    }, [walletFetched, fetchUserWallets])

    const goFetchWalletsHistory = useCallback(() => {
        if (wallets && wallets.length !== 0 && !transactionsFetched) {
            const walletId = wallets && wallets[selected] && wallets[selected].id || '';
            fetchUserWalletHistory(walletId);
            setTransactionsFetched(true);
        }
    }, [transactionsFetched, wallets, selected, fetchUserWalletHistory])

    useEffect(() => {
        const walletSize = wallets && wallets.length;
        if (walletSize === 0) {
            goFetchWallets();
        }
    }, [wallets, goFetchWallets]);

    useEffect(() => {
        const walletHistorySize = wallets && typeof wallets[0]?.transactions === 'undefined';
        if (walletHistorySize) {
            goFetchWalletsHistory();
        }
    }, [wallets, goFetchWalletsHistory, selected]);

    return (
        <Container disableGutters style={{height: '100%'}}>
             <div
                className={styles.darkPane}
                style={{height: '100%', maxHeight: 'calc(100% - 74px)', marginTop: '70px'}}
                data-augmented-ui="tl-clip-x tr-rect br-clip bl-clip both"
            >
            <Box sx={flexContainer}>
                <Box sx={flexHeader}>
                <Container sx={{paddingTop: '20px'}}>
                    <InputBalance balance={balance} />
                </Container>
                </Box>
                <Box sx={flexBody}>
                    <SimpleScrollContainer>
                        <Stack spacing={1}>
                            {transactions && transactions.map(item => {
                               return (
                                <ItemTransaction
                                    key={`${item.user}_${item.ts}`}
                                    id={item.user}
                                    date={item.ts}
                                    username={item.username}
                                    amount={item.amount}
                                />
                               )
                            })}
                        </Stack>
                    </SimpleScrollContainer>
                </Box>
                <Box sx={flexFooter}>
                    <div
                        className={styles.lightPane}
                        style={{
                            height: '24px',
                        }}
                        data-augmented-ui="t-clip-x br-clip bl-clip both"
                    >
                    </div>
                    <div style={{ height: 0, marginTop: '-135px', textAlign: 'center' }}>
                        <Box sx={{ '& > :not(style)': { m: 2 } }}>
                            <Fab color="secondary" aria-label="scan" sx={{ transform: 'rotate(-10deg)'}}>
                                <QrCodeScannerIcon  sx={{ fontSize: '40px'}} />
                            </Fab>
                            <Fab color="secondary"
                                aria-label="send"
                                disabled
                                sx={{ height: '100px', width: '100px'}}
                            >
                                <QueryStatsIcon sx={{ fontSize: '70px'}} />
                            </Fab>
                            <Link href={'/cash'}>
                                <Fab color="secondary" aria-label="scan" sx={{ transform: 'rotate(10deg)'}}>
                                    <CurrencyExchangeIcon  sx={{ fontSize: '40px'}} />
                                </Fab>
                            </Link>
                        </Box>
                    </div>
                </Box>
            </Box>
        </div>
    </Container>
    )
}