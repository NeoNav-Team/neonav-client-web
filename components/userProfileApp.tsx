/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Resizer from "react-image-file-resizer";
import styles from '../styles/generic.module.css';
import { Context as NnContext } from './context/nnContext';
import { NnProviderValues, nnEntity } from './context/nnTypes';
import SimpleScrollContainer from './simpleScrollContainer';
import FooterNav from './footerNav';
import { 
  Container,
  Box,
  Typography,
  Divider,
  CircularProgress,
  Avatar,
  TextField,
  Button,
} from '@mui/material';
import RateReviewIcon from '@mui/icons-material/RateReview';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SaveIcon from '@mui/icons-material/Save';
import { Stack } from '@mui/system';
import { use100vh } from 'react-div-100vh';

interface UserProfileAppProps {};

type Form = {
  avatar?: string;
  thumbnail?: string;
  username?: string;
  firstname?: string;
  lastname?: string;
  skills?: string;
  occupation?: string;
  bio?: string;
}
type FormKey = 
'avatar' | 
'thumbnail' | 
'username' | 
'firstname' | 
'lastname' | 
'skills' | 
'occupation' | 
'bio';

const defaultForm = {
  avatar: '',
  thumbnail: '',
  username: '',
  firstname: '',
  lastname: '',
  skills: '',
  occupation: '',
  bio: '',
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

export default function UserProfileApp(props: UserProfileAppProps):JSX.Element {
  const FULL_HEIGHT = use100vh() || 600;
  const FLEX_HEIGHT = FULL_HEIGHT - 75;
  const SCROLL_HEIGHT = FULL_HEIGHT - 114;
  const { 
    state,
    fetchUserProfile = () => {},
    updateUserProfile = (document:any, update:any) => {},
  }: NnProviderValues = useContext(NnContext);
  const profile:nnEntity = useMemo(() => {
    return state?.network?.entity?.profile || {};
  }, [state]);
  const accountId = state?.network?.selected?.account || '';
  const isAdmin = accountId === profile.id;
  const [ profileFetched, setProfileFetched ] = useState(false);
  const [ editMode, setEditMode ] = useState(false);
  const [ form, setForm ] = useState<Form>(defaultForm);
  const { avatar, username, firstname, lastname, skills, occupation, thumbnail, bio } = form;
  const [ photo, setPhoto ] = useState<string | undefined>();

  const goFetchProfile = useCallback(() => {
    if (!profileFetched) {
      fetchUserProfile();
      setProfileFetched(true);
    }
  }, [profileFetched, fetchUserProfile]);

  const updateDefaultForm = (profile:nnEntity) => {
    let updatedDefaultForm:Form = defaultForm;
    Object.keys(updatedDefaultForm).map(function(key){
      if((profile as any)[key]) (updatedDefaultForm as any)[key]=(profile as any)[key]
    });
    setForm(updatedDefaultForm);
  }

  useEffect(() => {
    goFetchProfile();
  }, [goFetchProfile, profile]);

  useEffect(() => {
    if (Object.keys(profile).length >= 3) {
      updateDefaultForm(profile);
    }
  }, [profile]);

  const resizeFile = (file:File, field:FormKey, size:number) => {
    Resizer.imageFileResizer(
      file,
      size,
      size,
      "PNG",
      100,
      0,
      (uri) => {
        console.log('field', field);
        setForm({...form, [field]:uri } );
        field !== 'thumbnail' && setPhoto(uri as string);
      },
      "base64"
    );
  };

  const changeHandler = (event:React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event?.target;
    setForm({...form, [name]: value } );
  }

  const uploadHandler = async (event:React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event?.currentTarget;
    files && resizeFile(files[0], 'avatar', 600);
    files && setPhoto(avatar as string);
  }


  const saveProfileChanges = () => {
    const doc = {
      _id: state?.network?.entity?._id,
      _rev: state?.network?.entity?._rev,
    }
    updateUserProfile(doc, form);
  } 

  const bigButtonAction = ()=> {
    if (editMode) {
      saveProfileChanges();
      setPhoto(avatar);
    } else {
      goFetchProfile(); //get latest before editing
    }
    setEditMode(!editMode);
  }

  return (
    <Container disableGutters style={{height: '100%'}}>
      <div
        className={styles.darkPane}
        style={{height: '100%', maxHeight: 'calc(100% - 74px)', marginTop: '70px'}}
        data-augmented-ui="tl-clip-x tr-rect br-clip bl-clip both"
      >
        <Box sx={{...flexContainer, minHeight: FLEX_HEIGHT, maxHeight: FLEX_HEIGHT}}>
          <Box sx={{...flexBody, maxHeight: SCROLL_HEIGHT }}>
            {profileFetched ? (
              profile && Object.keys(profile).length !== 0 ?(
                <SimpleScrollContainer>
                  <Box sx={{minWidth: '100%', minHeight: '100%'}}>
                    <Stack spacing={0} sx={{ display: 'flex' }}>
                      <div>
                        <Divider variant="middle"  color="primary"><Typography variant="h6">Photo</Typography></Divider>
                        <Box
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                        >
                          {editMode ? (
                            <Stack spacing={1} >
                              <img src={photo || avatar} alt="Please upload an image" style={{minWidth: 200, minHeight: 200}} />
                              <Button variant="contained" component="label" endIcon={<PhotoCameraIcon />}>
                                Upload
                                <input hidden multiple type="file" onChange={uploadHandler} accept="image/png, image/jpeg" />
                              </Button>
                            </Stack>
                          ) : (
                            <>
                              <Avatar src={avatar} alt="its you in the future" style={{width: 200, minHeight: 200}} />
                            </>
                          )}
                        </Box>
                      </div>
                      <Divider variant="middle" color="primary"><Typography variant="h6">Name</Typography></Divider>
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                      >
                        {editMode ? (
                          <Stack spacing={1}>
                            <div>
                              <TextField onChange={changeHandler} name="username" value={username} label="Username" variant="outlined" style={{width: '100%'}} />
                            </div>
                            <Stack direction="row" spacing={1}>
                              <TextField onChange={changeHandler} name="firstname" value={firstname} label="First Name" variant="outlined" />
                              <TextField onChange={changeHandler} name="lastname" value={lastname} label="Last Name" variant="outlined" />
                            </Stack>
                          </Stack>
                        ) :(
                          <>
                            <p>{profile?.username} [ {profile?.firstname} {profile?.lastname} ]</p>
                          </>
                        )}
                      </Box>
                      <Divider variant="middle" color="primary"><Typography variant="h6">Occupation</Typography></Divider>
                      {editMode ? (
                        <>
                          <TextField onChange={changeHandler} name="occupation" value={occupation} label="Occupation" variant="outlined" />
                        </>
                      ) : (
                        <p>{profile?.occupation}</p>
                      )}
                      <Divider variant="middle" color="primary"><Typography variant="h6">Skills</Typography></Divider>
                      {editMode ? (
                        <>
                          <TextField onChange={changeHandler} name="skills" value={skills} label="Skills" variant="outlined" />
                        </>
                      ) : (
                        <p>{profile?.skills}</p>
                      )}
                      <Divider variant="middle" color="primary"><Typography variant="h6">Bio</Typography></Divider>
                      {editMode ? (
                        <>
                          <TextField onChange={changeHandler} name="bio" value={bio} multiline rows={4} label="Bio" variant="outlined" />
                        </>
                      ) : (
                        <p>{profile?.bio}</p>
                      )}
                    </Stack>
                  </Box>
                </SimpleScrollContainer>
              ) : (
                <Typography variant='h2'> 404 Profile Not Found</Typography>
              )) : (
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
              bigHexProps={{
                icon: editMode ? <SaveIcon /> : <RateReviewIcon />,
                disabled: isAdmin,
                handleAction: bigButtonAction,
              }}
            />
          </Box>
        </Box>
      </div>
    </Container>
  )
}