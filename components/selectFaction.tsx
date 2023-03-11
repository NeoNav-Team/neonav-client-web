import { useContext, useState, useMemo, MouseEvent } from 'react';
import { Context as NnContext } from '../components/context/nnContext';
import { NnProviderValues, NnFaction } from '../components/context/nnTypes';
import { IconButton } from "@mui/material";
import AccountCircle from '@mui/icons-material/AccountCircle';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';

interface SelectFactionProps {
  children?: React.ReactNode;
}

const colors = [
  '#42c6ff',
  '#ff00a0',
  '#f96363',
  '#00ff9f',
  '#00FF00',
  '#FF00FF',
  '#C0C0C0',
  '#FFFF00',
  '#FF0000',
  '#0000FF',
]

export default function SelectFaction(props:SelectFactionProps):JSX.Element {
  const { children } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { state }: NnProviderValues = useContext(NnContext); 
  const factions:NnFaction[] = useMemo(() => { return state?.user?.factions || [] }, [state]);
  const user:string = useMemo(() => { return state?.user?.profile?.meta?.firstname || 'Personal' }, [state]);
  const [selected, setSelected] = useState<number>(-1);


  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenuItemClick = (event: MouseEvent<HTMLButtonElement>, index: number) => {
    setSelected(index);
  }

  return (
    <>
     <IconButton
        size="large"
        onClick={handleClick}
      >
        {selected === -1 ? <AccountCircle /> : <SupervisedUserCircleIcon sx={{color:colors[selected]}} />}
      </IconButton>
      {factions && (
      <Menu
        id="factions-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{maxWidth: '300px'}}
      >
      <MenuItem 
        onClick={(event:any) => handleMenuItemClick(event, -1)}
        selected={selected === -1}
        >
      <ListItemIcon>
        <AccountCircle />
      </ListItemIcon>
        {user}
      </MenuItem>
      {factions.map((faction, index) => (
        <MenuItem 
          onClick={(event:any) => handleMenuItemClick(event, index)}
          key={faction?.id}
          selected={selected === index}
        >
        <ListItemIcon>
          <SupervisedUserCircleIcon fontSize="small" sx={{color:colors[index]}} />
        </ListItemIcon>
        <div style={{overflow:'hidden', textOverflow: 'ellipsis'}}>{faction.name}</div>
      </MenuItem>
      ))}
      {children}
      </Menu>
      )}
    </>
  )
}