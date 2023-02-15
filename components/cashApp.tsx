'use client';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import pLimit from 'p-limit';
import z from 'zod';
import styles from '../styles/generic.module.css';
import { Context as NnContext } from '../components/context/nnContext';
import { NnProviderValues } from '../components/context/nnTypes';
import SimpleScrollContainer from './simpleScrollContainer';
import InputBalance from './inputBalance';
import { 
    Alert,
    Container,
    CircularProgress,
    Typography,
    Box,
    Fab,
    ToggleButton,
    ToggleButtonGroup,
    FormControl,
    InputLabel,
    InputAdornment,
    OutlinedInput,
    Snackbar,
} from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import InputUser from './inputUser';


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
        closeAlert = () => {},
        fetchUserWallets = () => {},
        requestPayment = (user:string, amount:string) => {},
        sendPayment = (user:string, amount:string) => {},
     }: NnProviderValues = useContext(NnContext);

    const [ fetched, setFetched ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const [ selected, setSelected ] = useState(0);
    const [ processTypeValue, setProcessTypeValue ] = useState('pay');
    const [ transactionValue, setTransactionValue ] = useState<number | string>(0);
    const [ recpientsValue, setRecpientsValue ] = useState<string[]>([]);
    const [ errFields, setErrFields ] = useState<(string | number)[]>([]);
    const wallets = state?.user?.wallets;
    const wallet = wallets && wallets[selected];
    const balance = wallet ? wallet?.balance : null;
    const alert = state?.network?.alert;

    const goFetchUserWallets = useCallback(() => {
        if (!fetched) {
            setFetched(true);
            fetchUserWallets();
        }
    }, [fetchUserWallets, fetched])

    const handleRequestToggle = (event: React.MouseEvent<HTMLElement>, nextTransaction: string) => {
        setProcessTypeValue(nextTransaction);
    }
    const handleTransactionAmount = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const newValue = parseInt(event.currentTarget.value, 10);
        setTransactionValue(newValue as unknown as number);
        scrubErr('amount');
    }
    const handleFocusClear = () => {
        setTransactionValue('');
    }
    const handleBlurReZero = () => {
        transactionValue === '' && setTransactionValue(0);
    }
    const handleRecipient = (recipientArr: Array<string>) => {
        setRecpientsValue(recipientArr);
        scrubErr('recipients');
    }
    const handleSubmit = () => {
        //check for errors and submit
        if (loading) {
            return;
        } else {
            sendPayload();
        }
    }

    const handleAlertClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
        closeAlert();
    };

    const scrubErr = (errStr:string) => {
        const newErrFields = errFields;
        const scrubdex = errFields.indexOf(errStr);
        newErrFields.splice(scrubdex, 1);
        setErrFields(newErrFields);
    }
    const hasErr = (errStr:string) => {
        return errFields.indexOf(errStr) !== -1;
    }
    const resetCashForm = () => {
        setRecpientsValue([]);
        setTransactionValue(0);
    }

    const sendPayload = () => {
        //validate payload
        const data = z.object({
            recipients: z.array(z.string()).nonempty(),
            amount: z.number().min(1),
        }).safeParse({ 
            recipients: recpientsValue,
            amount: transactionValue === '' ? 0 : transactionValue as number,
        });
        // show errors or do process
        if (!data.success) {
            let errFields: (string | number)[] = [];
            data.error.issues.map(errObj => {
                errFields = [...errFields, ...errObj.path]
            });
            setErrFields(errFields);
        } else {
            setLoading(true);
            setErrFields([]);
            processTransactionQueue();
        }
    }

    const processTransactionQueue = () => {
        const transactionQueue = recpientsValue;
        const limit = pLimit(1);
        const promises:Function[] = transactionQueue.map( userId => {
            switch (processTypeValue) {
                case 'pay':
                    limit(() =>{ sendPayment(userId, transactionValue as string)});
                break;
                case 'request':
                    limit(() =>{ requestPayment(userId, transactionValue as string)});
                break;
            }
            return () => {};
        });

        const p = Promise.resolve(promises)
        .then((data)=>{
            fetchUserWallets();
            resetCashForm();
            setTimeout(()=> setLoading(false), 300); // shows indicator briefly for user feedback
        });
    }

    useEffect(() => {
        const walletSize = wallets && wallets.length;
        walletSize === 0 && goFetchUserWallets();
    }, [wallets, fetchUserWallets, fetched, goFetchUserWallets, selected]);



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
                                    selected={processTypeValue == 'pay'}
                                    sx={{width: '50%'}}
                                >
                                <Typography variant='h6'>Pay </Typography><TrendingDownIcon sx={{marginLeft: '10px'}}/> 
                                </ToggleButton>
                                <ToggleButton
                                    value="request"
                                    selected={processTypeValue == 'request'}
                                    sx={{width: '50%'}}
                                >
                                <Typography variant='h6'>Request </Typography><TrendingUpIcon sx={{marginLeft: '10px'}} /> 
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </div>
                        <div style={{padding: '2vh'}}>
                            <FormControl fullWidth error={hasErr('amount')}>
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
                            <InputUser changeHandler={handleRecipient} value={recpientsValue} error={hasErr('recipients')} />
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
                            <Fab color="secondary" aria-label="scan" sx={{ transform: 'rotate(-10deg)'}}>
                                <QrCodeScannerIcon  sx={{ fontSize: '40px'}} />
                            </Fab>
                            <Fab color="secondary"
                                aria-label="send"
                                disabled={loading}
                                sx={{ height: '100px', width: '100px'}}
                                onClick={handleSubmit}
                            >
                                {loading ? (
                                    <CircularProgress sx={{ fontSize: '70px'}} />
                                ) : (
                                    <CurrencyExchangeIcon sx={{ fontSize: '70px'}} />
                                )}
                            </Fab>
                            <Link href={'/cash/history'}>
                                <Fab color="secondary" aria-label="scan" sx={{ transform: 'rotate(10deg)'}}>
                                    <QueryStatsIcon  sx={{ fontSize: '40px'}} />
                                </Fab>
                            </Link>
                        </Box>
                    </div>
                </Box>
            </Box>
        </div>
        {/* Refactor below into the header since it now universal */}
        <Snackbar
          open={alert?.show}
          onClose={handleAlertClose}
          autoHideDuration={2500}
          style={{
            bottom: '15vh',
            filter: 'drop-shadow(rgb(255, 255, 255) 0px 0px 4px)'
        }}
        >
                <Alert 
                    severity={alert?.severity === 'error' ? 'error' : 'success'}
                    variant="outlined"
                >
                    {alert?.message}
                </Alert>
        </Snackbar>
    </Container>
    )
}