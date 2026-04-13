'use client';

import React, { useCallback, useContext, useEffect, useRef, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { restrictedChannels, globalChannel, NEONAV_MAINT } from '../utilities/constants';
import styles from '../styles/generic.module.css';
import { Box, Button, Container, Dialog, DialogActions, DialogTitle, Stack, Typography } from '@mui/material';
import SpeakerNotesOffIcon from '@mui/icons-material/SpeakerNotesOff';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ReplyIcon from '@mui/icons-material/Reply';
import PersonIcon from '@mui/icons-material/Person';
import BlockIcon from '@mui/icons-material/Block';
import InputChannelTab from './inputChannelTab';
import FooterNav from './footerNav';
import ItemMessage from './itemMessage';
import { orderbyDate } from '@/utilities/fomat';
import { Context as NnContext } from '../components/context/nnContext';
import { NnChatMessage, NnProviderValues, LooseObject } from '../components/context/nnTypes';
import SimpleScrollContainer from './simpleScrollContainer';
import InputMessage from './inputMessage';
import { use100vh } from 'react-div-100vh';
import executeAPI from '@/utilities/executeApi';
import { getCookieToken } from '@/utilities/cookieContext';
import { idbGetMessage } from '@/utilities/idbMessages';

interface ChatAppProps {
  msgBtn?: boolean;
  notify?: boolean;
  params?: {
    id: string;
  }
}

const GLOBAL_CHAT = globalChannel;
const NOTIFICATIONS = restrictedChannels[0];
const ALERTS = restrictedChannels[1];
const NOTIFY_CHANNELS = [NOTIFICATIONS, ALERTS];
const ACTION_BAR_HEIGHT = 120;

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

type ConfirmAction = 'kick' | 'delete' | 'ban';

export default function ChatApp(props:ChatAppProps):JSX.Element {
  const { msgBtn, notify, params } = props;
  const router = useRouter();
  const idFromParams = params?.id;
  const FULL_HEIGHT = use100vh() || 600;
  const FLEX_HEIGHT = FULL_HEIGHT - 75;
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
    banUserFromChannel = (channelId:string, userId:string) => {},
    deleteChannelMessage = (channelId:string, messageId:string) => {},
  }: NnProviderValues = useContext(NnContext);

  const selectedChannel:string = useMemo(() => {
    const channel = state.network?.selected?.channel;
    if (notify) {
      return (channel && NOTIFY_CHANNELS.includes(channel)) ? channel : NOTIFICATIONS;
    }
    if (idFromParams) return idFromParams;
    const validChannel = channel && !NOTIFY_CHANNELS.includes(channel) ? channel : null;
    return validChannel || GLOBAL_CHAT;
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

  const prevChannelRef = useRef<string>('');
  const handledRedactionsRef = useRef<Set<string>>(new Set());
  const [ initFetched, setInitFetched ] = useState<boolean>(false);
  const [ initSelected, setInitSelected ] = useState<boolean>(false);
  const [ lastUnread, setLastUnread ] = useState<string>('');
  const [ msg, setMsg ] = useState<string>('');
  const [ selectedMsg, setSelectedMsg ] = useState<NnChatMessage | null>(null);
  const [ confirmAction, setConfirmAction ] = useState<ConfirmAction | null>(null);

  const channelFound = state?.user?.channels?.filter(channel => channel.id === selectedChannel).length === 1;
  const userId = state?.user?.profile?.auth?.userid || '';
  const accountId = state?.network?.selected?.account || userId;
  const currentChannel = state?.user?.channels?.find(ch => ch.id === selectedChannel);
  const channelAdmin = currentChannel?.admin === userId || accountId === NEONAV_MAINT;
  const scope = currentChannel?.scope || '';

  const showKick   = channelAdmin && (scope === 'group' || scope === 'public');
  const showDelete = channelAdmin && ['global', 'group', 'public'].includes(scope);
  const showBan    = channelAdmin && ['global', 'public'].includes(scope);
  const actionBarVisible = !!selectedMsg;
  const SCROLL_HEIGHT = FULL_HEIGHT - 114 - (actionBarVisible && msgBtn ? ACTION_BAR_HEIGHT : 0);

  const dismissActionBar = () => {
    setSelectedMsg(null);
    setConfirmAction(null);
  };

  const initChat = useCallback(() => {
    if (!initFetched) {
      fetchUserChannels();
      fetchChannelHistory(selectedChannel);
      setInitFetched(true);
    }
  }, [fetchChannelHistory, fetchUserChannels, initFetched, selectedChannel]);

  const channelSelection = (newChannel:string) => {
    setSelected('channel', newChannel);
  };

  const updateMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMsg(event?.target?.value);
  };

  const goSendMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    sendChannelMessage(selectedChannel, msg);
    setMsg('');
  };

  const goDialogAction = (actionArgs: string[]) => {
    const entity = actionArgs[0];
    const entityId = actionArgs[1];
    const action = actionArgs[2];
    const option = actionArgs[3];
    switch (entity) {
      case 'faction':
        if (action === 'confirm') joinFaction(entityId);
        if (action === 'decline') leaveFaction(entityId);
        break;
      case 'channel':
        if (action === 'confirm') joinUserToChannel(entityId);
        if (action === 'decline') removeUserFromChannel(entityId);
        break;
      case 'amount':
        router.push(`/cash/${option}#${entityId}`, { scroll: false });
        break;
      default:
        break;
    }
  };

  const SYSTEM_ID = '0000000000';

  const handleMsgClick = (item: NnChatMessage) => {
    if (notify) return;
    if (item.fromid === SYSTEM_ID) return;
    if (item.fromid === userId) return;
    setSelectedMsg(prev => (prev?.id === item.id ? null : item));
  };

  // Pre-check: is fromid still a member of the channel?
  const checkIsMember = (fromId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const token = getCookieToken();
      executeAPI('channelUsers', { id: selectedChannel, token }, (resp: any) => {
        const users: { userid: string }[] = resp?.data || [];
        resolve(users.some(u => u.userid === fromId));
      }, () => resolve(false));
    });
  };

  // Pre-check: is fromid already banned?
  const checkIsNotBanned = (fromId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const token = getCookieToken();
      executeAPI('channelBanList', { channel: selectedChannel, token }, (resp: any) => {
        const banlist: string[] = resp?.data || [];
        resolve(!banlist.includes(fromId));
      }, () => resolve(true)); // on error, allow to proceed
    });
  };

  const handleKickClick = async () => {
    if (!selectedMsg?.fromid) return;
    const isMember = await checkIsMember(selectedMsg.fromid);
    if (isMember) {
      setConfirmAction('kick');
    } else {
      dismissActionBar();
    }
  };

  const handleDeleteClick = () => {
    setConfirmAction('delete');
  };

  const handleReplyClick = () => {
    setMsg(`@${selectedMsg?.fromid} `);
    dismissActionBar();
    // Focus the input
    setTimeout(() => {
      const input = document.querySelector<HTMLInputElement>('#chatMsgInput input, #chatMsgInput textarea');
      input?.focus();
    }, 50);
  };

  const handleBanClick = async () => {
    if (!selectedMsg?.fromid) return;
    const [isMember, notBanned] = await Promise.all([
      checkIsMember(selectedMsg.fromid),
      checkIsNotBanned(selectedMsg.fromid),
    ]);
    if (isMember && notBanned) {
      setConfirmAction('ban');
    } else {
      dismissActionBar();
    }
  };

  const handleConfirm = () => {
    if (!selectedMsg) return;
    if (confirmAction === 'kick') {
      removeUserFromChannel(selectedChannel, selectedMsg.fromid);
    } else if (confirmAction === 'delete' && selectedMsg.id) {
      deleteChannelMessage(selectedChannel, selectedMsg.id);
    } else if (confirmAction === 'ban' && selectedMsg.fromid) {
      banUserFromChannel(selectedChannel, selectedMsg.fromid);
    }
    dismissActionBar();
  };

  useEffect(() => { initChat(); }, [initChat]);

  useEffect(() => {
    if (prevChannelRef.current === selectedChannel) return;
    const wasInitialized = prevChannelRef.current !== '';
    prevChannelRef.current = selectedChannel;
    if (!wasInitialized) return;
    fetchChannelHistory(selectedChannel);
  }, [selectedChannel, fetchChannelHistory]);

  useEffect(() => {
    if (!initSelected) {
      if (notify) {
        const ch = state.network?.selected?.channel;
        if (!ch || !NOTIFY_CHANNELS.includes(ch)) setSelected('channel', NOTIFICATIONS);
      } else {
        idFromParams && setSelected('channel', idFromParams);
      }
      setInitSelected(true);
    }
  }, [idFromParams, initSelected, notify, setSelected, state.network?.selected?.channel]);

  useEffect(() => {
    const scroller = document.getElementById('simpleScoll');
    if (scroller && !notify) scroller.scrollTop = scroller.scrollHeight;
  }, [messages, notify]);

  useEffect(() => {
    if (lastUnread !== selectedChannel) {
      clearUnreadCountByType(selectedChannel);
      setLastUnread(selectedChannel);
    }
  }, [clearUnreadCountByType, lastUnread, selectedChannel, setLastUnread]);

  useEffect(() => {
    if (unread[selectedChannel] > 0) clearUnreadCountByType(selectedChannel);
  }, [unread, selectedChannel, clearUnreadCountByType]);

  useEffect(() => {
    const redactionMsg = messages.find(
      m => m.fromid === SYSTEM_ID && m.text?.includes('was redacted') && m.id && !handledRedactionsRef.current.has(m.id)
    );
    if (!redactionMsg?.id || !redactionMsg.text) return;
    const match = redactionMsg.text.match(/Message (\S+) was redacted/);
    const targetId = match?.[1];
    handledRedactionsRef.current.add(redactionMsg.id);
    if (!targetId) return;
    idbGetMessage(targetId).then(cached => {
      if (cached && cached.text !== '[REDACTED]') {
        fetchChannelHistory(selectedChannel);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const confirmTitle: Record<ConfirmAction, string> = {
    kick: `Kick ${selectedMsg?.from || selectedMsg?.fromid}?`,
    delete: 'Delete this message?',
    ban: `Ban ${selectedMsg?.from || selectedMsg?.fromid}?`,
  };

  return (
    <Container disableGutters style={{height: '100%'}}>
      <div
        className={styles.darkPane}
        style={{height: '100%', maxHeight: 'calc(100% - 74px)', marginTop: '70px'}}
        data-augmented-ui="tl-clip-x tr-clip-x br-clip bl-clip both"
        onClick={dismissActionBar}
      >
        <Box sx={{...flexContainer, minHeight: FLEX_HEIGHT, maxHeight: FLEX_HEIGHT}}>
          <Box sx={flexHeader}>
            <InputChannelTab changeHandler={channelSelection} notify={notify} value={selectedChannel} />
          </Box>
          <Box sx={{...flexBody, maxHeight: SCROLL_HEIGHT }}>
            {initFetched && !channelFound && (
              <Stack direction="column" justifyContent="center" alignItems="center" spacing={0}>
                <SpeakerNotesOffIcon sx={{fontSize:'100px'}}/>
                <Typography variant="h3">404</Typography>
                <Typography variant="h5">Channel not found</Typography>
                <Typography sx={{margin: '10px auto'}}>Check if channel exists and you have access.</Typography>
              </Stack>
            )}
            <SimpleScrollContainer>
              <Box sx={{maxWidth: '100%'}}>
                <Stack spacing={0} style={{display: 'flex', flexDirection: `${notify ? 'column' : 'column-reverse'}` }}>
                  {messages.map((item, index) => (
                    <div
                      key={`message-${index}-${item.ts}`}
                      onClick={(e) => { e.stopPropagation(); handleMsgClick(item); }}
                      style={{ outline: selectedMsg?.id === item.id ? '1px solid var(--color-1, #ff00ff)' : undefined }}
                    >
                      <ItemMessage
                        key={`${index}-${item.ts}`}
                        date={item.ts}
                        text={item.text}
                        username={item.from}
                        id={item.fromid}
                        dialogCallback={goDialogAction}
                        url={item.url}
                        buttons={{
                          confirm: item.confirm,
                          decline: item.decline,
                        }}
                      />
                    </div>
                  ))}
                </Stack>
              </Box>
            </SimpleScrollContainer>
          </Box>

          {/* ── Message action bar ── */}
          {msgBtn && (
            <Box sx={{
              order: 0,
              flex: `0 0 ${ACTION_BAR_HEIGHT}px`,
              width: '100%',
              overflow: 'hidden',
              maxHeight: actionBarVisible ? `${ACTION_BAR_HEIGHT}px` : '0px',
              transition: 'max-height 0.2s ease-in-out',
            }}
            onClick={(e) => e.stopPropagation()}
            >
              <FooterNav
                firstHexProps={{
                  icon: <PersonRemoveIcon />,
                  handleAction: handleKickClick,
                  disabled: !showKick,
                  tooltipText: 'Kick',
                }}
                secondHexProps={{
                  icon: <DeleteForeverIcon />,
                  handleAction: handleDeleteClick,
                  disabled: !showDelete,
                  tooltipText: 'Delete message',
                }}
                bigHexProps={{
                  icon: <ReplyIcon />,
                  handleAction: handleReplyClick,
                  tooltipText: 'Reply',
                }}
                thirdHexProps={{
                  icon: <PersonIcon />,
                  handleAction: () => { router.push(`/contacts/${selectedMsg?.fromid}`); dismissActionBar(); },
                  tooltipText: 'User info',
                }}
                fourthHexProps={{
                  icon: <BlockIcon />,
                  handleAction: handleBanClick,
                  disabled: !showBan,
                  tooltipText: 'Ban',
                }}
              />
            </Box>
          )}

          {msgBtn && (
            <Box sx={flexFooter} id="chatMsgInput" onClick={(e) => e.stopPropagation()}>
              <InputMessage
                value={msg}
                disabled={!channelFound}
                changeHandler={(event: React.ChangeEvent<HTMLInputElement>) => updateMessage(event)}
                submitHandler={(event: React.ChangeEvent<HTMLInputElement>) => goSendMessage(event)}
                focusHandler={dismissActionBar}
              />
            </Box>
          )}
        </Box>
      </div>

      {/* ── Confirmation dialog ── */}
      <Dialog open={!!confirmAction} onClose={dismissActionBar}>
        <DialogTitle>{confirmAction ? confirmTitle[confirmAction] : ''}</DialogTitle>
        <DialogActions>
          <Button onClick={dismissActionBar}>Cancel</Button>
          <Button onClick={handleConfirm} color="error" variant="contained" autoFocus>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
