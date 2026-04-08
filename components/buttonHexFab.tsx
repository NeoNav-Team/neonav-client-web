import { cloneElement, useState } from 'react';
import {
  Box,
  Fab,
  Link,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import styles from '../styles/buttonHexFab.module.css';
import SimpleDialog from './simpleDialog';


type BtnSizes = 'small' | 'medium' | 'large';
type SizeDimension = {
    height: string;
    width: string;
}

export interface ButtonHexFabProps {
    handleAction?: Function;
    loading?: boolean;
    link?: string;
    icon?: JSX.Element;
    disabled?: boolean;
    size?: BtnSizes;
    dialog?: string;
    useInput?: boolean;
    tooltipText?: string;
}

const small = {height: '50px', width: '50px'};
const medium = {height: '75px', width: '75px'};
const large = {height: '100px', width: '100px'};
const sizes = {small, medium, large};

export default function ButtonHexFab(props:ButtonHexFabProps):JSX.Element {
  const { dialog, handleAction, useInput, loading, link, icon, disabled, size = 'small'} = props;
  const [open, setOpen] = useState(false);

  const clickHandler = () => {
    if (!disabled) {
      if (dialog && handleAction) {
        setOpen(true);
      } else if (handleAction) {
        handleAction();
      }
    }
  }

  const dialogCloseAction = (value:any) => {
    handleAction && handleAction(value);
    setOpen(false);
  }
  const handleClose = () => {
    setOpen(false);
  }

  const getsize = (size:BtnSizes) => {
    let pickedSize:SizeDimension = small;
    if (size) {
      pickedSize = sizes[size];
    }
    return pickedSize;
  }
  const iconStyles = {width: '75%', height: '75%'};
  const clonedIconWithProps =  icon ? cloneElement(icon, { sx: iconStyles }) : null;

  const HexButton = () => { return (
    <>
      <Tooltip 
        className={styles.footerItem}
        title={props.tooltipText || ""} 
        enterTouchDelay={500} // Triggers long-press slightly faster on mobile
        leaveTouchDelay={1500} // Keeps it visible briefly after letting go
        slotProps={{ // Styling is here becuase they don't always inherit the local CSS automatically
          tooltip: {
            sx: {
              fontFamily: "'Jura', sans-serif",
              fontSize: "1rem",
              backgroundColor: "rgba(20, 0, 40, 0.9)", // Dark purple base
              color: "#00f3ff", // Cyber cyan text
              border: "1px solid #ff00ff", // Neon pink border
              boxShadow: "0 0 10px #ff00ff, inset 0 0 5px #00f3ff",
              padding: "8px 12px",

              // The Glitch Logic
              animation: 'heavyGlitch 3s step-end 1',
              '@keyframes heavyGlitch': {
                '0%, 90%, 100%': {
                  transform: 'none',
                  filter: 'none',
                  textShadow: 'none',
                  boxShadow: '0 0 10px #ff00ff, inset 0 0 5px #00f3ff',
                  color: '#00f3ff',
                  opacity: 1,
                },
                '92%': {
                  transform: 'skewX(-15deg) scaleY(1.1)',
                  clipPath: 'inset(10% 0 40% 0)', // Slices off the bottom
                  filter: 'hue-rotate(90deg) brightness(2)',
                  boxShadow: '5px 0 20px #ff00ff',
                },
                '94%': {
                  transform: 'skewX(15deg) translateX(-5px)',
                  clipPath: 'inset(50% 0 10% 0)', // Slices off the top
                  filter: 'invert(1)',
                  color: '#ff00ff',
                },
                '96%': {
                  transform: 'none',
                  clipPath: 'none',
                  textShadow: '3px 0 #ff00ff, -3px 0 #00f3ff', // RGB Split
                },
                '98%': {
                  transform: 'scale(1.05) rotate(1deg)',
                  filter: 'blur(1px)',
                  opacity: 0.7,
                }
              }
            },
          },
        }}
      >
        <Fab color="secondary"
          aria-label="scan"
          style={{ opacity: icon && !disabled ? 1 : 0.3 }}
          sx={getsize(size)}
          disabled={disabled || icon ? false : true}
          onClick={() => clickHandler()}
        >
          {loading ? <CircularProgress/> : (
            icon ? clonedIconWithProps : null
          )}
        </Fab>
      </Tooltip>
      <SimpleDialog handleAction={dialogCloseAction} handleClose={handleClose} open={open} useInput={useInput} dialog={dialog} />
    </>
  )};

  return (
    <Box className={styles.footerItem}>
      {link && !disabled ?  (
        <Link href={link}>
          <HexButton />
        </Link>
      ) : (
        <HexButton />
      )}
    </Box>
  );
}