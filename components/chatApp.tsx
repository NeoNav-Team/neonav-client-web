'use client';

import React, { useCallback, useContext, useEffect, useState, useMemo } from 'react';
import { restrictedChannels, globalChannel } from '../utilities/constants';
import styles from '../styles/generic.module.css';
import { Container, Box, Stack, Typography} from '@mui/material';
import SpeakerNotesOffIcon from '@mui/icons-material/SpeakerNotesOff';
import InputChannelTab from './inputChannelTab';
import ItemMessage from './itemMessage';
import { orderbyDate } from '@/utilities/fomat';
import { Context as NnContext } from '../components/context/nnContext';
import { NnChatMessage, NnProviderValues, LooseObject } from '../components/context/nnTypes';
import SimpleScrollContainer from './simpleScrollContainer';
import InputMessage from './inputMessage';
import { use100vh } from 'react-div-100vh';

interface ChatAppProps {
  msgBtn?: boolean;
  notify?: boolean;
  params?: {
    id: string;
  }
}

const GLOBAL_CHAT = globalChannel;
const NOTIFCATIONS = restrictedChannels[0];

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
  const { msgBtn, notify, params } = props;
  const idFromParams = params?.id;
  const FULL_HEIGHT = use100vh() || 600;
  const FLEX_HEIGHT = FULL_HEIGHT - 75;
  const SCROLL_HEIGHT = FULL_HEIGHT - 114;
  const { 
    state,
    fetchUserChannels = () => {},
    fetchChannelHistory = (channelId:string) => {},
    setSelected = (indexType:string, channelId:string) => {},
    sendChannelMessage = (channelId:string, text: string) => {},
    clearUnreadCountByType = (channelId:string) => {},
    joinFaction = (factionId:string) => {},
    leaveFaction = (factionId:string) => {},
    joinUserToChannel = (channelId:string) => {},
    removeUserFromChannel = (channelId:string, userId?:string) => {},
  }: NnProviderValues = useContext(NnContext);
  const selectedChannel:string = useMemo(() => { 
    const channel = idFromParams || state.network?.selected?.channel || GLOBAL_CHAT;
    return notify ? NOTIFCATIONS : channel;
  }, [idFromParams, notify, state.network?.selected?.channel]);
  const unread:LooseObject = useMemo(() => {
    return state?.network?.selected?.unread || {};
  }, [state]);
  const messages:NnChatMessage[] = useMemo(() => {
    const chatArr = state?.network?.collections?.messages || [];
    const orderChatArr = orderbyDate(chatArr, 'ts');
    const chatLength = orderChatArr.length;
    const last30 = chatLength > 30 ? orderChatArr.slice(0, 30) : orderChatArr;
    return last30;
  }, [state?.network?.collections?.messages]);
  const [ initFetched, setInitFetched ] = useState<boolean>(false);
  const [ initSelected, setInitSelected ] = useState<boolean>(false);
  const [ lastUnread, setLastUnread ] = useState<string>('');
  const [ msg, setMsg ] = useState<string>('');
  const channelFound = state?.user?.channels?.filter(channel => channel.id === selectedChannel).length === 1;


  const initChat = useCallback(() => {
    if (!initFetched) {
      fetchUserChannels();
      fetchChannelHistory(selectedChannel);
      setInitFetched(true);
    }
  }, [
    fetchChannelHistory,
    fetchUserChannels,
    initFetched,
    selectedChannel,
  ])

  const channelSelection = (selectedChannel:string) => {
    fetchChannelHistory(selectedChannel);
    setSelected('channel', selectedChannel);
  }

  const updateMessage = (event: React.ChangeEvent<HTMLInputElement>)  => {
    setMsg(event?.target?.value);
  }

  const goSendMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    sendChannelMessage(selectedChannel, msg);
    setMsg('');
  }

  const goDialogAction = (actionArgs: string[]) => {
    const entity = actionArgs[0];
    const entityId = actionArgs[1];
    const action = actionArgs[2];
    switch (entity) {
    case 'faction':
      if(action === 'confirm') {
        joinFaction(entityId);
      }
      if(action === 'decline') {
        leaveFaction(entityId);
      }
      break;
    case 'channel':
      if(action === 'confirm') {
        joinUserToChannel(entityId);
      }
      if(action === 'decline') {
        removeUserFromChannel(entityId);
      }
      break;
    
    default:
      break;
    }
  }

  useEffect(() => {
    initChat();
  }, [initChat]);

  useEffect(() => {
    if (!initSelected) {
      idFromParams && setSelected('channel', idFromParams);
      setInitSelected(true);
    }
  }, [idFromParams, initSelected, setSelected]);

  useEffect(() => {
    const scroller = document.getElementById('simpleScoll');
    if (scroller && !notify){
      scroller.scrollTop = scroller.scrollHeight;
    }
  }, [messages, notify]);

  useEffect(() => {
    if (lastUnread !== selectedChannel) {
      clearUnreadCountByType(selectedChannel);
      setLastUnread(selectedChannel)
    }
  }, [clearUnreadCountByType, lastUnread, selectedChannel, setLastUnread]);

  return (
    <Container disableGutters style={{height: '100%'}}>
      <div
        className={styles.darkPane}
        style={{height: '100%', maxHeight: 'calc(100% - 74px)', marginTop: '70px'}}
        data-augmented-ui="tl-clip-x tr-clip-x br-clip bl-clip both"
      >
        <Box sx={{...flexContainer, minHeight: FLEX_HEIGHT, maxHeight: FLEX_HEIGHT}}>
          <Box sx={flexHeader}>
            <InputChannelTab changeHandler={channelSelection} notify={notify} value={selectedChannel} />
          </Box>
          <Box sx={{...flexBody, maxHeight: SCROLL_HEIGHT }}>
            {initFetched && !channelFound && (
              <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={0}
              >
                <SpeakerNotesOffIcon sx={{fontSize:'100px'}}/>
                <Typography variant="h3">
                404 
                </Typography>
                <Typography variant="h5">
                Channel not found
                </Typography>
                <Typography sx={{margin: '10px auto'}}>
                Check if channel exists and you have access.
                </Typography>
              </Stack>
            )}
            <SimpleScrollContainer>
              <Box sx={{maxWidth: '100%'}}>
                <Stack spacing={0} style={{display: 'flex', flexDirection: `${notify ? 'column' : 'column-reverse'}` }}>
                  {messages.map(item => (
                    <ItemMessage
                      key={item.ts}
                      date={item.ts}
                      text={item.text}
                      username={item.from}
                      id={item.fromid}
                      dialogCallback={goDialogAction}
                      buttons={{
                        confirm: item.confirm,
                        decline: item.decline,
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            </SimpleScrollContainer>
          </Box>
          {msgBtn && (
            <Box sx={flexFooter}>
              <InputMessage 
                value={msg}
                disabled={!channelFound}
                changeHandler={(event: React.ChangeEvent<HTMLInputElement>) => updateMessage(event)}
                submitHandler={(event: React.ChangeEvent<HTMLInputElement>) => goSendMessage(event)}
              />
            </Box>
          )}
        </Box>
      </div>
    </Container>
  )
}