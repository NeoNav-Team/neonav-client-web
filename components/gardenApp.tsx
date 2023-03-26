'use client';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import styles from '../styles/generic.module.css';
import { Context as NnContext } from './context/nnContext';
import { NnProviderValues, NnStatus, nnEntity } from './context/nnTypes';
import SimpleScrollContainer from './simpleScrollContainer';
import SubheaderGarden from './subheaderEntity';
import ItemStatus from './itemStatus';
import FooterNav from './footerNav';
import { 
  Container,
  Box,
  CircularProgress
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import RateReviewIcon from '@mui/icons-material/RateReview';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import InboxIcon from '@mui/icons-material/Inbox';
import { Stack } from '@mui/system';
import { use100vh } from 'react-div-100vh';
import { IncomingMessage } from 'http';


type filters = {
  class?: string;
  from?: string;
}

interface GardenAppProps {
  incoming: boolean;
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

export default function GardenApp(props: GardenAppProps):JSX.Element {
  const FULL_HEIGHT = use100vh() || 600;
  const FLEX_HEIGHT = FULL_HEIGHT - 75;
  const SCROLL_HEIGHT = FULL_HEIGHT - 114;
  const { incoming = false } = props;
  const { 
    state,
    fetchUserStatuses = (id:string) => {},
    setUserStatus = (id:string, status: string) => {},
    fetchContact = (id:string) => {},
  }: NnProviderValues = useContext(NnContext);
  const [ filter, setFilter ] = useState(true)
  const statuses:NnStatus[]  = useMemo(() => {
    const statuses = state?.network?.collections?.statuses || [];
    return filter ? statuses.filter(status => status.class === 'public') : statuses;
  }, [filter, state?.network?.collections?.statuses]);
  const entity:nnEntity  = useMemo(() => {
    return state?.network?.entity || {};
  }, [state]);
  const userId = state?.user?.profile?.auth?.userid || '';
  const isAdmin = userId === entity.id;
  const [ collectionFetched, setCollectionFetched ] = useState(false);

  const goFetchFactions = useCallback(() => {
    if (userId.length >= 9 && !collectionFetched) {
      if (incoming) {
      fetchUserStatuses(userId);
      } else {
        fetchUserStatuses(userId);
      }
      fetchContact(userId);
      setCollectionFetched(true);
    }
  }, [collectionFetched, fetchContact, fetchUserStatuses, userId]);

  useEffect(() => {
    const factionsSize = statuses && statuses.length;
    factionsSize === 0 && !collectionFetched && goFetchFactions();
  }, [collectionFetched, goFetchFactions, statuses]);

  const handleBigAction = (status:string) => {
    setUserStatus(userId, status);
  }

  const toggleFilter = () => {
    setFilter(!filter);
  }

  return (
    <Container disableGutters style={{height: '100%'}}>
      <div
        className={styles.darkPane}
        style={{height: '100%', maxHeight: 'calc(100% - 74px)', marginTop: '70px'}}
        data-augmented-ui="tr-rect br-clip bl-clip both"
      >
        <Box sx={{...flexContainer, minHeight: FLEX_HEIGHT, maxHeight: FLEX_HEIGHT}}>
          <SubheaderGarden photo={entity.image} title={entity.name} />
          <Box sx={{...flexBody, maxHeight: SCROLL_HEIGHT }}>
            {collectionFetched ? (
              <><SimpleScrollContainer>
                <Box sx={{ minWidth: '100%', minHeight: '100%' }}>
                  <Stack spacing={0} style={{ display: 'flex', flexDirection: 'column-reverse' }}>
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
                            hidden={item.class !== 'public'}
                          />
                        </div>
                      );
                    })}
                  </Stack>
                </Box>
              </SimpleScrollContainer></>
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
              firstHexProps={{
                icon: filter ? <FilterListIcon /> : <FilterListOffIcon />,
                handleAction: toggleFilter,
                disabled: !isAdmin,
              }}
              secondHexProps={{
                disabled: true,
              }}
              bigHexProps={{
                icon: <RateReviewIcon />,
                handleAction: handleBigAction,
                dialog: 'What would you like to share?',
                useInput: true,
              }}
              thirdHexProps={{
                disabled: true,
                icon: <InboxIcon />
              }}
              fourthHexProps={{
                disabled: true,
                icon: <PersonSearchIcon />
              }}
            />
          </Box>
        </Box>
      </div>
    </Container>
  )
}