'use client';
import React, { useCallback, useContext, useEffect, useState, useMemo } from 'react';
import { globalChannel } from '../utilites/constants';
import styles from '../styles/generic.module.css';
import { Container, Box, Stack } from '@mui/material';
import InputChannelTab from './inputChannelTab';
import ItemMessage from './itemMessage';
import { orderbyDate } from '@/utilites/fomat';
import { Context as NnContext } from '../components/context/nnContext';
import { NnChatMessage, NnProviderValues } from '../components/context/nnTypes';
import SimpleScrollContainer from './simpleScrollContainer';
import InputMessage from './inputMessage';
import { use100vh } from 'react-div-100vh';

interface ChatAppProps {
  msgBtn?: boolean;
}

const GLOBAL_CHAT = globalChannel;


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
  maxWidth: '100vw',
  minHeight: '50vh',
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
  const FULL_HEIGHT = use100vh() || 600;
  const FLEX_HEIGHT = FULL_HEIGHT - 75;
  const SCROLL_HEIGHT = FULL_HEIGHT - 114;
  const { 
    state,
    fetchUserChannels = () => {},
    fetchChannelHistory = (channelId:string) => {},
    setSelected = (indexType:string, channelId:string) => {},
    sendChannelMessage = (channelId:string, text: string) => {},
  }: NnProviderValues = useContext(NnContext);
  const selectedChannel:string = state.network?.selected?.channel || GLOBAL_CHAT;
  const messages:NnChatMessage[] = useMemo(() => {
    const chatArr = state?.network?.collections?.messages || [];
    const orderChatArr = orderbyDate(chatArr, 'ts');
    const chatLength = orderChatArr.length;
    const last30 = chatLength > 30 ? orderChatArr.slice(0, 30) : orderChatArr;
    return last30;
  }, [state?.network?.collections?.messages]);
  const [ initFetched, setInitFetched ] = useState<boolean>(false);
  const [ msg, setMsg ] = useState<string>('');

  const initChat = useCallback(() => {
    if (!initFetched) {
      fetchUserChannels();
      fetchChannelHistory(selectedChannel);
      setInitFetched(true);
    }
  }, [fetchChannelHistory, fetchUserChannels, initFetched, selectedChannel])

  const channelSelection = (selectedChannel:string) => {
    fetchChannelHistory(selectedChannel);
    setSelected('channel', selectedChannel);
  }

  const updateMessage = (event: React.ChangeEvent<HTMLInputElement>)  => {
    setMsg( event?.target?.value);
  }

  const goSendMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    sendChannelMessage(selectedChannel, msg);
    setMsg('');
  }
  
  useEffect(() => {
    initChat();
  }, [initChat]);

  useEffect(() => {
    const scoller = document.getElementById('simpleScoll');
    if (scoller){
      scoller.scrollTop = scoller.scrollHeight;
    }
  }, [messages]);

  return (
    <Container disableGutters style={{height: '100%'}}>
      <div
        className={styles.darkPane}
        style={{height: '100%', maxHeight: 'calc(100% - 74px)', marginTop: '70px'}}
        data-augmented-ui="tl-clip-x tr-clip-x br-clip bl-clip both"
      >
        <Box sx={{...flexContainer, minHeight: FLEX_HEIGHT, maxHeight: FLEX_HEIGHT}}>
          <Box sx={flexHeader}>
            <InputChannelTab changeHandler={channelSelection} value={selectedChannel} />
          </Box>
          <Box sx={{...flexBody, maxHeight: SCROLL_HEIGHT }}>
            <SimpleScrollContainer>
              <Box sx={{maxWidth: '100%'}}>
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
            <InputMessage 
              value={msg} 
              changeHandler={(event: React.ChangeEvent<HTMLInputElement>) => updateMessage(event)}
              submitHandler={(event: React.ChangeEvent<HTMLInputElement>) => goSendMessage(event)}
            />
          </Box>
        </Box>
      </div>
    </Container>
  )
}