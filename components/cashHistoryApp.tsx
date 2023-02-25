'use client';
import React, { useCallback, useContext, useEffect, useState, useMemo } from 'react';
import styles from '../styles/generic.module.css';
import { Context as NnContext } from '../components/context/nnContext';
import { NnProviderValues, NnIndexCollection, NnCollection, NnWallet } from '../components/context/nnTypes';
import SimpleScrollContainer from './simpleScrollContainer';
import ItemTransaction from './itemTransaction';
import InputBalance from './inputBalance';
import FooterNav from './footerNav';
import { 
    Container,
    Box,
} from '@mui/material';
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
    minHeight: '50vh',
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

    const getFilteredCollection = (collection:NnIndexCollection[], selectedId?:string) => {
        let filteredItem:Record<string, any> = {};
        let filteredCollection:NnCollection = []
        const filteredList = collection.filter(arrItem => arrItem.id == selectedId);
        if (filteredList.length) {
            filteredItem = filteredList[0];
            filteredCollection = filteredItem?.collection || [];
        }
        return filteredCollection;
    }

    const getFilteredItemValue = (collection:Record<string, any>[], selectedId:string, returnKey:string) => {
        let filteredItem:Record<string, any> = {};
        let filteredValue:string = '';
        const filteredList = collection.filter(arrItem => arrItem.id == selectedId);
        if (filteredList.length) {
            filteredItem = filteredList[0];
            filteredValue = filteredItem && filteredItem[returnKey] || '';
        }
        return filteredValue;
    }


    const [ walletFetched, setWalletFetched ] = useState(false);
    const [ transactionsFetched, setTransactionsFetched ] = useState(false);
    const wallets = useMemo(() => {return state?.user?.wallets || [{}] }, [state]);
    const personalWallet = getFilteredItemValue(wallets, 'personal', 'id');
    const selectedAccount = state?.network?.selected.account || personalWallet;
    const wallet = wallets && wallets.filter(arrItem => arrItem.id == selectedAccount)[0];
    const balance = wallet ? wallet?.balance : null;
    const transactionCollections =  state?.network?.collections?.transactions || [];
    const transactions = getFilteredCollection(transactionCollections, selectedAccount); 

    const goFetchWallets = useCallback(() => {
        if (!walletFetched) {
            fetchUserWallets();
            setWalletFetched(true);
        }
    }, [walletFetched, fetchUserWallets])

    const goFetchWalletsHistory = useCallback(() => {
        if (!transactionsFetched) {
            const walletId = wallet?.id;
            const hasId = typeof walletId !== 'undefined';
            hasId && fetchUserWalletHistory(walletId);
            setTransactionsFetched(hasId);
        }
    }, [transactionsFetched, fetchUserWalletHistory, wallet])

    useEffect(() => {
        if (!wallets.length) {
            goFetchWallets();
        }
    }, [wallets, goFetchWallets]);

    useEffect(() => {
        if (!transactions.length) {
            goFetchWalletsHistory();
        }
    }, [transactions, goFetchWalletsHistory]);

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
                                    id={item.user || ''}
                                    date={item.ts || ''}
                                    username={item.username || ''}
                                    amount={item.amount || ''}
                                />
                               )
                            })}
                        </Stack>
                    </SimpleScrollContainer>
                </Box>
                <Box sx={flexFooter}>
                    <FooterNav
                        secondHexProps={{
                            disabled: true,
                        }}
                        bigHexProps={{
                            icon: <QueryStatsIcon />,
                            disabled: true,
                        }}
                        thirdHexProps={{
                            icon: <CurrencyExchangeIcon />,
                            link: "/cash",
                        }}
                    />
                </Box>
            </Box>
        </div>
    </Container>
    )
}