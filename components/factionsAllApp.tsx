'use client';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation'
import styles from '../styles/generic.module.css';
import { Context as NnContext } from './context/nnContext';
import { NnProviderValues, NnFaction, NnSimpleEntity } from './context/nnTypes';
import SimpleScrollContainer from './simpleScrollContainer';
import ItemContact from './itemContact';
import FooterNav from './footerNav';
import {
  Container,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { Stack } from '@mui/system';
import { use100vh } from 'react-div-100vh';


interface FactionsAllAppProps {};

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

export default function FactionsAllApp(props: FactionsAllAppProps):JSX.Element {
  const FULL_HEIGHT = use100vh() || 600;
  const FLEX_HEIGHT = FULL_HEIGHT - 75;
  const SCROLL_HEIGHT = FULL_HEIGHT - 114;
  const {
    state,
    fetchAllFactions = () =>{},
  }: NnProviderValues = useContext(NnContext);
  const sortedFactions:NnFaction[] | NnSimpleEntity[] = useMemo(() => {
    const factions = state?.network?.collections?.factions || [];
    return factions.sort((a, b) => {
      if (a.name && b.name) {
        return a.name.localeCompare(b.name);
      }
      else {
        return 0
      }
    });
  }, [state]);
  const accountId = state?.network?.selected?.account || '';
  const [ collectionFetched, setCollectionFetched ] = useState(false);
  const pathname = usePathname();
  const pathnameString = pathname ? pathname.toString() : '';

  const goFetchFactions = useCallback(() => {
    if (!collectionFetched) {
      fetchAllFactions();
      setCollectionFetched(true);
    }
  }, [collectionFetched, fetchAllFactions]);

  useEffect(() => {
    const factionsSize = sortedFactions && sortedFactions.length;
    factionsSize === 0 && goFetchFactions();
  }, [goFetchFactions, sortedFactions]);

  useEffect(() => {
    const storedScroll = sessionStorage.getItem(pathnameString);
    const scroller = document.getElementById('simpleScoll');
    if (scroller && storedScroll) {
      scroller.scrollTop = parseInt(storedScroll);
      sessionStorage.removeItem(pathnameString);
    }
    const intervalId = setInterval(saveScrollPos, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const saveScrollPos = () => {
    const scroller = document.getElementById('simpleScoll');
    if (scroller) {
      sessionStorage.setItem(pathnameString, scroller.scrollTop.toString());
    }
  };

  return (
    <Container disableGutters style={{height: '100%'}}>
      <div
        className={styles.darkPane}
        style={{height: '100%', maxHeight: 'calc(100% - 74px)', marginTop: '70px'}}
        data-augmented-ui="tl-clip-x tr-rect br-clip bl-clip both"
      >
        <Box sx={{...flexContainer, minHeight: FLEX_HEIGHT, maxHeight: FLEX_HEIGHT}}>
          <Box sx={{...flexBody, maxHeight: SCROLL_HEIGHT }}>
            {sortedFactions.length !== 0 ?(
              <SimpleScrollContainer>
                <Box sx={{minWidth: '100%', minHeight: '100%'}}>
                  <Stack spacing={0} sx={{ display: 'flex' }}>
                    <ItemContact
                      subtitle={'All Factions'}
                      key={`admin-list`}
                    />
                    {sortedFactions && sortedFactions.map((item) => {
                      return (
                        <div
                          key={`${item.id}-container`}
                        >
                          <ItemContact
                            key={`${item.id}`}
                            id={item.id || ''}
                            username={item.name}
                            thumbnail={(item as NnFaction).thumbnail}
                            collection="factions"
                          />
                        </div>
                      )
                    })}
                  </Stack>
                </Box>
              </SimpleScrollContainer>
            ) : (
              <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                sx={{minHeight: '100%'}}
              >
                <CircularProgress color="secondary" />
              </Stack>
            )}
          </Box>
          <Box sx={flexFooter}>
            <FooterNav
              bigHexProps={{
                icon: <RateReviewIcon />,
                disabled: true,
              }}
            />
          </Box>
        </Box>
      </div>
    </Container>
  )
}
