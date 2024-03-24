'use client';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import styles from '../styles/generic.module.css';
import { Context as NnContext } from './context/nnContext';
import { NnProviderValues, NnStatus, nnEntity } from './context/nnTypes';
import SimpleScrollContainer from './simpleScrollContainer';
import { isJsonStringValid } from '@/utilities/json';
import ItemStatus from './itemStatus';
import FooterNav from './footerNav';
import { 
  Container,
  Box,
  CircularProgress,
  Tab,
  Tabs,
  Divider,
  Typography
} from '@mui/material';
import ListIcon from '@mui/icons-material/List';
import OutboxIcon from '@mui/icons-material/Outbox';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import { Stack } from '@mui/system';
import { use100vh } from 'react-div-100vh';

interface GardenAppProps {
  params: {
    factionId?:string,
    outbound?: boolean,
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
  const { params } = props;
  const { outbound, factionId } = params;
  const { 
    state,
    fetchUserStatuses = (id:string) => {},
    fetchUserSetStatuses = (id:string) => {},
  }: NnProviderValues = useContext(NnContext);
  const [ filter, setFilter ] = useState(true)
  const statusesPublic:NnStatus[]  = useMemo(() => {
    const statuses = state?.network?.collections?.statuses || [];
    return filter ? statuses.filter(status => status.class === 'public') : statuses;
  }, [filter, state?.network?.collections?.statuses]);
  const statusesPrivate:NnStatus[]  = useMemo(() => {
    const statuses = state?.network?.collections?.statuses || [];
    return filter ? statuses.filter(status => status.class !== 'public') : statuses;
  }, [filter, state?.network?.collections?.statuses]);
  const statusesHidden:NnStatus[]  = useMemo(() => {
    const statuses = state?.network?.collections?.statuses || [];
    return filter ? statuses.filter(status => status.class === 'hidden') : statuses;
  }, [filter, state?.network?.collections?.statuses]);
  const userId = state?.user?.profile?.auth?.userid || '';
  const [ collectionFetched, setCollectionFetched ] = useState(false);
  const [ tabIndex, setTabIndex ] = useState(1);
  const statusArr = [statusesPrivate, statusesPublic, statusesHidden];

  const goFetchStatues = useCallback(() => {
    if (userId.length >= 3 && !collectionFetched) {
      if (outbound) {
        fetchUserSetStatuses(factionId || userId || '');
      } else {
        fetchUserStatuses(factionId || userId || '');
      }
      setCollectionFetched(true);
    }
  }, [collectionFetched, factionId, fetchUserSetStatuses, fetchUserStatuses, outbound, userId]);

  useEffect(() => {
    !collectionFetched && goFetchStatues();
  }, [collectionFetched, goFetchStatues]);
  

  const handleTabs =  (event: React.SyntheticEvent, newIndex: number) => {
    setTabIndex(newIndex);
  }

  const boxLink = () => {
    let dir = factionId ? `/factions/${factionId}/status/` : '/status/';
    let boxType = outbound ? 'inbox' : 'outbox';
    return dir + boxType;
  }

  return (
    <Container disableGutters style={{height: '100%', position: 'absolute', bottom: 0}}>
      <div
        className={styles.darkPane}
        style={{height: '100%', maxHeight: 'calc(100% - 74px)', marginTop: '70px'}}
        data-augmented-ui="tr-rect br-clip bl-clip both"
      >
        <Box sx={{...flexContainer, minHeight: FLEX_HEIGHT, maxHeight: FLEX_HEIGHT}}>
          <Box>
            <Divider variant="middle"  color="primary">
              <Typography variant="h6">{outbound ? 'Outbox' : 'Inbox'}</Typography>
            </Divider>
          </Box>
          <Tabs value={tabIndex} onChange={handleTabs} aria-label="basic tabs example">
            <Tab label="Private" />
            <Tab label="Public" />
            {outbound && (<Tab label="Hidden" />)}
          </Tabs>
          <Box sx={{...flexBody, maxHeight: SCROLL_HEIGHT }}>
            {collectionFetched ? (
              <SimpleScrollContainer>
                <Box sx={{ minWidth: '100%', minHeight: '100%' }}>
                  <Stack spacing={0} style={{ display: 'flex', flexDirection: 'column-reverse' }}>
                    {statusArr && statusArr[tabIndex].length >= 1 && statusArr[tabIndex].map(item => {
                      const { id, ts, from, body, sender } = item;
                      const {type = null, value = null, tag = null } = isJsonStringValid(body || '') && JSON.parse(body || '');
                      const stringTags:String[] = (body || '').match(/#\w+/g) || [];
                      return (
                        <div
                          key={`${item.id}-container`}
                        >
                          <ItemStatus
                            id={id}
                            username={from}
                            userid={sender}
                            date={ts}
                            text={body}
                            action={type}
                            value={value}
                            tag={type ? tag : stringTags[0]}
                            collection="status"
                            hidden={item.class !== 'public'}
                          />
                        </div>
                      );
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
              firstHexProps={{
                disabled: true,
              }}
              secondHexProps={{
                disabled: true,
              }}
              bigHexProps={{
                disabled: true,
              }}
              thirdHexProps={{
                icon: outbound ? <OutboxIcon /> : <MoveToInboxIcon />,
                link: boxLink(),
              }}
              fourthHexProps={{
                icon: <ListIcon />,
                link: factionId ? `/factions/${factionId}` : '/garden'
              }}
            />
          </Box>
        </Box>
      </div>
    </Container>
  )
}