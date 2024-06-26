/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useCallback, useContext, useState, useEffect, useMemo } from 'react';
import styles from '../styles/card.module.css';
import { Context as NnContext } from './context/nnContext';
import { NnFaction, nnEntity, NnProviderValues, NnContact, NnSimpleEntity } from './context/nnTypes';
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
import TocIcon from '@mui/icons-material/Toc';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ShieldIcon from '@mui/icons-material/Shield';
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import RemoveModeratorIcon from '@mui/icons-material/RemoveModerator';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import NoMeetingRoomIcon from '@mui/icons-material/NoMeetingRoom';
import { Stack } from '@mui/system';
import { use100vh } from 'react-div-100vh';


interface FactionAdminAppProps {
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


export default function FactionAdminApp(props: FactionAdminAppProps):JSX.Element {
  const { params } = props;
  const { id } = params;
  const FULL_HEIGHT = use100vh() || 600;
  const FLEX_HEIGHT = FULL_HEIGHT - 75;
  const SCROLL_HEIGHT = FULL_HEIGHT - 114;
  const requests = [
    {label: '', value:'add', icon: <PersonAddIcon />},
    {label: '', value:'remove', icon: <PersonRemoveIcon />},
    {label: '', value:'addRep', icon: <AddModeratorIcon />},
    {label: '', value:'removeRep', icon: <RemoveModeratorIcon />},
  ];

  const objectifyIds = (collection: Array<string | object>) => {
    let objectArr = []
    if (typeof collection[0] === 'string') {
      objectArr = collection.map(id => {
        return {id:id, username: id};
      })
    } else {
      objectArr = collection;
    }
    return objectArr;
  }

  const { 
    state,
    fetchFactionDetails = (id:string) =>{},
    addUserToFaction = (faction:string, id:string) => {},
    removeUserFromFaction = (faction:string, id:string) => {},
    addRepToFaction = (faction:string, id:string) => {},
    removeRepToFaction = (faction:string, id:string) => {},
  }: NnProviderValues = useContext(NnContext);
  const userId:string = state?.user?.profile?.auth?.userid || '';
  const entityId:string = id || '';
  const entity:nnEntity  = useMemo(() => {
    return state?.network?.entity || {};
  }, [state]);
  const repsList = objectifyIds(entity?.reps || []);
  const memberList = objectifyIds(entity?.members || []);
  const nRepsList:NnContact[] | NnSimpleEntity[] = entity?.reps || [];
  const nMemberList:NnContact[] | NnSimpleEntity[] = entity?.members || [];
  const contacts:NnContact[] | NnSimpleEntity[] = state?.network?.collections?.contacts || [];
  const sortedContacts = contacts.sort((a, b) => {
    if (a.username && b.username) {
      return a.username.localeCompare(b.username)
    } 
    else {
      return 0
    }
  });
  const adminUser = entity.admin ? entity?.admin[0] :  {};
  const isAdmin = userId === adminUser.userid;

  const [ fetched, setFetched ] = useState(false);
  const [ errFields, setErrFields ] = useState<(string | number)[]>([]);
  const [ requestValue, setRequestValue ] = useState<string>(requests[0].value);
  const [ usersValue, setUsersValue ] = useState<string[]>([]);

  type group = {
    label: string,
    value: string,
    icon: React.ReactElement,
    users: nnEntity[] | NnContact[] | NnFaction[] | NnSimpleEntity[],
  }

  const usergroups: group[] = [
    { 
      label: 'Faction Members',
      value: 'members',
      icon: <PeopleAltIcon />,
      users: nMemberList || [],
    },
    { 
      label: 'Contacts',
      value: 'contact',
      icon: <PeopleAltIcon />,
      users: sortedContacts || [],
    },
    { 
      label: 'Clipboard',
      value: 'clipboard',
      icon: <AssignmentIcon />,
      users: state?.network?.collections?.clipboardEntities || [],
    },
    { 
      label: 'Reps',
      value: 'reps',
      icon: <MeetingRoomIcon />,
      users: nRepsList || [],
    },
  ];

  const groupForAction = (requestValue:string):group[] => {
    let actionGroup:group[] = [];
    if (requestValue == 'add') {
      actionGroup.push(usergroups[1]);
      actionGroup.push(usergroups[2]);
    }
    if (requestValue == 'remove' || requestValue == 'addRep') {
      actionGroup = [
        usergroups[0],
      ]
    }
    if (requestValue == 'removeRep') {
      actionGroup = [
        usergroups[3],
      ]
    }
    return actionGroup;
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

  const goFetchFactionUsers = useCallback(() => {
    if (!fetched) {
      fetchFactionDetails(entityId);
      setFetched(true);
    }
  }, [fetched, entityId, fetchFactionDetails]);

  useEffect(() => {
    goFetchFactionUsers();
  }, [goFetchFactionUsers]);

  const goLeaveFaction = () =>  {
    removeUserFromFaction(entity?.id || '', userId);
  }

  const handleRequestToggle = (nextRequestValue: string) => {
    setRequestValue(nextRequestValue);
  }
  const handleUsers = (userArr: Array<string>) => {
    setUsersValue(userArr);
    scrubErr('users');
  } 
  const handleBigAction = () => {
    const selectedId = usersValue[0];
    switch (requestValue) {
      case 'addRep':
        addRepToFaction(entity?.id || '', selectedId);
        break;
      case 'removeRep':
        removeRepToFaction(entity?.id || '', selectedId);
        break;
      case 'add':
        addUserToFaction(entity?.id || '', selectedId);
        break;
      case 'remove':
        removeUserFromFaction(entity?.id || '', selectedId);
        break;
    }
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
            {entity?.id === id ? (
              <>
                <Container>
                  <div
                    className={styles.idCardPictureFrame}
                    data-augmented-ui="tr-clip-x br-clip bl-clip both"
                    style={{margin: '10px 0', padding: '8px'}}
                  >
                    <Typography variant="h5" >{entity.name}</Typography>
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
                          size="small"
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
                </Container>
                <SimpleScrollContainer>
                  <Stack>
                    <Box sx={{minWidth: '100%'}}>
                      <Divider variant="middle"  color="primary">
                        <Typography variant="h6">Reps</Typography>
                      </Divider>
                      <div>
                        <Chip
                          sx={{margin: '2px'}}
                          label={entity?.admin[0].username || entity?.admin[0].userid}
                          icon={<LocalPoliceIcon />} 
                          key={`chip_${entity?.admin[0].userid}_rep_display`}
                        />
                        {repsList.length >= 1 && (repsList as NnContact[]).map(item => {
                          return (
                            <Chip
                              sx={{margin: '2px'}}
                              label={item.username || item.id}
                              icon={<ShieldIcon />} 
                              key={`chip_${item.username || item.id}_rep_display`}
                            />
                          )
                        })}
                      </div>
                    </Box>
                    <Box sx={{minWidth: '100%'}}>
                      <Divider variant="middle"  color="primary">
                        <Typography variant="h6">Members</Typography>
                      </Divider>
                      <div>
                        {memberList.length >= 1 ? (memberList as NnContact[]).map(item => {
                          return (
                            <Chip
                              sx={{margin: '2px'}}
                              label={item.username || item.id}
                              key={`chip_${item.username || item.id}_member_display`}
                            />
                          )
                        }) : (
                          <Typography>Go find members.</Typography>
                        )}
                      </div>
                    </Box>
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
                handleAction: goLeaveFaction,
                dialog: "Leave this faction?"
              }}
              secondHexProps={{
                disabled: true,
              }}
              bigHexProps={{
                icon: <ManageAccountsIcon />,
                disabled: !isAdmin,
                handleAction: handleBigAction,
              }}
              thirdHexProps={{
                disabled: true,
              }}
              fourthHexProps={{
                icon: <TocIcon />,
                link: '/factions',
              }}
            />
          </Box>
        </Box>
      </div>
    </Container>
  )
}