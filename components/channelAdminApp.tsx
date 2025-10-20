/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useCallback, useContext, useState, useEffect, useMemo } from 'react';
import styles from '../styles/card.module.css';
import { Context as NnContext } from './context/nnContext';
import { NnChannel, NnContact, nnEntity, NnFaction, NnProviderValues, NnSimpleEntity } from './context/nnTypes';
import SimpleScrollContainer from './simpleScrollContainer';
import ToggleButtons from './toggleButtons';
import InputUser from './inputUser';
import FooterNav from './footerNav';
import { 
  Container,
  Divider,
  Box,
  Typography,
  LinearProgress,
  Chip,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import NoMeetingRoomIcon from '@mui/icons-material/NoMeetingRoom';
import { Stack } from '@mui/system';
import { use100vh } from 'react-div-100vh';
import MyQRCode from './myQRCode';
import {setSelected} from "@/components/context/nnActionsNetwork";


interface ChannelAdminAppProps {
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


export default function ChannelAdminApp(props: ChannelAdminAppProps):JSX.Element {
  const { params } = props;
  const { id } = params;
  const FULL_HEIGHT = use100vh() || 600;
  const FLEX_HEIGHT = FULL_HEIGHT - 75;
  const SCROLL_HEIGHT = FULL_HEIGHT - 114;
  const requests = [
    {label: 'Invite', value:'invite', icon: <PersonAddIcon />},
    {label: 'Remove', value:'remove', icon: <PersonRemoveIcon />},
    {label: 'Admin', value:'admin', icon: <LocalPoliceIcon />},
  ];
  const { 
    state,
    fetchChannelDetails = (id:string) =>{},
    fetchChannelUsers = (id:string) =>{},
    setSelected = (indexType:string, channelId:string) => {},
    removeUserFromChannel = (channel:string, userId?:string) => {},
    inviteUserToChannel = (channel:string, userId:string) => {},
    toggleChannelScope = (id:string) =>{},
    adminUserToChannel = (channel:string, id:string) => {},
  }: NnProviderValues = useContext(NnContext);
  const userId:string = state?.user?.profile?.auth?.userid || '';
  const entityId:string = id || '';
  const channels = state?.user?.channels || [];
  const channelInfo:NnChannel = channels.filter(arrItem => arrItem.id == entityId)[0];
  const userList = state.network?.collections?.entityUsers || [];
  const isAdmin = userId === channelInfo?.admin;
  const entity:nnEntity  = useMemo(() => {
    return state?.network?.entity || {};
  }, [state]);
  const [ fetched, setFetched ] = useState(false);
  const [ errFields, setErrFields ] = useState<(string | number)[]>([]);
  const [ requestValue, setRequestValue ] = useState<string>(requests[0].value);
  const [ usersValue, setUsersValue ] = useState<string[]>([]);
  const [ scope, setScope ] = useState<string>(channelInfo?.scope);

  type group = {
    label: string,
    value: string,
    icon: React.ReactElement,
    users: nnEntity[] | NnContact[] | NnFaction[] | NnSimpleEntity[],
  }

  const usergroups: group[] = [
    { 
      label: 'Room Members',
      value: 'members',
      icon: <MeetingRoomIcon />,
      users: userList || [],
    },
    { 
      label: 'Contacts',
      value: 'contact',
      icon: <PeopleAltIcon />,
      users: state?.network?.collections?.contacts || [],
    },
    { 
      label: 'Clipboard',
      value: 'clipboard',
      icon: <AssignmentIcon />,
      users: state?.network?.collections?.clipboardEntities || [],
    },
  ];

  const groupForAction = (requestValue:string):group[] => {
    let actionGroup:group[] = [];
    if (requestValue == 'invite') {
      actionGroup.push(usergroups[1]);
      actionGroup.push(usergroups[2]);
    }
    if (requestValue == 'remove' || requestValue == 'admin') {
      actionGroup = [
        usergroups[0],
      ]
    }
    return actionGroup;
  }

  const dialogForAction = (requestValue:string):string | undefined => {
    switch (requestValue) {
      case 'admin':
        return 'You will no longer be admin. Continue?';
        break;
      case 'remove':
        return 'Remove user?';
        break;
      default:
        return undefined;
    }
  }

  const scrubErr = (errStr:string) => {
    const newErrFields = errFields;
    const scrubdex = errFields.indexOf(errStr);
    newErrFields.splice(scrubdex, 1);
    setErrFields(newErrFields);
  }
  const hasErr = (errStr:string) => {
    return errFields.indexOf(errStr) !== -1;
  }

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
    removeUserFromChannel(channelInfo?.id, userId);
    if (channelInfo?.id === state.network?.selected?.channel) {
      setSelected('channel', '');
    }
  }
  const goSetChannelScope = () => {
    toggleChannelScope(channelInfo?.id);
    const newScope = scope === 'group' ? 'public' : 'group';
    setScope(newScope);
  }

  const handleRequestToggle = (nextRequestValue: string) => {
    setRequestValue(nextRequestValue);
    setUsersValue([]);
  }
  const handleUsers = (userArr: Array<string>) => {
    setUsersValue(userArr);
    scrubErr('users');
  } 
  const handleBigAction = () => {
    const selectedId = usersValue[0];
    if (requestValue === 'admin') {
      adminUserToChannel(channelInfo?.id, selectedId);
    } 
    if (requestValue === 'remove') {
      removeUserFromChannel(channelInfo?.id, selectedId);
    }
    if (requestValue === 'invite') {
      inviteUserToChannel(channelInfo?.id, selectedId);
    }
    setUsersValue([]);
  }

  const adminBage = (id:string) => {
    let icon = <></>;
    if (id === channelInfo?.admin) {
      icon = <LocalPoliceIcon />;
    } 
    return icon;
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
                <Container>
                  <div
                    className={styles.idCardPictureFrame}
                    data-augmented-ui="tr-clip-x br-clip bl-clip both"
                    style={{margin: '10px 0', padding: '8px'}}
                  >
                    <Typography variant="h5" >{channelInfo.name}</Typography>
                  </div>
                  {isAdmin && (
                    <>
                      <Divider variant="middle"  color="primary">
                        <Typography variant="h6">Actions</Typography>
                      </Divider>
                      <Stack spacing={2}>
                        <ToggleButtons
                          handleAction={handleRequestToggle}
                          requests={requests}
                          defaultButton={requests[0].value}
                        />
                        <InputUser
                          changeHandler={handleUsers}
                          value={usersValue}
                          contactGroups={groupForAction(requestValue)}
                          selectLimit={1}
                          error={hasErr('users')}
                        />
                      </Stack>
                    </>
                  )}
                  <Divider variant="middle"  color="primary">
                    <Typography variant="h6">Users</Typography>
                  </Divider>
                </Container>
                <SimpleScrollContainer>
                  <div>
                    {userList.length >= 1 && userList.map((item, index) => {
                      return (
                        <Chip
                          sx={{margin: '2px'}}
                          label={item.username || item.id}
                          icon={adminBage(item?.id || item.userid || '')} 
                          key={`${index}_chip_${item.username || item.id}_display`}
                        />
                      )
                    })}
                  </div>
                </SimpleScrollContainer>
              </>
            ) : (
              <LinearProgress color="secondary" />
            )}
          </Box>
          <Box sx={flexFooter}>
            <FooterNav
              firstHexProps={{
          
              }}
              secondHexProps={{
      
              }}
              bigHexProps={{
                icon: <ManageAccountsIcon />,
                disabled: !isAdmin,
                dialog: dialogForAction(requestValue),
                handleAction: handleBigAction,
              }}
              thirdHexProps={{
                icon: <NoMeetingRoomIcon />,
                handleAction: goLeaveChannel,
                dialog: "Leave this channel?"
              }}
              fourthHexProps={{
                icon: scope == 'group' ? <LockOpenIcon /> : <LockIcon />,
                disabled: !isAdmin,
                handleAction: goSetChannelScope,
              }}
            />
          </Box>
        </Box>
      </div>
    </Container>
  )
}