/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useCallback, useContext, useState, useEffect, useMemo } from 'react';
import styles from '../styles/card.module.css';
import { Context as NnContext } from './context/nnContext';
import { NnChannel, nnEntity, NnProviderValues } from './context/nnTypes';
import SimpleScrollContainer from './simpleScrollContainer';
import FooterNav from './footerNav';
import { 
  Container,
  Box,
  Typography,
  LinearProgress,
  Chip,
} from '@mui/material';
import TocIcon from '@mui/icons-material/Toc';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import NoMeetingRoomIcon from '@mui/icons-material/NoMeetingRoom';
import { Stack } from '@mui/system';
import { use100vh } from 'react-div-100vh';


interface ChannelDetailAppProps {
  params: {
    id: string;
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


export default function ChannelDetailApp(props: ChannelDetailAppProps):JSX.Element {
  const { params } = props;
  const { id } = params;
  const FULL_HEIGHT = use100vh() || 600;
  const FLEX_HEIGHT = FULL_HEIGHT - 75;
  const SCROLL_HEIGHT = FULL_HEIGHT - 114;
  const { 
    state,
    fetchChannelDetails = (id:string) =>{},
    fetchChannelUsers = (id:string) =>{},
    removeUserFromChannel = (id:string) => {},
  }: NnProviderValues = useContext(NnContext);
  const userId:string = state?.user?.profile?.auth?.userid || '';
  const entityId:string = id || '';
  const channels = state?.user?.channels || [];
  const channelInfo:NnChannel = channels.filter(arrItem => arrItem.id == entityId)[0];
  const userList = state.network?.collections.entityUsers || [];
  const entity:nnEntity  = useMemo(() => {
    return state?.network?.entity || {};
  }, [state]);
  const [ fetched, setFetched ] = useState(false);

  const goFetchChannelUsers = useCallback(() => {
    if (!fetched) {
      fetchChannelDetails(entityId);
      fetchChannelUsers(entityId);
      setFetched(true);
    }
  }, [fetched, fetchChannelUsers, entityId, fetchChannelDetails]);

  useEffect(() => {
    goFetchChannelUsers();
  }, [channelInfo?.id, entity, goFetchChannelUsers, id, userList.length]);

  const goLeaveChannel = () =>  {
    removeUserFromChannel(userId);
  }

  return (
    <Container disableGutters style={{height: '100%'}}>
      <div
        className={styles.idCardFrame}
        style={{height: '100%', maxHeight: 'calc(100% - 74px)', marginTop: '70px'}}
        data-augmented-ui="tr-clip-x br-clip bl-clip both"
      >
        <Box sx={{...flexContainer, minHeight: FLEX_HEIGHT, maxHeight: FLEX_HEIGHT}}>
          <Box sx={{...flexBody, maxHeight: SCROLL_HEIGHT, height: SCROLL_HEIGHT }}>
            {channelInfo?.id === id ? (
              <>
                <Typography variant="h5">{channelInfo.name}</Typography>
                <Typography variant="h6">Users</Typography>
                <SimpleScrollContainer>
                  <Stack>
                    <div>
                      {userList.length >= 1 && userList.map(item => {
                        return (<Chip label={item.username || item.id} key={item.id} />
                        )
                      })}
                    </div>
                  </Stack>
                </SimpleScrollContainer>
              </>
            ) : (
              <LinearProgress color="secondary" />
            )}
          </Box>
          <Box sx={flexFooter}>
            <FooterNav
              firstHexProps={{
                icon: <NoMeetingRoomIcon />,
                handleAction: goLeaveChannel,
              }}
              secondHexProps={{
                disabled: true,
              }}
              bigHexProps={{
                icon: <ManageAccountsIcon />,
                disabled: true,
              }}
              thirdHexProps={{
                disabled: true,
              }}
              fourthHexProps={{
                icon: <TocIcon />,
                link: '/channels',
              }}
            />
          </Box>
        </Box>
      </div>
    </Container>
  )
}