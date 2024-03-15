import React, { useContext, useState, useEffect, useMemo } from 'react';
import { restrictedChannels, globalChannel } from '../utilities/constants';
import { Box, Tab, Tabs } from '@mui/material';
import { Context as NnContext } from '../components/context/nnContext';
import { NnProviderValues } from '../components/context/nnTypes';

interface InputChannelTabProps {
  changeHandler?: Function;
  notify?: boolean;
  value?: string;
}
type InputChannelScope = 'global' | 'public' | 'group';

const GLOBAL_CHAT = globalChannel;
const NOTIFCATIONS = restrictedChannels[0];
const ALERTS = restrictedChannels[1];

const notifyChannels = [
  {name:'Notifcations', id: NOTIFCATIONS, scope: 'global'},
  {name: 'Alerts', id: ALERTS, scope: 'global'},
]
  
export default function InputChannelTab(props:InputChannelTabProps):JSX.Element {
  const { changeHandler, notify, value } = props;
  const [selected, setSelected] = useState<string | null>(notify ? NOTIFCATIONS : null);
  const { state }: NnProviderValues = useContext(NnContext);
  const channels = useMemo(()=>{
    const userChannels = state.user?.channels || [];
    return notify ? notifyChannels : userChannels;
  }, [notify, state.user?.channels]); 
  const [scope, setScope] = useState<InputChannelScope>('global');
  const channelFound = value && channels.filter(channel => channel.id === value).length === 1;
  const scopedChannels = (scope: string) => {
    return channels.filter(channel => channel.scope === scope);
  }
  const scopeLabel = (scope:string) => {
    return `谈.${scope}`;
  }
  const scopeDisable = (scope:string) => {
    return scopedChannels(scope)[0] ? false : true;
  }
  const getScopeChannelVars = (selectedScope: string) => {
    const scopeChannelList = scopedChannels(selectedScope);
    const showChannelList =  scopeChannelList ? scopeChannelList.length >= 2 : false;
    const defaultChannelListIndex = scopeChannelList.length >= 1 ? scopeChannelList[0].id : null;
    return { scopeChannelList, showChannelList, defaultChannelListIndex };
  }

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    const selectedChannel = channels.filter(channel => channel.id === newValue);
    changeHandler && changeHandler(selectedChannel[0].id);
    setSelected(selectedChannel[0].id);
  };
  const handleScope = (event: React.SyntheticEvent, newValue: InputChannelScope) => {
    setScope(newValue);
    const { showChannelList, defaultChannelListIndex } = getScopeChannelVars(newValue);
    const  defaultSelected = showChannelList ? defaultChannelListIndex : null;
    changeHandler && changeHandler(defaultChannelListIndex);
    setSelected(defaultSelected);
  };

  const setUniqueName = (name: string) => {
    if (name === '谈.global') {
      return '谈.neonav global coms'
    } else {
      return name;
    }
  } 

  useEffect(()=>{
    if (selected !== GLOBAL_CHAT) {
      const channel = channels.filter(channel => channel.id === selected)[0];
      const channelScope = channel?.scope || 'global';
      setScope(channelScope as InputChannelScope);
    }
  }, [channels, selected]);

  useEffect(()=> {
    if (channelFound) {
      setSelected(value);
    }
  }, [channelFound, channels, value])
  
  return (<>
    {!notify && (<Box sx={{ maxWidth: '100%', borderBottom: 1, borderColor: 'divider' }}>
      <Tabs
        value={scope}
        onChange={handleScope}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
      >
        <Tab key={'chat_global'} label={`${scopeLabel('global')}`} value={'global'} disabled={!channelFound}/>
        <Tab key={'chat_public'} label={`${scopeLabel('public')}`} value={'public'} disabled={!channelFound || scopeDisable('public')} />
        <Tab key={'chat_group'} label={`${scopeLabel('group')}`} value={'group'} disabled={!channelFound || scopeDisable('group')} />
      </Tabs>
    </Box>
    )}
    <Box sx={{ maxWidth: '100%', borderBottom: 1, borderColor: 'divider' }}>
      {(selected || notify) && (
        <Tabs
          value={selected}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
        >
          {scopedChannels(scope).map(channel => {
            return <Tab key={channel.name} label={setUniqueName(channel.name)} value={channel.id} />
          })}
        </Tabs>
      )}
    </Box>
  </>
  )
}