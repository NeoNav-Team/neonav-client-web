'use client';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { restrictedChannels } from '../utilites/constants';
import styles from '../styles/generic.module.css';
import { Container, Fab } from '@mui/material';
import AddCommentIcon from '@mui/icons-material/AddComment';
import InputChannelTab from './inputChannelTab';
import { Context as NnContext } from '../components/context/nnContext';
import { NnProviderValues } from '../components/context/nnTypes';


interface ChatAppProps {
  msgBtn?: boolean;
}

const GLOBAL_CHAT = restrictedChannels[0];

export default function ChatApp(props:ChatAppProps):JSX.Element {
  const { msgBtn } = props;
  const [channelsFetched, setChannelsFetched] = useState<boolean>(false);
  const { 
    state,
    fetchUserChannels = () => {},
    fetchChatHistory= () => {},
  }: NnProviderValues = useContext(NnContext);
  const selectedChannel = state.network?.selected?.channel || GLOBAL_CHAT; 

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

    return (
        <Container disableGutters style={{height: '100%'}}>
             <div
                className={styles.darkPane}
                style={{height: '100%', maxHeight: 'calc(100% - 74px)', marginTop: '70px'}}
                data-augmented-ui="tl-clip-x tr-clip-x br-clip bl-clip both"
            >
                <InputChannelTab changeHandler={()=>{}} value={selectedChannel} />
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