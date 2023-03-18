'use client';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import pLimit from 'p-limit';
import z from 'zod';
import styles from '../styles/generic.module.css';
import { Context as NnContext } from '../components/context/nnContext';
import { NnProviderValues } from '../components/context/nnTypes';
import SimpleScrollContainer from './simpleScrollContainer';
import InputBalance from './inputBalance';
import FooterNav from './footerNav';
import { 
  Container,
  Box,
  FormControl,
  InputLabel,
  InputAdornment,
  OutlinedInput,
  Stack
} from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import QrCodeIcon from '@mui/icons-material/QrCode';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import InputUser from './inputUser';
import { use100vh } from 'react-div-100vh';
import ToggleButtons from './toggleButtons';


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
  flex: '0 1 50px',
  alignSelf: 'flex-end',
  width: '100%',
};

export default function CashApp(props: CashAppProps):JSX.Element {
  const FULL_HEIGHT = use100vh() || 600;
  const FLEX_HEIGHT = FULL_HEIGHT - 75;
  const SCROLL_HEIGHT = FULL_HEIGHT - 114;
  const requests = [
    {label: 'Pay', value:'pay', icon: <TrendingDownIcon />},
    {label: 'Request', value:'request', icon: <TrendingUpIcon />},
  ];
  const { 
    state,
    fetchUserWallets = () => {},
    requestPayment = (user:string, amount:string) => {},
    sendPayment = (user:string, amount:string) => {},
    sendFactionPayment = (faction: string, user:string, amount:string) => {},
  }: NnProviderValues = useContext(NnContext);
  const [ fetched, setFetched ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [ processTypeValue, setProcessTypeValue ] = useState(requests[0].value); // TODO: refactor to payload form object
  const [ transactionValue, setTransactionValue ] = useState<number | string>(0); // TODO: refactor to payload form object
  const [ recpientsValue, setRecpientsValue ] = useState<string[]>([]); // TODO: refactor to payload form object
  const [ errFields, setErrFields ] = useState<(string | number)[]>([]);
  const wallets = useMemo(() => { 
    return state?.user?.wallets || [];
  }, [state]);
  const accountId = state?.network?.selected?.account || '';
  const selected = wallets?.map(function(x) {return x.id; }).indexOf(accountId) || 0;
  const wallet = wallets[selected];
  const balance = wallet ? wallet?.balance : null;

  const usergroups = [
    { 
      label: 'Contacts',
      value: 'contact',
      icon: <PeopleAltIcon />,
      users: state?.network?.collections?.contacts || [],
    },
    { 
      label: 'Scanned',
      value: 'scanned',
      icon: <QrCodeIcon />,
      users: [],
    },
    { 
      label: 'Faction',
      value: 'faction',
      icon: <SupervisedUserCircleIcon />,
      users: state?.user?.factions || [],
    },
  ]

  const goFetchUserWallets = useCallback(() => {
    if (!fetched) {
      setFetched(true);
      fetchUserWallets();
    }
  }, [fetchUserWallets, fetched])

  const handleRequestToggle = ( nextTransaction: string) => {
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
        if(selected === 0) {
          limit(() =>{ sendPayment(userId, transactionValue as string)});
        } else {
          limit(() =>{ sendFactionPayment(accountId, userId, transactionValue as string)});
        }
        break;
      case 'request':
        if (userId.charAt(0) !== ('c' || 'C')) { //TODO: request money from factions...?
          limit(() =>{ requestPayment(userId, transactionValue as string)});
        }
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
        <Box sx={{...flexContainer, minHeight: FLEX_HEIGHT, maxHeight: FLEX_HEIGHT}}>
          <Box sx={flexHeader}>
            <Container sx={{paddingTop: '20px'}}>
              <InputBalance balance={balance} />
            </Container>
          </Box>
          <Box sx={{...flexBody, maxHeight: SCROLL_HEIGHT }}>
            <SimpleScrollContainer>
              <Stack>
                <ToggleButtons
                  handleAction={handleRequestToggle}
                  requests={requests}
                  defaultButton={requests[0].value}
                />
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
                  <InputUser
                    changeHandler={handleRecipient}
                    value={recpientsValue}
                    contactGroups={usergroups}
                    selectLimit={20}
                    error={hasErr('recipients')}
                  />
                </div>
              </Stack>
            </SimpleScrollContainer>
          </Box>
          <Box sx={flexFooter}>
            <FooterNav
              bigHexProps={{
                icon: <CurrencyExchangeIcon />,
                handleAction: handleSubmit,
                loading: loading,
                disabled: loading,
              }}
              thirdHexProps={{
                icon: <QueryStatsIcon />,
                link: "/cash/history",
              }}
              secondHexProps={{
                icon: <QrCodeScannerIcon />,
                disabled: true,
              }}
            />
          </Box>
        </Box>
      </div>
    </Container>
  )
}