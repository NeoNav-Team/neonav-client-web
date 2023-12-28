import { cloneElement, useRef, useState } from 'react';
import {
  Box,
  Fab,
  Link,
  CircularProgress,
} from '@mui/material';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import styles from '../styles/buttonHexFab.module.css';
import SimpleDialog from './simpleDialog';
import { Opacity } from '@mui/icons-material';


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
}

const small = {height: '50px', width: '50px'};
const medium = {height: '75px', width: '75px'};
const large = {height: '100px', width: '100px'};
const sizes = {small, medium, large};

export default function ButtonHexFab(props:ButtonHexFabProps):JSX.Element {
  const { dialog, handleAction, useInput, loading, link, icon, disabled, size = 'small'} = props;
  const [open, setOpen] = useState(false);

  const clickHandler = () => {
    if (dialog && handleAction) {
      setOpen(true);
    } else if (handleAction) {
      handleAction();
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
      <Fab color="secondary"
        aria-label="scan"
        style={{ opacity: icon ? 1 : 0.3 }}
        sx={getsize(size)}
        disabled={disabled || icon ? false : true}
        onClick={() => clickHandler()}
      >
        {loading ? <CircularProgress/> : (
          icon ? clonedIconWithProps : null
        )}
      </Fab>
      <SimpleDialog handleAction={dialogCloseAction} handleClose={handleClose} open={open} useInput={useInput} dialog={dialog} />
    </>
  )};

  return (
    <Box className={styles.footerItem}>
      {link ?  (
        <Link href={link}>
          <HexButton />
        </Link>
      ) : (
        <HexButton />
      )}
    </Box>
  );
}