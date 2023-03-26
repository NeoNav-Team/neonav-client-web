/* eslint-disable @next/next/no-img-element */
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
  Typography,
  LinearProgress,
} from '@mui/material';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import TocIcon from '@mui/icons-material/Toc';
import { Stack } from '@mui/system';
import { use100vh } from 'react-div-100vh';
import { defaultImg } from '@/utilites/defaultImg';


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

const sizedImage = {
  maxWidth: '400px',
  width: '100%',
  aspectRatio: '1 / 1',
  overflow: 'hidden',
}

const idCard = {
  justifyContent: 'center',
  padding: '10px',
  display: 'flex',
  alignItems: 'center',
}

const flavorText = {
  flex: '1 1 auto',
  padding: '5px',
  margin: '5px',
  overflow: 'auto',
  minWidth: '100%',
}

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
  }, [entity, goFetchUser, id]);

  const goUnfriend = () =>  {
    unfriend(userId);
    setFetched(false);
  }

  const name = (firstname: string, lastname: string) => {
    let name = 'N/A';
    if (firstname && lastname) {
      name = `${lastname}, ${firstname}`;
    } else if (lastname) {
      name = lastname;
    } else if (firstname) {
      name = firstname;
    }
    return name;
  };

  return (
    <Container disableGutters style={{height: '100%'}}>
      <div
        className={styles.idCardFrame}
        style={{height: '100%', maxHeight: 'calc(100% - 74px)', marginTop: '70px'}}
        data-augmented-ui="tr-clip-x br-clip bl-clip both"
      >
        <Box sx={{...flexContainer, minHeight: FLEX_HEIGHT, maxHeight: FLEX_HEIGHT}}>
          <Box sx={{...flexBody, maxHeight: SCROLL_HEIGHT, height: SCROLL_HEIGHT }}>
            {entity?.id === id ? (
              <div
                className={styles.idCard}
                style={{...idCard, flexDirection: 'column', height: SCROLL_HEIGHT - 80}}
                data-augmented-ui="tr-clip-x br-clip bl-clip both"
              >
                <div
                  className={styles.idCardPictureFrame}
                  style={{flex: '0 0 auto', ...sizedImage}}
                  data-augmented-ui="tl-clip-x tr-clip-x br-2-clip-x bl-clip-x both"
                >
                  <div style={{
                    ...sizedImage,
                    backgroundImage: `url("${entity?.image || defaultImg}")`,
                    backgroundSize: 'cover',
                  }}>
                    <Stack
                      direction="column"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ minHeight: '100%'}}
                    >
                      <Typography variant='h5'>{userId}</Typography>
                      <Typography variant='h4'>{entity?.name}</Typography>
                    </Stack>
                  </div>
                </div>
                <div 
                  className={styles.idCardFlavorText}
                  style={flavorText}
                  data-augmented-ui="tl-clip bl-clip both"
                >
                  <SimpleScrollContainer>
                    <Stack>
                      <Typography variant='h6' color="primary">Name</Typography>
                      <p>{name(entity?.meta?.firstname, entity?.meta?.lastname)}</p>
                      <Typography variant='h6' color="primary">Occupation</Typography>
                      <p>{entity?.meta?.occupation || 'N/A'}</p>
                      <Typography variant='h6' color="primary">Skills</Typography>
                      <p>{entity?.meta?.skills || 'N/A'}</p>
                      <Typography variant='h6' color="primary">Description</Typography>
                      <p>{entity?.description || 'N/A'}</p>
                    </Stack>
                  </SimpleScrollContainer>
                </div>
              </div>
            ) : (
              <LinearProgress  color="secondary" />
            )}
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
                icon: <LocalFloristIcon />,
                link: `/garden/${userId}`,
              }}
              fourthHexProps={{
                icon: <TocIcon />,
                link: '/contacts',
              }}
            />
          </Box>
        </Box>
      </div>
    </Container>
  )
}