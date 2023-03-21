/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useCallback, useContext, useState, useEffect, useMemo } from 'react';
import styles from '../styles/card.module.css';
import { Context as NnContext } from './context/nnContext';
import { NnFaction, nnEntity, NnProviderValues } from './context/nnTypes';
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
import TocIcon from '@mui/icons-material/Toc';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
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
    {label: 'Add', value:'add', icon: <PersonRemoveIcon />},
    {label: 'Remove', value:'remove', icon: <LocalPoliceIcon />},
    {label: 'Admin', value:'admin', icon: <LocalPoliceIcon />},
  ];
  const { 
    state,
    fetchFactionDetails = (id:string) =>{},
    fetchFactionUsers = (id:string) =>{},
    removeUserFromFaction = (faction:string, id:string) => {},
    toggleFactionScope = (id:string) =>{},
    adminUserToFaction = (faction:string, id:string) => {},
  }: NnProviderValues = useContext(NnContext);
  const userId:string = state?.user?.profile?.auth?.userid || '';
  const entityId:string = id || '';
  const factions = state?.user?.factions || [];
  const factionInfo:NnFaction = factions.filter(arrItem => arrItem.id == entityId)[0];
  const userList = state.network?.collections.entityUsers || [];
  const isAdmin = userId === factionInfo?.admin;
  const entity:nnEntity  = useMemo(() => {
    return state?.network?.entity || {};
  }, [state]);
  const [ fetched, setFetched ] = useState(false);
  const [ errFields, setErrFields ] = useState<(string | number)[]>([]);
  const [ requestValue, setRequestValue ] = useState<string>(requests[0].value);
  const [ usersValue, setUsersValue ] = useState<string[]>([]);

  const usergroups = [
    { 
      label: 'Contacts',
      value: 'contact',
      icon: <PeopleAltIcon />,
      users: userList || [],
    },
  ];

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
      fetchFactionUsers(entityId);
      setFetched(true);
    }
  }, [fetched, fetchFactionUsers, entityId, fetchFactionDetails]);

  useEffect(() => {
    goFetchFactionUsers();
  }, [factionInfo?.id, entity, goFetchFactionUsers, id, userList.length]);

  const goLeaveFaction = () =>  {
    removeUserFromFaction(factionInfo?.id, userId);
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
    if (requestValue === 'admin') {
      adminUserToFaction(factionInfo?.id, selectedId);
    } else if (requestValue === 'remove') {
      removeUserFromFaction(factionInfo?.id, selectedId);
    }
  }

  const adminBage = (id:string) => {
    let icon = <></>;
    if (id === factionInfo?.admin) {
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
            {factionInfo?.id === id ? (
              <>
                <Container>
                  <div
                    className={styles.idCardPictureFrame}
                    data-augmented-ui="tr-clip-x br-clip bl-clip both"
                    style={{margin: '10px 0', padding: '8px'}}
                  >
                    <Typography variant="h5" >{factionInfo.name}</Typography>
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
                          contactGroups={usergroups}
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
                    {userList.length >= 1 && userList.map(item => {
                      return (
                        <Chip
                          sx={{margin: '2px'}}
                          label={item.username || item.id}
                          icon={adminBage(item?.id || item.userid || '')} 
                          key={`chip_${item.username || item.id}_display`}
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
                icon: <NoMeetingRoomIcon />,
                handleAction: goLeaveFaction,
                dialog: "Leave this faction?"
              }}
              secondHexProps={{
                icon: <ManageAccountsIcon />,
                disabled: true,
              }}
              bigHexProps={{
                icon: <ManageAccountsIcon />,
                disabled: true,
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