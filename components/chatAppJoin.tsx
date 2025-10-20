'use client';

import React, {useContext, useEffect, useMemo, useState} from 'react';
import { useRouter } from 'next/navigation';
import { Context as NnContext } from '../components/context/nnContext';
import {LooseObject, NnProviderValues} from '../components/context/nnTypes';
import {CircularProgress, Container, LinearProgress, Stack, Typography} from "@mui/material";
import SpeakerNotesOffIcon from "@mui/icons-material/SpeakerNotesOff";
import VoiceChatIcon from '@mui/icons-material/VoiceChat';
import styles from "@/styles/generic.module.css";

interface ChatAppJoinProps {
  params?: {
    id: string;
  }
}

export default function ChatApp(props:ChatAppJoinProps):JSX.Element {
  const { params } = props;
  const router = useRouter();
  const idFromParams = params?.id;
  const {
    state,
    setSelected = (indexType:string, channelId:string) => {},
    joinUserToChannel = (channelId:string) => {},
  }: NnProviderValues = useContext(NnContext);
  const alert:LooseObject = useMemo(() => {
    return state?.network?.alert || {};
  }, [state?.network?.alert]);
  const [ joinFailure, setJoinFailure ] = useState<boolean>(false);

  useEffect(() => {
    if (idFromParams) {
      joinUserToChannel(idFromParams);
      setSelected('channel', idFromParams);
    }
  }, []);

  useEffect(() => {
    if (alert.severity === "success") {
      router.push(`/chat/${idFromParams}`);
    } else if (alert.severity === "error") {
      setJoinFailure(true);
    }
  }, [alert.show]);

  return (
    <Container disableGutters style={{height: '100%'}}>
      <div
        className={styles.darkPane}
        style={{height: '100%', maxHeight: 'calc(100% - 74px)', marginTop: '70px'}}
        data-augmented-ui="tl-clip-x tr-clip-x br-clip bl-clip both"
      >
        <div className="flex flex-col items-center justify-center h-screen">
          {joinFailure ? (
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={0}
            >
              <SpeakerNotesOffIcon sx={{fontSize: '100px'}}/>
              <Typography variant="h3">
                403
              </Typography>
              <Typography variant="h5">
                Unable to join channel
              </Typography>
              <Typography sx={{margin: '10px auto'}}>
                {(alert.message.includes("API ERROR") ? "Channel does not exist." : alert.message)}
              </Typography>
            </Stack>
          ) : (
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={0}
            >
              <VoiceChatIcon sx={{fontSize: '100px'}}/>
              <Typography variant="h5">
                Joining chat...
              </Typography>
              <CircularProgress/>
            </Stack>
          )}
        </div>
      </div>
    </Container>
  )
}