'use client';
import React, { 
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import styles from '../styles/generic.module.css';
import { Context as NnContext } from './context/nnContext';
import { NnProviderValues, NnContact, nnEntity } from './context/nnTypes';
import SimpleScrollContainer from './simpleScrollContainer';
import QrCodeReader from './qrCodeReader';
import ItemContact from './itemContact';
import FooterNav from './footerNav';
import { 
  Container,
  Box,
  Card,
  CardContent,
  Modal,
  Typography
} from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
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
const modelStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: '800px',
  boxShadow: 24,
};

export default function ContactsApp(props: ContactsAppProps):JSX.Element {
  const FULL_HEIGHT = use100vh() || 600;
  const FLEX_HEIGHT = FULL_HEIGHT - 75;
  const SCROLL_HEIGHT = FULL_HEIGHT - 114;
  const { collection = 'contacts' } = props;
  const { 
    state,
    addRecentScan = (entity:any) => {},
    befriend = (id:string) => {},
    fetchContact = (id:string) =>{},
    fetchUserContacts = (refresh?:boolean) =>{},
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
  const scannedEntity:nnEntity = useMemo(() => {
    return state?.network?.entity || {};
  }, [state]);
  const [ contactsFetched, setContactsFetched ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [ scanning, setScanning ] = useState(false);
  const [ openModel, setOpenModel ] = useState(false);
  const [ lastEntity, setLastEntity ] = useState({});

  const goFetchContacts = useCallback(() => {
    if (!contactsFetched) {
      fetchUserContacts();
      setContactsFetched(true);
    }
  }, [contactsFetched, fetchUserContacts]);
    
  const goSetRecentScan = useCallback(() => {
    addRecentScan(scannedEntity);
  }, [addRecentScan, scannedEntity]);


  const handleModelOpen = (submenu: string) => {
    setOpenModel(true);
  }

  const handleModelClose = () => setOpenModel(false);

  const handleIDScan = (result:string) => {
    handleModelClose();
    setScanning(true);
    setLoading(true);
    goFetchUser(result);
  }

  const goFetchUser = useCallback((result:string) => {
    if (!loading) {
      fetchContact(result);
      setLoading(true);
    }
  }, [loading, fetchContact]);

  useEffect(() => {
    if(sortedContacts.length <= 0 && !contactsFetched) {
      goFetchContacts();
    }
  }, [contactsFetched, goFetchContacts, loading, sortedContacts]);

  useEffect(() => {
    const clipboardEntities:any[] = state?.network?.collections?.clipboardEntities || [];
    const hasEntity = scannedEntity && typeof scannedEntity?.id !== 'undefined';
    const newEntity = hasEntity && !clipboardEntities.some(item => item.id == scannedEntity.id);
    if (newEntity && scanning) {
      goSetRecentScan();
      setScanning(false);
      setLoading(false);
    }
    if (hasEntity && collection === 'contacts' && scanning) {
      const friendId = scannedEntity?.id || '';
      befriend(friendId);
      setScanning(false);
      setLoading(false);
    }
  }, [befriend, collection, goSetRecentScan, scannedEntity, scanning, state?.network?.collections?.clipboardEntities]);

  useEffect(() => {
    if (lastEntity !== scannedEntity) {
      setLastEntity(scannedEntity);
      setLoading(false);
    }
  }, [scannedEntity, lastEntity]);

  const isNewLetter = (a:nnEntity, b:nnEntity) => {
    const aName = a?.username || a?.name || '';
    const bName = b?.username || b?.name || '';
    return aName.toLowerCase().charAt(0) !== bName.toLowerCase().charAt(0)
  }

  return (
    <Container disableGutters style={{height: '100%', position: 'absolute', bottom: 0}}>
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
                  {collection === 'clipboard' && (<ItemContact
                    subtitle={'CLIPBOARD ENTITIES'}
                    key={`CLIPBOARD_ENTITIES-list`}
                  />)}
                  {sortedContacts && sortedContacts.map((item, index) => {
                    const displayname = item.username || item.name || item.userid  || item.id || '[NULL]';
                    return (
                      <div
                        key={`${item.id}-container`}
                      >
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
              firstHexProps={{
                icon: <DriveFileRenameOutlineIcon />,
                handleAction: handleIDScan,
                dialog: 'User ID',
                useInput: true,
                disabled: loading,
              }}
              secondHexProps={{
                icon: <QrCodeScannerIcon />,
                handleAction: handleModelOpen,
                disabled: loading,
              }}
            />
          </Box>
        </Box>
      </div>
      <Modal
        open={openModel}
        onClose={handleModelClose}
      >
        <Box sx={modelStyle}>
          <div
            className={styles.qrScanPane}
            data-augmented-ui="tl-clip tr-clip  bl-clip br-clip  both"
          >
            <QrCodeReader successHandler={result => handleIDScan(result)} />
          </div>
        </Box>
      </Modal>
    </Container>
  )
}