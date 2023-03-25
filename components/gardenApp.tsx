'use client';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import styles from '../styles/generic.module.css';
import { Context as NnContext } from './context/nnContext';
import { NnProviderValues, NnStatus } from './context/nnTypes';
import SimpleScrollContainer from './simpleScrollContainer';
import ItemContact from './itemContact';
import ItemStatus from './itemStatus';
import FooterNav from './footerNav';
import { 
  Container,
  Box,
  CircularProgress
} from '@mui/material';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { Stack } from '@mui/system';
import { use100vh } from 'react-div-100vh';


type filters = {
  class?: string;
  from?: string;
}

interface FactionsAllAppProps {
  filter: filters;
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

export default function GardenApp(props: FactionsAllAppProps):JSX.Element {
  const { filter } = props;
  const FULL_HEIGHT = use100vh() || 600;
  const FLEX_HEIGHT = FULL_HEIGHT - 75;
  const SCROLL_HEIGHT = FULL_HEIGHT - 114;
  const { 
    state,
    fetchUserStatuses = (id:string) =>{},
    setUserStatus = (id:string, status: string) =>{},
  }: NnProviderValues = useContext(NnContext);
  const statuses:NnStatus[]  = useMemo(() => {
    const statuses = state?.network?.collections?.statuses || [];
    const classFilteredStatuses = filter?.class ? statuses.filter(status => status.class === filter.class) : statuses;
    const filteredStatuses = filter?.from ? classFilteredStatuses.filter(status => status.from === filter.from) : classFilteredStatuses;
    return filteredStatuses;
  }, [filter?.class, filter?.from, state?.network?.collections?.statuses]);
  const userId = state?.user?.profile?.auth?.userid || '';
  const userName = state?.user?.profile?.meta?.username || userId || '';
  const accountId = state?.network?.selected?.account || '';
  const [ collectionFetched, setCollectionFetched ] = useState(false);

  const goFetchFactions = useCallback(() => {
    if (!collectionFetched) {
      fetchUserStatuses(userId);
      setCollectionFetched(true);
    }
  }, [collectionFetched, fetchUserStatuses, userId]);

  useEffect(() => {
    const factionsSize = statuses && statuses.length;
    factionsSize === 0 && !collectionFetched && goFetchFactions();
  }, [collectionFetched, goFetchFactions, statuses]);

  const handleBigAction = (status:string) => {
    setUserStatus(userId, status);
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
            {collectionFetched ? (
              <SimpleScrollContainer>
                <Box sx={{minWidth: '100%', minHeight: '100%'}}>
                  <Stack spacing={0} sx={{ display: 'flex' }}>
                    <ItemContact
                      subtitle={`${userName}'s Garden Activity`}
                      key={`admin-list`}
                    />
                    {statuses && statuses.length >= 1 && statuses.map(item => {
                      return (
                        <div
                          key={`${item.id}-container`}
                        >
                          <ItemStatus
                            id={item.id}
                            username={item.from}
                            date={item.ts}
                            text={item.body}
                            collection="status"
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
                handleAction: handleBigAction,
                dialog: 'What would you like to share?',
                useInput: true,
              }}
            />
          </Box>
        </Box>
      </div>
    </Container>
  )
}