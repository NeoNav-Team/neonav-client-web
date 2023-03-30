'use client';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import pLimit from 'p-limit';
import z from 'zod';
import styles from '../styles/generic.module.css';
import { Context as NnContext } from './context/nnContext';
import { NnProviderValues, nnEntity, NnContact } from './context/nnTypes';
import SimpleScrollContainer from './simpleScrollContainer';
import SubheaderGarden from './subheaderEntity';
import InputUser from './inputUser';
import FooterNav from './footerNav';
import { 
  Container,
  Box,
  CircularProgress,
  TextField,
  MenuItem,
  InputLabel,
  FormControl,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel,
  InputAdornment,
} from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import RateReviewIcon from '@mui/icons-material/RateReview';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import MoneyIcon from '@mui/icons-material/Money';
import AbcIcon from '@mui/icons-material/Abc';
import ChatIcon from '@mui/icons-material/Chat';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import QrCodeIcon from '@mui/icons-material/QrCode';
import TagIcon from '@mui/icons-material/Tag';
import MailLockIcon from '@mui/icons-material/MailLock';
import InboxIcon from '@mui/icons-material/Inbox';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { Stack } from '@mui/system';
import { use100vh } from 'react-div-100vh';

interface FactionSetStatusAppProps {
  params: {
    id: string;
  }
};

interface MissionStatusForm {
  message?: string;
  tag?: string;
  type?: string;
  hidden?: boolean;
  score?: number;
  rank?: string;
  recipients?: string[];
}

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


export default function FactionSetStatusApp(props: FactionSetStatusAppProps):JSX.Element {
  const FULL_HEIGHT = use100vh() || 600;
  const FLEX_HEIGHT = FULL_HEIGHT - 75;
  const SCROLL_HEIGHT = FULL_HEIGHT - 114;
  const { params } = props;
  const { id } = params;
  const { 
    state,
    fetchFactionDetails = (id:string) => {},
    fetchFactionStatuses = (id:string) => {},
    setFactionUserStatus = (factionId:string, status: string, userId?:string) => {},
  }: NnProviderValues = useContext(NnContext);
  const profile:nnEntity  = useMemo(() => {
    return state?.network?.entity || {};
  }, [state]);
  const contacts:NnContact[]  = useMemo(() => {
    return state?.network?.collections?.contacts || [];
  }, [state]);
  const userId = state?.user?.profile?.auth?.userid;
  const accountId = id || state?.network?.selected?.account || '';
  const admin = profile && profile?.admin?.length && profile?.admin[0];
  const reps = profile && profile?.reps;
  const isAdmin = profile && userId === admin?.userid;
  const isRep = isAdmin || (reps && reps.filter((user:NnContact) => user.id === userId).length >= 1);
  const [ profileFetched, setProfileFetched ] = useState(false);
  const [ form, setForm ] = useState<MissionStatusForm>({});
  const [ loading, setLoading ] = useState<boolean>(false);
  const [ errFields, setErrFields ] = useState<(string | number)[]>([]);
  const isRecentEntity = profile.id === accountId;
  const { message = '', tag = '', type = 'message', rank = 'D', score = 0, recipients = [], hidden = false } = form;
  const usergroups = [
    { 
      label: 'Contacts',
      value: 'contact',
      icon: <PeopleAltIcon />,
      users: contacts,
    },
    { 
      label: 'Scanned',
      value: 'scanned',
      icon: <QrCodeIcon />,
      users: [],
    },
    {
      label: 'Self',
      value: 'self',
      icon: <SupervisedUserCircleIcon />,
      users: [{username:profile.name, id:profile.id}], 
    }
  ]

  const goFetchFactionProfile = useCallback(() => {
    if (!profileFetched || !isRecentEntity) {
      fetchFactionDetails(accountId);
      fetchFactionStatuses(accountId);
      setProfileFetched(true);
    }
  }, [profileFetched, isRecentEntity, fetchFactionDetails, accountId, fetchFactionStatuses]);

  const scrubErr = (errStr:string) => {
    const newErrFields = errFields;
    const scrubdex = errFields.indexOf(errStr);
    newErrFields.splice(scrubdex, 1);
    setErrFields(newErrFields);
  }
  const hasErr = (errStr:string) => {
    return errFields.indexOf(errStr) !== -1;
  }

  const processTransactionQueue = () => {}

  const sendPayload = () => {
    //validate payload
    const data = z.object({
      recipients: z.array(z.string()).nonempty(),
      score: z.number(),
      rank: z.string(),
      type: z.string(),
      message: type === 'message' ? z.string().min(1) : z.string().optional(),
      tag: type !== 'message' ? z.string().min(3) : z.string().optional(),
      hidden: z.boolean(),
    }).safeParse({ 
      recipients,
      score,
      type,
      rank,
      tag,
      message,
      hidden
    });
    // show errors or do process
    if (!data.success) {
      let errFields: (string | number)[] = [];
      data.error.issues.map(errObj => {
        errFields = [...errFields, ...errObj.path]
      });
      setErrFields(errFields);
    } else {
      setLoading(true);
      console.log('processTransactionQueue()');
      setErrFields([]);
      processTransactionQueue();
    }
  }

  const changeHandler = (event:React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event?.target;
    setForm({...form, [name]: value } );
    scrubErr(name);
  }

  const changeSelectHandler = (event: SelectChangeEvent) => {
    const { name, value } = event?.target;
    setForm({...form, [name]: value } );
    scrubErr(name);
  }

  const changeCheckHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event?.target;
    setForm({...form, [name]: checked } );
    scrubErr(name);
  };

  const handleRecipient = (recipientArr: Array<string>) => {
    setForm({...form, recipients: recipientArr } );
    scrubErr('recipients');
  }

  const handleBigAction = () => {
    sendPayload();
  }


  useEffect(() => {
    goFetchFactionProfile();
  }, [accountId, goFetchFactionProfile, profile]);

  return (
    <Container disableGutters style={{height: '100%'}}>
      <div
        className={styles.darkPane}
        style={{height: '100%', maxHeight: 'calc(100% - 74px)', marginTop: '70px'}}
        data-augmented-ui="tr-rect br-clip bl-clip both"
      >
        <Box sx={{...flexContainer, minHeight: FLEX_HEIGHT, maxHeight: FLEX_HEIGHT}}>
          <SubheaderGarden photo={profile.image} title={profile.name} />
          <Box sx={{...flexBody, maxHeight: SCROLL_HEIGHT }}>
            {profileFetched ? (
              <><SimpleScrollContainer>
                <Stack spacing={2} sx={{ minWidth: '100%', minHeight: '100%' }}>
                  {contacts && (
                    <InputUser
                      contactGroups={usergroups}
                      changeHandler={handleRecipient}
                      value={recipients as unknown as []}
                      error={hasErr('recipients')}
                    />
                  )}
                  <FormControl fullWidth>
                    <InputLabel>Status Type</InputLabel>
                    <Select
                      labelId="Status-Type"
                      value={type}
                      name="type"
                      sx={{width: '100%'}}
                      label="Status Type"
                      defaultValue={type}
                      onChange={changeSelectHandler}
                    >
                      <MenuItem value="message">
                        <Stack
                          direction="row"
                          justifyContent="flex-start"
                          alignItems="center"
                        >
                          <ListItemIcon>
                            <ChatIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText>Message</ListItemText>
                        </Stack>
                      </MenuItem>
                      <MenuItem value="tally">
                        <Stack
                          direction="row"
                          justifyContent="flex-start"
                          alignItems="center"
                        >
                          <ListItemIcon>
                            <DoneAllIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText>Tally Mark</ListItemText>
                        </Stack>
                      </MenuItem>
                      <MenuItem value="score">
                        <Stack
                          direction="row"
                          justifyContent="flex-start"
                          alignItems="center"
                        >
                          <ListItemIcon>
                            <MoneyIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText>Score</ListItemText>
                        </Stack>
                      </MenuItem>
                      <MenuItem value="rank">
                        <Stack
                          direction="row"
                          justifyContent="flex-start"
                          alignItems="center"
                        >
                          <ListItemIcon>
                            <AbcIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText>Rank</ListItemText>
                        </Stack>
                      </MenuItem>
                    </Select>
                  </FormControl>
                  { type === ('message' || '') && (
                    <FormControl fullWidth>
                      <TextField
                        error={hasErr('message')}
                        name="message"
                        label="Message"
                        multiline
                        variant="outlined"
                        value={message}
                        onChange={changeHandler}
                        rows={4}
                      />
                    </FormControl>
                  )}
                  { type === ('score') && (
                    <FormControl fullWidth>
                      <TextField
                        name="score"
                        label="Score"
                        value={score}
                        variant="outlined"
                        type="number"
                        onChange={changeHandler}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="start">
                              <MoneyIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </FormControl>
                  )}
                  { type === ('rank') && (
                    <FormControl fullWidth>
                      <InputLabel>Rank</InputLabel>
                      <Select
                        labelId="Status-Rank"
                        value={rank}
                        name="rank"
                        sx={{width: '100%'}}
                        label="Ranking"
                        defaultValue={rank}
                        onChange={changeSelectHandler}
                      >
                        <MenuItem value="F">
                          <ListItemText>F</ListItemText>
                        </MenuItem>
                        <MenuItem value="D">
                          <ListItemText>D</ListItemText>
                        </MenuItem>
                        <MenuItem value="C">
                          <ListItemText>C</ListItemText>
                        </MenuItem>
                        <MenuItem value="B">
                          <ListItemText>B</ListItemText>
                        </MenuItem>
                        <MenuItem value="A">
                          <ListItemText>A</ListItemText>
                        </MenuItem>
                        <MenuItem value="S">
                          <ListItemText>S</ListItemText>
                        </MenuItem>
                      </Select>
                    </FormControl>        
                  )}
                  <FormControl fullWidth>
                    <TextField
                       error={hasErr('tag')}
                      name="tag"
                      label="Hashtag"
                      value={tag}
                      variant="outlined"
                      onChange={changeHandler}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <TagIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </FormControl>
                  <FormControlLabel
                    control={
                      <Switch checked={hidden} onChange={changeCheckHandler} name="hidden" />
                    }
                    label="For Faction Records Only"
                  />
                </Stack>
              </SimpleScrollContainer></>
            ) : (
              <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                sx={{minHeight: '100%'}}
              >
                <CircularProgress color="secondary" />
              </Stack>
            )}
          </Box>
          <Box sx={flexFooter}>
            <FooterNav
              firstHexProps={{
                disabled: true,
              }}
              secondHexProps={{
                icon: <QrCodeScannerIcon />,
                disabled: true,
              }}
              bigHexProps={{
                icon: <RateReviewIcon />,
                handleAction: handleBigAction,
                disabled: !isRep,
              }}
              thirdHexProps={{
                disabled: true,
              }}
              fourthHexProps={{
                icon: <SupervisedUserCircleIcon />,
                link: `/factions/${accountId}`
              }}
            />
          </Box>
        </Box>
      </div>
    </Container>
  )
}