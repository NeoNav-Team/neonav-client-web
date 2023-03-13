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
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { Stack } from '@mui/system';
import { use100vh } from 'react-div-100vh';


interface ContactsAppProps {};

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

export default function ContactsApp(props: ContactsAppProps):JSX.Element {
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
  }, [contactsFetched, fetchUserContacts]);

  const scanForContact = () =>  {
    console.log('scanning');
  }

  const isNewLetter = (a:NnContact, b:NnContact) => {

    return a?.username.toLowerCase().charAt(0) !== b?.username.toLowerCase().charAt(0)
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
                  {sortedContacts && sortedContacts.map((item, index) => {
                    return (
                      <div
                        key={`${item.id}-container`}
                      >
                        {isNewLetter(sortedContacts[index], sortedContacts[index - 1]) ? <ItemContact
                          subtitle={item.username.charAt(0).toUpperCase()}
                          key={`${item.username.charAt(0).toUpperCase()}-list`}
                        />  : null}
                        <ItemContact
                          key={`${item.id}`}
                          id={item.id || ''}
                          username={item.username}
                        />
                      </div> 
                    )
                  })}
                </Stack>
              </Box>
            </SimpleScrollContainer>
          </Box>
          <Box sx={flexFooter}>
            <FooterNav
              bigHexProps={{
                icon: <PersonSearchIcon />,
                disabled: true,
              }}
              thirdHexProps={{
                icon: <QrCodeScannerIcon />,
                disabled: true,
                handleAction: () => scanForContact,
              }}
            />
          </Box>
        </Box>
      </div>
    </Container>
  )
}