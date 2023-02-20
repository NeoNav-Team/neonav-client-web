'use client';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { globalChannel } from '../utilites/constants';
import styles from '../styles/generic.module.css';
import { Container, Fab, Stack } from '@mui/material';
import AddCommentIcon from '@mui/icons-material/AddComment';
import InputChannelTab from './inputChannelTab';
import ItemMessage from './itemMessage';
import { Context as NnContext } from '../components/context/nnContext';
import { NnChatMessage, NnProviderValues } from '../components/context/nnTypes';
import InfiniteScrollContainer from './infiniteScrollContainer';

interface ChatAppProps {
  msgBtn?: boolean;
}

const GLOBAL_CHAT = globalChannel;

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
  const chatHistoriesIndex = chatHistories && chatHistories.map(function(x) {return x.id; }).indexOf(selectedChannel) || -1;
  const [channelsFetched, setChannelsFetched] = useState<boolean>(false);
  const [chatsFetcedList, setChatsFetcedList] = useState<string[]>([]);
  const [ messages, setMessages ] = useState<NnChatMessage[]>([]);

  const channelSelection = (selectedChannel:string) => {
    setSelected('channel', selectedChannel);
  }

  const handleNext = () => {};
  
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
    if (chatHistories) {
      const chat = chatHistories[chatHistoriesIndex] || {collection: []};
      const selectedChatMessages = chat.collection || [];
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
                <InputChannelTab changeHandler={channelSelection} value={selectedChannel} />
                <InfiniteScrollContainer>
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
                </InfiniteScrollContainer>

                {msgBtn && (
                    <div style={{position: 'absolute', bottom: 20, right: 10,}}>
                          <Fab color="secondary" aria-label="index">
                              <AddCommentIcon  sx={{ fontSize: '40px'}} />
                          </Fab>
                    </div>
                )}
            </div>
        </Container>
    )
}