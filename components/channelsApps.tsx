'use client';
import React, { useCallback, useContext, useEffect, useState, useMemo } from 'react';
import styles from '../styles/generic.module.css';
import { Context as NnContext } from '../components/context/nnContext';
import { NnProviderValues } from '../components/context/nnTypes';
import SimpleScrollContainer from './simpleScrollContainer';
import FooterNav from './footerNav';
import { 
  Container,
  Box,
} from '@mui/material';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import { Stack } from '@mui/system';
import { use100vh } from 'react-div-100vh';


interface ChannelsAppProps {};

const flexContainer = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'nowrap',
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
  minWidth: '100%',
  minHeight: '50vh',
  overflow: 'hidden',
};

const flexFooter = {
  order: 0,
  flex: '0 1 24px',
  alignSelf: 'flex-end',
  width: '100%',
};

export default function ChannelsApp(props: ChannelsAppProps):JSX.Element {
  const FULL_HEIGHT = use100vh() || 600;
  const FLEX_HEIGHT = FULL_HEIGHT - 75;
  const SCROLL_HEIGHT = FULL_HEIGHT - 114;
  const { 
    state,
    fetchUserContacts = () =>{},
  }: NnProviderValues = useContext(NnContext);
  const contacts = state?.network?.collections?.contacts || [];
  const sortedContacts = contacts.sort((a, b) => a.username.localeCompare(b.username))

  const [ contactsFetched, setContactsFetched ] = useState(false);

  const goFetchContacts = useCallback(() => {
    if (!contactsFetched) {
      fetchUserContacts();
      setContactsFetched(true);
    }
  }, [contactsFetched, fetchUserContacts])

  return (
    <Container disableGutters style={{height: '100%'}}>
      <div
        className={styles.darkPane}
        style={{height: '100%', maxHeight: 'calc(100% - 74px)', marginTop: '70px'}}
        data-augmented-ui="tl-clip-x tr-rect br-clip bl-clip both"
      >
        <Box sx={{...flexContainer, minHeight: FLEX_HEIGHT, maxHeight: FLEX_HEIGHT}}>
          <Box sx={{...flexBody, maxHeight: SCROLL_HEIGHT }}>
            <SimpleScrollContainer>
              <Box sx={{minWidth: '100%', minHeight: '100%'}}>
                <Stack spacing={0} sx={{ display: 'flex' }}>
                  {sortedContacts && sortedContacts.map(item => {
                    return (
                      <div
                        key={`${item.id}`}
                        id={item.id || ''}
                      >{item.username}</div>
                    )
                  })}
                </Stack>
              </Box>
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