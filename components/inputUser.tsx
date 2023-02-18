import React, { useContext, useEffect, useRef, useState } from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import { Context as NnContext } from '../components/context/nnContext';
import { NnProviderValues } from '../components/context/nnTypes';
import styles from '../styles/generic.module.css';
import {
    Box,
    Button,
    ButtonGroup,
    OutlinedInput,
    InputLabel,
    FormControl,
    Chip,
    Select,
    Grow,
    Paper,
    Popper,
    MenuItem,
    MenuList,
    ClickAwayListener,
    InputAdornment,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import QrCodeIcon from '@mui/icons-material/QrCode';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import WorkIcon from '@mui/icons-material/Work';
import ThreePIcon from '@mui/icons-material/ThreeP';

interface InputUserProps {
    changeHandler: Function;
    error?: boolean;
    value: string[];
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const options = ['scanned', 'contacts', 'chat', 'faction']; //TODO:  add faction to list if in factions

function getStyles(name: string, userName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      userName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function InputUser(props:InputUserProps):JSX.Element {
  const { changeHandler, error, value } = props;
  const theme = useTheme();
  const [userName, setUserName] = useState<string[]>(value);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const { state }: NnProviderValues = useContext(NnContext); 
  const filteredUsergroups = state.network?.collections?.users?.
    filter(arrItem => arrItem.id == 'contacts')[0]; 
  const contacts = filteredUsergroups?.collection || []

  console.log('contacts', state.network?.collections?.users);

  const handleChange = (event: SelectChangeEvent<typeof userName>) => {
    const {
      target: { value },
    } = event;
    setUserName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
    changeHandler(value);
  };

  // UI Handlers
  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setOpen(false);
  };

  useEffect(()=>{
    value !== userName && setUserName(value);
  }, [userName, value]);

  //JSX Elements
  const collectionIcon = (icon: string) => {
    switch (icon) {
        case 'scanned':
            return <QrCodeIcon />
        case 'contacts':
            return <PeopleAltIcon />
        case 'faction':
            return <WorkIcon />
        case 'chat':
            return <ThreePIcon />
        default:
            return <PsychologyAltIcon />
    }
  }
  
  const nameById = (id:string) => {
    const contacts = state.network?.collections?.users?.
      filter(arrItem => arrItem.id == 'contacts')[0].collection || [];
    const scannedUsers = state.network?.collections?.users?.
      filter(arrItem => arrItem.id == 'scannedUsers')[0].collection || [];  
    const allKnownUsers = [...contacts, ...scannedUsers] || [];
    if(allKnownUsers.length !== 0) {
        const user = allKnownUsers.find(user => user.id === id);
        return user ? user.username : id;
    }
  }


  return (
      <FormControl fullWidth error={error}>
            <InputLabel shrink>Users</InputLabel>
            <Select
                labelId="users"
                multiple
                value={userName}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                MenuProps={{
                classes: {
                    paper: styles.selectMenu
                }
                }}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                        <Chip key={value} label={nameById(value)} />
                    ))}
                    </Box>
                )}
                startAdornment={<InputAdornment position="start">
                    <ButtonGroup variant="outlined" ref={anchorRef} aria-label="split button">
                    <Button
                        size="small"
                        aria-controls={open ? 'split-button-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-label="select merge strategy"
                        aria-haspopup="menu"
                        onClick={handleToggle}
                    >
                        {collectionIcon(options[selectedIndex])}
                    </Button>
                </ButtonGroup>
                <Popper
                    sx={{
                    zIndex: 1,
                    }}
                    open={open}
                    anchorEl={anchorRef.current}
                    role={undefined}
                    transition
                    disablePortal
                >
                    {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                        transformOrigin:
                            placement === 'bottom' ? 'center top' : 'center bottom',
                        }}
                    >
                        <Paper>
                        <ClickAwayListener onClickAway={handleClose}>
                            <MenuList id="split-button-menu" autoFocusItem>
                            {options.map((option, index) => (
                                <MenuItem
                                key={option}
                                disabled={index >= 2} //todo: add check for faction and recent chat
                                selected={index === selectedIndex}
                                onClick={(event) => handleMenuItemClick(event, index)}
                                >
                                {collectionIcon(option)}
                                </MenuItem>
                            ))}
                            </MenuList>
                        </ClickAwayListener>
                        </Paper>
                    </Grow>
                    )}
                </Popper>

                </InputAdornment>}
                >
                {contacts.map((user, index) => (
                    <MenuItem
                        key={`${user.id}_${index}`}
                        value={user.id}
                        style={getStyles(user.id, (user.username as unknown as string[] || user.id), theme)}
                    >
                    {(user.username as unknown as string[] || user.id)}
                    </MenuItem>
                ))}
            </Select>
      </FormControl>
  );
}