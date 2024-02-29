'use client';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { restrictedChannels } from '../utilities/constants';
import { globalChannel } from '../utilities/constants';
import styles from '../styles/generic.module.css';
import { Context as NnContext } from './context/nnContext';
import { NnProviderValues, NnChannel, LooseObject } from './context/nnTypes';
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


interface ChannelsAppProps {};

const forbiddenChannels = [ ...restrictedChannels, globalChannel ];

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

export default function ChannelsApp(props: ChannelsAppProps):JSX.Element {
  const FULL_HEIGHT = use100vh() || 600;
  const FLEX_HEIGHT = FULL_HEIGHT - 75;
  const SCROLL_HEIGHT = FULL_HEIGHT - 114;
  const { 
    state,
    createNewChannel =  (channelName:string) => {},
    fetchUserChannels = () => {},
  }: NnProviderValues = useContext(NnContext);
  const channels:NnChannel[]  = useMemo(() => {
    return state?.user?.channels || [];
  }, [state]);
  const unread:LooseObject = useMemo(() => {
    return state?.network?.selected?.unread || {};
  }, [state]);
  const accountId = state?.network?.selected?.account || '';
  const sortedChannels = channels.sort((a, b) => a.name.localeCompare(b.name));
  const userCreatedChannels = sortedChannels.filter(channel => forbiddenChannels.indexOf(channel.id) === -1);
  const administerdChannels = userCreatedChannels.filter(channel => channel.admin === accountId);
  const subscribedChannels = userCreatedChannels.filter(channel => channel.admin !== accountId);
  const [ collectionFetched, setCollectionFetched ] = useState(false);

  const goFetchChannels = useCallback(() => {
    if (!collectionFetched) {
      fetchUserChannels();
      setCollectionFetched(true);
    }
  }, [collectionFetched, fetchUserChannels]);

  const goCreateNewChannel = (newChannelName: string)=> {
    createNewChannel(newChannelName);
  }

  useEffect(() => {
    const channelsSize = channels && channels.length;
    channelsSize === 0 && goFetchChannels();
  }, [channels, goFetchChannels]);


  return (
    <Container disableGutters style={{height: '100%'}}>
      <div
        className={styles.darkPane}
        style={{height: '100%', maxHeight: 'calc(100% - 74px)', marginTop: '70px'}}
        data-augmented-ui="tl-clip-x tr-rect br-clip bl-clip both"
      >
        <Box sx={{...flexContainer, minHeight: FLEX_HEIGHT, maxHeight: FLEX_HEIGHT}}>
          <Box sx={{...flexBody, maxHeight: SCROLL_HEIGHT }}>
            {channels.length !== 0 ?(
              <SimpleScrollContainer>
                <Box sx={{minWidth: '100%', minHeight: '100%'}}>
                  <Stack spacing={0} sx={{ display: 'flex' }}>
                    <ItemContact
                      subtitle={'Subordinate Channels'}
                      key={`admin-list`}
                    />
                    {administerdChannels && administerdChannels.map((item) => {
                      return (
                        <div
                          key={`${item.id}-container`}
                        >
                          <ItemContact
                            key={`${item.id}`}
                            id={item.id || ''}
                            unread={unread[item.id] || 0}
                            username={item.name}
                            collection="channels/admin"
                          />
                        </div> 
                      )
                    })}
                    {administerdChannels.length === 0 && <Typography>Create a channel to subordinate.</Typography>}
                    <ItemContact
                      subtitle={'Subscribed Channels'}
                      key={`Subscribed-list`}
                    />
                    {subscribedChannels && subscribedChannels.map((item) => {
                      return (
                        <div
                          key={`${item.id}-container`}
                        >
                          <ItemContact
                            key={`${item.id}`}
                            id={item.id || ''}
                            unread={unread[item.id] || 0}
                            username={item.name}
                            collection="channels/admin"
                          />
                        </div> 
                      )
                    })}
                    {subscribedChannels.length === 0 && <Typography>Go make friends.</Typography>}
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
                handleAction: goCreateNewChannel,
                dialog: 'New channel name',
                useInput: true,
              }}
            />
          </Box>
        </Box>
      </div>
    </Container>
  )
}