import React, { useContext, useState } from 'react';
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
  const [scope, setScope] = useState<InputChannelScope>('global');
  const [selected, setSelected] = useState<string | null>(null);
  const { state }: NnProviderValues = useContext(NnContext);
  const channels = state.user?.channels || []; 
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
  
  return (<>
    <Box sx={{ maxWidth: '100%', borderBottom: 1, borderColor: 'divider' }}>
      <Tabs
        value={scope}
        onChange={handleScope}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
      >
        <Tab key={'chat_global'} label={`${scopeLabel('global')}`} value={'global'} />
        <Tab key={'chat_public'} label={`${scopeLabel('public')}`} value={'public'} disabled={scopeDisable('public')} />
        <Tab key={'chat_group'} label={`${scopeLabel('group')}`} value={'group'} disabled={scopeDisable('group')} />
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
            return <Tab key={channel.name} label={channel.name} value={channel.id} />
          })}
        </Tabs>
      )}
    </Box>
  </>
  )
}