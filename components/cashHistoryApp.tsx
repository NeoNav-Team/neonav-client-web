'use client';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import styles from '../styles/generic.module.css';
import { Context as NnContext } from '../components/context/nnContext';
import { NnProviderValues, NnIndexCollection, NnCollection } from '../components/context/nnTypes';
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
        let filteredItem = null;
        let filteredCollection:NnCollection = []
        const filteredList = collection.filter(arrItem => arrItem.id == selectedId);
        if (filteredList.length) {
            filteredItem = filteredList[0];
            filteredCollection = filteredItem?.collection || [];
        }
        return filteredCollection;
    }

    const [ walletFetched, setWalletFetched ] = useState(false);
    const [ transactionsFetched, setTransactionsFetched ] = useState(false);
    const wallets = state?.user?.wallets;
    const personalWallet = wallets && wallets.filter(arrItem => arrItem.type == 'personal')[0];
    const selectedAccount = state?.network?.selected.account || personalWallet?.id;
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
        if (wallets && wallets.length !== 0 && !transactionsFetched) {
            const walletId = wallet?.id || '';
            fetchUserWalletHistory(walletId);
            setTransactionsFetched(true);
        }
    }, [wallets, transactionsFetched, fetchUserWalletHistory, wallet?.id])

    useEffect(() => {
        const walletSize = wallets && wallets.length;
        if (walletSize === 0) {
            goFetchWallets();
        }
    }, [wallets, goFetchWallets]);

    useEffect(() => {
        const walletHistorySize = transactions.length === 0;
        if (walletHistorySize) {
            goFetchWalletsHistory();
        }
    }, [wallets, goFetchWalletsHistory, transactions.length]);

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