'use client';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import styles from '../styles/generic.module.css';
import { Context as NnContext } from '../components/context/nnContext';
import { NnProviderValues } from '../components/context/nnTypes';
import SimpleScrollContainer from './simpleScrollContainer';
import { 
    Container,
    Typography,
    Box,
    Grid,
    Fab,
    ToggleButton,
    ToggleButtonGroup,
    FormControl,
    InputLabel,
    InputAdornment,
    OutlinedInput,
} from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import InputUser from './inputUser';


interface CashAppProps {
}

type HTMLElementEvent<T extends HTMLElement> = Event & {
    target: T;
  }

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

export default function CashApp(props:CashAppProps):JSX.Element {

    const { 
        state,
        fetchUserWallets = () => {},
     }: NnProviderValues = useContext(NnContext);

    const wallets = state?.user?.wallets;
    const [ fetched, setFetched ] = useState(false);
    const [ selected, setSelected ] = useState(0);
    const [ transaction, setTransaction ] = useState('pay');
    const [ userSelectType, setUserSelectType ] = useState('pay');
    const [ transactionValue, setTransactionValue ] = useState<number | string>(0);
    const balance = wallets && wallets[selected]?.balance;

    const goFetchUserWallets = useCallback(() => {
        if (!fetched) {
            setFetched(true)
            fetchUserWallets();
        }
    }, [fetchUserWallets, fetched])

    const handleRequestToggle = (event: React.MouseEvent<HTMLElement>, nextTransaction: string) => {
        setTransaction(nextTransaction);
    }
    const handleTransactionAmount = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const newValue = event.currentTarget.value;
        setTransactionValue(newValue as unknown as number);
    }
    const handleFocusClear = () => {
        setTransactionValue('');
    }
    const handleBlurReZero = () => {
        transactionValue === '' && setTransactionValue(0);
    }

    useEffect(() => {
        const walletSize = wallets && wallets.length;
        walletSize === 0 && goFetchUserWallets();
    }, [wallets, fetchUserWallets, fetched, goFetchUserWallets]);

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
                                    <Typography variant='h2' sx={{ fontSize: { xs: '2.5rem', sm: '3rem', md: '3.75rem' }}}>&nbsp;{balance}</Typography>
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
                        <div
                        className={styles.togglePanel}
                        data-augmented-ui="inlay"
                    >
                            <ToggleButtonGroup
                                color="primary"
                                exclusive
                                aria-label="Transaction"
                                sx={{width: '100%'}}
                                onChange={handleRequestToggle}
                            >
                                <ToggleButton 
                                    value="pay"
                                    selected={transaction == 'pay'}
                                    sx={{width: '50%'}}
                                >
                                <Typography variant='h6'>Pay </Typography><TrendingDownIcon sx={{marginLeft: '10px'}}/> 
                                </ToggleButton>
                                <ToggleButton
                                    value="request"
                                    selected={transaction == 'request'}
                                    sx={{width: '50%'}}
                                >
                                <Typography variant='h6'>Request </Typography><TrendingUpIcon sx={{marginLeft: '10px'}} /> 
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </div>
                        <div style={{padding: '2vh'}}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-amount"
                                    sx={{ fontSize: '10vh'}}
                                    inputProps={{
                                        style: { textAlign: 'right', fontFamily:'jura' },
                                    }}
                                    placeholder="0"
                                    onChange={handleTransactionAmount}
                                    onFocus={handleFocusClear}
                                    onBlur={handleBlurReZero}
                                    value={transactionValue}
                                    type="number"
                                    endAdornment={<InputAdornment position="end">c±sн</InputAdornment>}
                                    label="Amount"
                                />
                            </FormControl>
                        </div>
                        <div style={{padding: '2vh'}}>
                            <InputUser />
                        </div>
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
                            <Fab color="secondary" aria-label="scan" sx={{ transform: 'rotate(-20deg)'}}>
                                <QrCodeScannerIcon  sx={{ fontSize: '40px'}} />
                            </Fab>
                            <Fab color="secondary" aria-label="send" sx={{ height: '100px', width: '100px'}}>
                                <CurrencyExchangeIcon sx={{ fontSize: '70px'}} />
                            </Fab>
                            <Fab color="secondary" aria-label="scan" sx={{ transform: 'rotate(20deg)'}}>
                                <ReceiptLongIcon  sx={{ fontSize: '40px'}} />
                            </Fab>
                        </Box>
                    </div>
                </Box>
            </Box>
        </div>
        </Container>
    )
}