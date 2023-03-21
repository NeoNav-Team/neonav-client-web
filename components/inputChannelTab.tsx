import React, { useContext, useState, useEffect, useMemo } from 'react';
import { restrictedChannels } from '../utilites/constants';
import { Box, Tab, Tabs } from '@mui/material';
import { Context as NnContext } from '../components/context/nnContext';
import { NnProviderValues } from '../components/context/nnTypes';

interface InputChannelTabProps {
  changeHandler?: Function;
  value?: string;
}
type InputChannelScope = 'global' | 'public' | 'group';

const GLOBAL_CHAT = restrictedChannels[0];
  
export default function InputChannelTab(props:InputChannelTabProps):JSX.Element {
  const { changeHandler, value } = props;
  const [selected, setSelected] = useState<string | null>(null);
  const { state }: NnProviderValues = useContext(NnContext);
  const channels = useMemo(()=>{
    return state.user?.channels || []
  }, [state.user?.channels]); 
  const [scope, setScope] = useState<InputChannelScope>('global');
  const channelFound = value && channels.filter(channel => channel.id === value).length === 1;
  const scopedChannels = (scope: string) => {
    return channels.filter(channel => channel.scope === scope);
  }
  const scopeLabel = (scope:string) => {
    const tancifyName = `谈.${scope}`;
    const firstChannel = scopedChannels(scope)[0] || '谈.社群.组';
    const label = scopedChannels('public').length >= 2 ? tancifyName : firstChannel
    return label;
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
    const defaultSelected = showChannelList ? defaultChannelListIndex : null;
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
    <Box sx={{ maxWidth: '100%', borderBottom: 1, borderColor: 'divider' }}>
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
    <Box sx={{ maxWidth: '100%', borderBottom: 1, borderColor: 'divider' }}>
      {selected && (
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