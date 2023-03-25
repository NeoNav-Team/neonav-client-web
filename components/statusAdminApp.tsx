/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useCallback, useContext, useState, useMemo, useRef, useEffect } from 'react';
import styles from '../styles/card.module.css';
import { Context as NnContext } from './context/nnContext';
import { NnProviderValues, NnStatus } from './context/nnTypes';
import FooterNav from './footerNav';
import { 
  Container,
  Divider,
  Box,
  Typography,
  LinearProgress,
} from '@mui/material';
import TocIcon from '@mui/icons-material/Toc';
import NoMeetingRoomIcon from '@mui/icons-material/NoMeetingRoom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Stack } from '@mui/system';
import { use100vh } from 'react-div-100vh';
import ItemStatus from './itemStatus';


interface StatusAdminAppProps {
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

export default function StatusAdminApp(props: StatusAdminAppProps):JSX.Element {
  const { params } = props;
  const { id } = params;
  const FULL_HEIGHT = use100vh() || 600;
  const FLEX_HEIGHT = FULL_HEIGHT - 75;
  const SCROLL_HEIGHT = FULL_HEIGHT - 114;

  const { 
    state,
    fetchUserStatuses = (id:string) =>{},
    toggleStatusClass = (id:string) => {},
    removeStatus = (id:string) => {},
  }: NnProviderValues = useContext(NnContext);
  const userId:string = state?.user?.profile?.auth?.userid || '';
  const statuses:NnStatus[] = state?.network?.collections?.statuses || [];
  const selectedStatus = statuses.filter(status => status.id === id)[0] || null;
  const alertMessage = useMemo(() => { 
    return state?.network?.alert?.message || '';
  }, [state]);

  const [ fetched, setFetched ] = useState(false);

  const goFetchUserStatuses = useCallback(() => {
    if (!fetched) {
      fetchUserStatuses(userId);
      setFetched(true);
    }
  }, [fetched, fetchUserStatuses, userId]);

  useEffect(() => {
    goFetchUserStatuses();
  }, [goFetchUserStatuses, userId]);

  useEffect(() => {
    if (alertMessage && alertMessage.includes("Status")) {
      goFetchUserStatuses();
    }
  }, [alertMessage, goFetchUserStatuses, userId]);

  const goRemoveStatus = () =>  {
    removeStatus(selectedStatus?.id);
    setFetched(false);
  }

  const goToggleStatus = () =>  {
    toggleStatusClass(selectedStatus?.id);
    setFetched(false);
  }

  const handleBigAction = () => {
    toggleStatusClass(selectedStatus?.id);
    setFetched(false);
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
            {fetched ? (
              <Container>
                <>
                  <Divider variant="middle" color="primary">
                    <Typography variant="h6">Status</Typography>
                  </Divider>
                  <Stack spacing={2}>
                    {selectedStatus ? (
                      <ItemStatus
                        id={selectedStatus.id}
                        username={selectedStatus.from}
                        date={selectedStatus.ts}
                        text={selectedStatus.body}
                        
                      />
                    ) : (
                      <Typography variant="h4">404 STATUS NOT FOUND</Typography>
                    )}
                  </Stack>
                  <Divider variant="middle" color="primary">
                    {selectedStatus && (<Typography variant="h6">Privacy : {selectedStatus.class}</Typography>)}
                  </Divider>
                </>
              </Container>
            ) : (
              <LinearProgress color="secondary" />
            )}
          </Box>
          <Box sx={flexFooter}>
            <FooterNav
              firstHexProps={{
                icon: <NoMeetingRoomIcon />,
                handleAction: goRemoveStatus,
                dialog: "Delete this status?"
              }}
              secondHexProps={{
                disabled: true,
              }}
              bigHexProps={{
                icon: selectedStatus && selectedStatus.class === 'public' ? <VisibilityIcon /> : <VisibilityOffIcon />,
                handleAction: goToggleStatus,
              }}
              thirdHexProps={{
                disabled: true,
              }}
              fourthHexProps={{
                icon: <TocIcon />,
                link: '/garden',
              }}
            />
          </Box>
        </Box>
      </div>
    </Container>
  )
}