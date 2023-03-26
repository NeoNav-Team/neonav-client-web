'use client';
import React, { useCallback, useContext, useState } from 'react';
import styles from '../styles/generic.module.css';
import { Context as NnContext } from './context/nnContext';
import { NnProviderValues, NnContact } from './context/nnTypes';
import SimpleScrollContainer from './simpleScrollContainer';
import ItemContact from './itemContact';
import FooterNav from './footerNav';
import { 
  Container,
  Box,
} from '@mui/material';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist'
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import { Stack } from '@mui/system';
import { use100vh } from 'react-div-100vh';

const MAX_USERS = 25;


interface GardenSearchAppProps {};

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

export default function GardenSearchApp(props: GardenSearchAppProps):JSX.Element {
  const FULL_HEIGHT = use100vh() || 600;
  const FLEX_HEIGHT = FULL_HEIGHT - 75;
  const SCROLL_HEIGHT = FULL_HEIGHT - 114;
  const { 
    state,
    userSearch = (search:string) => {},
  }: NnProviderValues = useContext(NnContext);
  const searchArr:NnContact[] = state?.network?.collections?.entityUsers || [];
  const sortedSearch = searchArr.sort((a, b) => a.username.localeCompare(b.username))

  const [ contactsFetched, setContactsFetched ] = useState<boolean>(false);
  const [ search, setSearch ] = useState<string>('');

  const goSearch = useCallback((search:string) => {
    if (!contactsFetched) {
      userSearch(search);
      setContactsFetched(true);
    }
  }, [contactsFetched, userSearch]);

  const searchForContact = (search:string) =>  {
    console.log('scanning for', search);
    setContactsFetched(false);
    setSearch(search);
    goSearch(search);
  }

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
                  <ItemContact
                    subtitle={`Search for "${search.length >= 1 ? search : '...?'}"`}
                    key={'Search List'}
                  />
                  {sortedSearch && sortedSearch.map((item, index) => {
                    return (index <= MAX_USERS && (
                      <div
                        key={`${item.userid}-${index}-container`}
                      >
                        <ItemContact
                          key={`${item.userid}-${index}`}
                          id={item.userid || ''}
                          username={item.username}
                        />
                      </div> 
                    ))
                  })}
                </Stack>
              </Box>
            </SimpleScrollContainer>
          </Box>
          <Box sx={flexFooter}>
            
            <FooterNav
              firstHexProps={{
                disabled: true,
              }}
              secondHexProps={{
                disabled: true,
              }}
              bigHexProps={{
                icon: <PersonSearchIcon />,
                dialog: 'Search for a User',
                handleAction: searchForContact,
                useInput: true,
              }}
              thirdHexProps={{
                disabled: true,
              }}
              fourthHexProps={{
                icon: <LocalFloristIcon />,
                link: `/garden`,
              }}
            />
          </Box>
        </Box>
      </div>
    </Container>
  )
}