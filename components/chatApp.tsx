'use client';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { globalChannel } from '../utilites/constants';
import styles from '../styles/generic.module.css';
import { Container, Box, Stack } from '@mui/material';
import InputChannelTab from './inputChannelTab';
import ItemMessage from './itemMessage';
import { Context as NnContext } from '../components/context/nnContext';
import { NnChatMessage, NnProviderValues, NnIndexCollection } from '../components/context/nnTypes';
import SimpleScrollContainer from './simpleScrollContainer';
import InputMessage from './inputMessage';

interface ChatAppProps {
  msgBtn?: boolean;
}

const GLOBAL_CHAT = globalChannel;

const flexContainer = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
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
  maxWidth: '100%',
  overflow: 'hidden',
};

const flexFooter = {
  order: 0,
  flex: '0 1 50px',
  alignSelf: 'flex-end',
  width: '100%',
};

export default function ChatApp(props:ChatAppProps):JSX.Element {
  const { msgBtn } = props;
  const { 
    state,
    fetchUserChannels = () => {},
    fetchChannelHistory = (channelId:string) => {},
    setSelected = (indexType:string, channelId:string) => {},
  }: NnProviderValues = useContext(NnContext);
  const selectedChannel:string = state.network?.selected?.channel || GLOBAL_CHAT;
  const chatHistories = state.network?.collections?.chats;
  const chatHistoriesIndex = chatHistories && chatHistories.map(function(x) {return x.id; }).indexOf(selectedChannel) || 0;
  const [ channelsFetched, setChannelsFetched ] = useState<boolean>(false);
  const [ chatsFetcedList, setChatsFetcedList ] = useState<string[]>([]);
  const [ messages, setMessages ] = useState<NnChatMessage[]>([]);
  const [ showMsgDrawer, setShowMsgDrawer ] = useState<boolean>(false);
  const [ msg, setMsg ] = useState<string>('');

  const channelSelection = (selectedChannel:string) => {
    setSelected('channel', selectedChannel);
  }

  const handleNext = () => {};

  const goSendMessage = () => {
    console.log('sending message');
    setMsg('');
  }
  
  const goFetchChannels = useCallback(() => {
    if (!channelsFetched) {
      fetchUserChannels();
      setChannelsFetched(true);
    }
  }, [channelsFetched, fetchUserChannels])

  useEffect(() => {
    const channels = state.user?.channels || []; 
    if (channels.length === 0) {
        goFetchChannels();
    }
  }, [state, goFetchChannels]);

  useEffect(() => {
    if (chatHistories && selectedChannel) {
      if (chatsFetcedList.indexOf(selectedChannel) === -1) {
        const chat = chatHistories[chatHistoriesIndex] || {collection: []};
        const chatHistory = chat ? chat.collection : [];
        if (chatHistory && chatHistory.length === 0) {
          fetchChannelHistory(selectedChannel);
          const newChatsFetchedList = [...chatsFetcedList, selectedChannel];
          setChatsFetcedList(newChatsFetchedList);
        }
      }
    }
  }, [chatHistories, chatHistoriesIndex, chatsFetcedList, fetchChannelHistory, selectedChannel]);


  useEffect(() => {
    if (chatHistories ) {
      const chat:NnIndexCollection = chatHistories[chatHistoriesIndex];
      console.log('chat', chat);
      const selectedChatMessages = chat?.collection || [];
      setMessages(selectedChatMessages);
    }
  }, [chatHistories, chatHistoriesIndex, selectedChannel]);


    return (
        <Container disableGutters style={{height: '100%'}}>
             <div
                className={styles.darkPane}
                style={{height: '100%', maxHeight: 'calc(100% - 74px)', marginTop: '70px'}}
                data-augmented-ui="tl-clip-x tr-clip-x br-clip bl-clip both"
            >

                <Box sx={flexContainer}>
                  <Box sx={flexHeader}>
                    <InputChannelTab changeHandler={channelSelection} value={selectedChannel} />
                  </Box>
                  <Box sx={flexBody}>
                    <SimpleScrollContainer>
                      <Box sx={{maxWidth: '100vw'}}>
                      <Stack spacing={0} style={{display: 'flex', flexDirection: 'column-reverse' }}>
                      {messages.map(item => (
                        <ItemMessage
                          key={item.ts}
                          date={item.ts}
                          text={item.text}
                          username={item.from}
                          id={item.fromid} />
                      ))}
                      </Stack>
                      </Box>
                    </SimpleScrollContainer>
                </Box>
                  <Box sx={flexFooter}>
                  <InputMessage value={msg} clickHandler={() => setShowMsgDrawer(true)} />
                </Box>
                </Box>
            </div>
        </Container>
    )
}