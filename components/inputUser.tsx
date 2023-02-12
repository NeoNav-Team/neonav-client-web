import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
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
    Grid,
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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const options = ['scanned', 'contacts', 'chat', 'faction']; //TODO:  add faction to list if in factions
const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

function getStyles(name: string, userName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      userName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function InputUser() {
  const theme = useTheme();
  const [userName, setUserName] = React.useState<string[]>([]);
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleChange = (event: SelectChangeEvent<typeof userName>) => {
    const {
      target: { value },
    } = event;
    setUserName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  // UI Handlers
  const handleClick = () => {
    console.info(`You clicked ${options[selectedIndex]}`);
  };
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


  return (
      <FormControl fullWidth>
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
                        <Chip key={value} label={value} />
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
                {names.map((name) => (
                    <MenuItem
                    key={name}
                    value={name}
                    style={getStyles(name, userName, theme)}
                    >
                    {name}
                    </MenuItem>
                ))}
            </Select>
      </FormControl>
  );
}