import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import { NnContact, nnEntity, NnFaction } from '../components/context/nnTypes';
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
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';



type contactGroup = {
  label: string;
  value: string;
  icon?: React.ReactElement;
  disabled?: boolean;
  users: nnEntity[];
}

interface InputUserProps {
    changeHandler: Function;
    error?: boolean;
    selectLimit?: number;
    defaultList?: number;
    value: string[];
    contactGroups: contactGroup[];
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;


function getStyles(name: string, userName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      userName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function InputUser(props:InputUserProps):JSX.Element {
  const { contactGroups, changeHandler, defaultList, error, value, selectLimit } = props;
  const theme = useTheme();
  const [userName, setUserName] = useState<string[]>(value);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(defaultList || 0);
  let allKnownUsers:nnEntity[] = [];
  contactGroups.map((group) => {
    allKnownUsers = [...allKnownUsers, ...group.users ];
  })

  const handleChange = (event: SelectChangeEvent<typeof userName>) => {
    console.log('handleChange', event);
    const {
      target: { value },
    } = event;
    const newValue: string[] = typeof value === 'string' ? value.split(',') : value;
    if((selectLimit && newValue.length <= selectLimit) || typeof selectLimit === 'undefined') {
      setUserName(newValue);
      changeHandler(newValue);
    }
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

  const nameById = (id:string) => {  
    if(allKnownUsers.length !== 0) {
      const user = allKnownUsers.find(user => (user.id || user.userid) === id);
      const username = user?.username || user?.name || id;
      const formattedName =  username && username?.length >= 12 ? `${username.substring(0, 12)}...` : username;
      return formattedName;
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
            {selected.map((value ) => (
              <Chip key={`chip_${value}_select`} label={nameById(value)} />
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
              {contactGroups[selectedIndex].icon}
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
                      {contactGroups.map((group, index) => (
                        <MenuItem
                          key={`${group.value}_icon`}
                          disabled={group.disabled}
                          selected={index === selectedIndex}
                          onClick={(event) => handleMenuItemClick(event, index)}
                        >
                          {group.icon || <PsychologyAltIcon />}
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
        {contactGroups[selectedIndex].users && contactGroups[selectedIndex].users.map((user, index) => (
          <MenuItem
            key={`${user.id}_${index}`}
            value={user.id || user.userid}
            style={getStyles((user.id || ''), (user.username as unknown as string[] || user.id), theme)}
          >
            {(user.username as unknown as string[] || user.name as unknown as string[] || user.id || user.userid)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}