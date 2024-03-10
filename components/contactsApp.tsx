'use client';
import React, { useCallback, useContext, useEffect,  useState } from 'react';
import styles from '../styles/generic.module.css';
import { Context as NnContext } from './context/nnContext';
import { NnProviderValues, NnContact, nnEntity } from './context/nnTypes';
import SimpleScrollContainer from './simpleScrollContainer';
import ItemContact from './itemContact';
import FooterNav from './footerNav';
import { 
  Container,
  Box,
  Card,
  CardContent,
  Typography
} from '@mui/material';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { Stack } from '@mui/system';
import { use100vh } from 'react-div-100vh';


const emptyMsg:{[key: string]: string } ={
  'loading': 'LOADING...',
  'contacts': 'Go make some friends!',
  'clipboard': 'Your clipboard is empty.',
}

interface ContactsAppProps {
  collection: string;
};

const flexContainer = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'nowrap',
  justifyContent: 'center',
  alignContent: 'space-around',
  alignItems: 'stretch',
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
  const { collection = 'contacts' } = props;
  const { 
    state,
    fetchUserContacts = () =>{},
  }: NnProviderValues = useContext(NnContext);
  const collections = (collectionType:string) => {
    let selectedCollection:nnEntity[] = [];
    switch (collectionType) {
    case 'contacts':
      selectedCollection = state?.network?.collections?.contacts || [];
      break;
    case 'clipboard':
      selectedCollection = state?.network?.collections?.clipboardEntities || [];
      break;
    }
    return selectedCollection;
  }
  const contacts:nnEntity[] = collections(collection);
  const sortedContacts:nnEntity[] = contacts.sort((a,b) => {
    const aName = a.username || a.name || '';
    const bName = b.username || b.name || '';
    return aName.localeCompare(bName) || 0;
  })

  const [ contactsFetched, setContactsFetched ] = useState(false);

  const goFetchContacts = useCallback(() => {
    if (!contactsFetched) {
      fetchUserContacts();
      setContactsFetched(true);
    }
  }, [contactsFetched, fetchUserContacts]);

  const scanForContact = () =>  {
    console.log('scanning');
    setContactsFetched(false);
  }

  useEffect(() => {
    if(sortedContacts.length <= 0 ) {
      goFetchContacts();
    }
  }, [goFetchContacts, sortedContacts]);

  const isNewLetter = (a:nnEntity, b:nnEntity) => {
    const aName = a?.username || a?.name || '';
    const bName = b?.username || b?.name || '';
    return aName.toLowerCase().charAt(0) !== bName.toLowerCase().charAt(0)
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
                    const displayname = item.username || item.name || item.userid  || item.id || '[NULL]';
                    return (
                      <div
                        key={`${item.id}-container`}
                      >
                        {collection === 'clipboard' && (<ItemContact
                          subtitle={'CLIPBOARD ENTITIES'}
                          key={`CLIPBOARD_ENTITIES-list`}
                        />)}
                        {collection === 'contacts' && 
                        isNewLetter(sortedContacts[index], sortedContacts[index - 1]) ? <ItemContact
                            subtitle={displayname.charAt(0).toUpperCase()}
                            key={`${displayname.charAt(0).toUpperCase()}-list`}
                          />  : null}
                        <ItemContact
                          key={`${item.id}`}
                          id={item.id || ''}
                          username={displayname}
                          thumbnail={item.thumbnail}
                        />
                      </div> 
                    )
                  })}
                  {sortedContacts.length <= 0 && (
                    <Card sx={{minWidth: '100%', minHeight: '100%', marginTop: '10%'}}>
                      <CardContent>
                        <Typography
                          variant="h5"
                          component="h2" 
                          sx={{minWidth: '100%', minHeight: '100%', textAlign: 'center'}}>
                          {contactsFetched ? emptyMsg[collection] : emptyMsg['loading']}
                        </Typography>
                      </CardContent>
                    </Card>
                  )} 
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