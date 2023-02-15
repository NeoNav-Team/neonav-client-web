'use client';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import styles from '../styles/generic.module.css';
import Link from 'next/link';
import { Context as NnContext } from '../components/context/nnContext';
import { NnProviderValues } from '../components/context/nnTypes';
import SimpleScrollContainer from './simpleScrollContainer';
import { 
    Container,
    Typography,
    Box,
    Grid,
    Fab,
} from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';


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
        fetchUserWalletHistory = (walletId:string) => {},
     }: NnProviderValues = useContext(NnContext);

    const [ fetched, setFetched ] = useState(false);
    const [ selected, setSelected ] = useState(0);
    const wallets = state?.user?.wallets;
    const wallet = wallets && wallets[selected];
    const balance = wallet ? wallet?.balance : null;

    const goFetchWalletsHistory = useCallback(() => {
        if (!fetched) {
            setFetched(true);
            fetchUserWalletHistory('banana');
        }
    }, [fetchUserWalletHistory, fetched])


    useEffect(() => {
        const walletSize = wallets && wallets.length;
        walletSize === 0 && goFetchWalletsHistory();
    }, [wallets, fetched, goFetchWalletsHistory, selected]);



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

                        <div
                            className={styles.presentValue}
                            data-augmented-ui="tl-clip-x tr-rect br-clip bl-clip both"
                            style={{padding: '2vh'}}
                        >
                            <Typography variant='h4' sx={{
                                color:'var(--color-0)',
                                filter: 'drop-shadow(var(--color-0) 0px 0px 5px)',
                                position: 'absolute',
                                opacity: '0.5',
                                fontSize: { xs: '1rem', sm: '1.5rem', md: '2.125rem' }
                            }}>
                                BALANCE
                            </Typography>
                            <Grid
                                container
                                direction="row"
                                justifyContent="flex-end"
                                alignItems="baseline"
                            >
                                <Grid>
                                    <Typography
                                        variant='h2' sx={{ fontSize: { xs: '2.5rem', sm: '3rem', md: '3.75rem' }}}>
                                        &nbsp;{balance}
                                    </Typography>
                                </Grid>
                                <Grid>
                                    <Typography variant='h4' sx={{
                                        color:'var(--color-0)',
                                        filter: 'drop-shadow(var(--color-0) 0px 0px 5px)',
                                        letterSpacing: { xs: '-0.121rem', sm: '-0.25rem', md: '-0.33rem' },
                                        fontSize: { xs: '1rem', sm: '1.5rem', md: '2.125rem' }
                                    }}>c±sн</Typography>
                                </Grid>
                            </Grid>
                        </div>
                    </Container>
                </Box>
                <Box sx={flexBody}>
                    <SimpleScrollContainer>

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