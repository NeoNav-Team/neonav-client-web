/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
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
  Avatar
} from '@mui/material';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { Stack } from '@mui/system';
import { use100vh } from 'react-div-100vh';


interface UserProfileAppProps {};

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
    fetchUserProfile = () =>{},
  }: NnProviderValues = useContext(NnContext);
  const profile:nnEntity = useMemo(() => {
    return state?.network?.entity?.profile || {};
  }, [state]);
  const accountId = state?.network?.selected?.account || '';
  const [ profileFetched, setProfileFetched ] = useState(false);

  const goFetchProfile = useCallback(() => {
    if (!profileFetched) {
      fetchUserProfile();
      setProfileFetched(true);
    }
  }, [profileFetched, fetchUserProfile]);

  useEffect(() => {
    goFetchProfile();
  }, [goFetchProfile, profile]);

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
                          <img src={profile?.avatar} alt="its you in the future" style={{width: 200}} />
                        </Box>
                      </div>
                      <Divider variant="middle" color="primary"><Typography variant="h6">Name</Typography></Divider>
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <p>{profile?.username} [ {profile?.firstname} {profile?.lastname} ]</p>
                      </Box>
                      <Divider variant="middle" color="primary"><Typography variant="h6">Occupation</Typography></Divider>
                      {profile?.occupation}
                      <Divider variant="middle" color="primary"><Typography variant="h6">Skills</Typography></Divider>
                      {profile?.skills}
                      <Divider variant="middle" color="primary"><Typography variant="h6">Bio</Typography></Divider>
                      {profile?.bio}
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
                icon: <RateReviewIcon />,
                disabled: true,
              }}
            />
          </Box>
        </Box>
      </div>
    </Container>
  )
}