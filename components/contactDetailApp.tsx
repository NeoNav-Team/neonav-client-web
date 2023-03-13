'use client';
import React, { useCallback, useContext, useState, useEffect, useMemo } from 'react';
import styles from '../styles/card.module.css';
import { Context as NnContext } from './context/nnContext';
import { nnEntity, NnProviderValues } from './context/nnTypes';
import SimpleScrollContainer from './simpleScrollContainer';
import FooterNav from './footerNav';
import { 
  Container,
  Box,
} from '@mui/material';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { Stack } from '@mui/system';
import { use100vh } from 'react-div-100vh';


interface ContactsAppProps {
  params: {
    id: string;
  }
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

export default function ContactDetailApp(props: ContactsAppProps):JSX.Element {
  const { params } = props;
  const { id } = params;
  const FULL_HEIGHT = use100vh() || 600;
  const FLEX_HEIGHT = FULL_HEIGHT - 75;
  const SCROLL_HEIGHT = FULL_HEIGHT - 114;
  const { 
    state,
    fetchContact = (id:string) =>{},
    unfriend = (id:string) => {},
  }: NnProviderValues = useContext(NnContext);
  const userId:string = id || '';
  const entity:nnEntity  = useMemo(() => {
    return state?.network?.entity || {};
  }, [state]);
  const [ fetched, setFetched ] = useState(false);

  const goFetchUser = useCallback(() => {
    if (!fetched) {
      fetchContact(userId);
      setFetched(true);
    }
  }, [fetched, fetchContact, userId]);

  useEffect(() => {
    if (typeof entity?.id === 'undefined' || entity?.id !== id) {
      goFetchUser();
    }
  }, [entity, goFetchUser]);

  const goUnfriend = () =>  {
    unfriend(userId);
  }

  return (
    <Container disableGutters style={{height: '100%'}}>
      <div
        className={styles.idCardFrame}
        style={{height: '100%', maxHeight: 'calc(100% - 74px)', marginTop: '70px'}}
        data-augmented-ui="tr-clip-x br-clip bl-clip both"
      >
        <Box sx={{...flexContainer, minHeight: FLEX_HEIGHT, maxHeight: FLEX_HEIGHT}}>
          <Box sx={{...flexBody, maxHeight: SCROLL_HEIGHT }}>
            <div
              className={styles.idCard}
              style={{height: '100%'}}
              data-augmented-ui="tr-clip-x br-clip bl-clip both"
            >
              <SimpleScrollContainer>
                <Box sx={{minWidth: '100%', minHeight: '100%'}}>
                  <Stack spacing={0} sx={{ display: 'flex' }}>
                    {entity?.image  && (<img src={entity?.image || ''} width="100%" alt='😃' />)}
                    {entity?.type} <br />
                    {userId} <br />
                    {entity?.name} <br />
                    {entity?.description} <br />
                    {JSON.stringify(entity?.meta)}
                  </Stack>
                </Box>
              </SimpleScrollContainer>
            </div>
          </Box>
          <Box sx={flexFooter}>
            <FooterNav
              firstHexProps={{
                icon: <PersonRemoveIcon />,
                handleAction: goUnfriend,
              }}
              secondHexProps={{
                disabled: true,
              }}
              bigHexProps={{
                disabled: true,
              }}
              thirdHexProps={{
                disabled: true,
              }}
              fourthHexProps={{
                disabled: true,
              }}
            />
          </Box>
        </Box>
      </div>
    </Container>
  )
}