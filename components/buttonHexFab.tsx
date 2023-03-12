import { cloneElement } from 'react';
import {
  Box,
  Fab,
  Link,
  CircularProgress,
} from '@mui/material';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import styles from '../styles/buttonHexFab.module.css';


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
}

const small = {height: '50px', width: '50px'};
const medium = {height: '75px', width: '75px'};
const large = {height: '100px', width: '100px'};
const sizes = {small, medium, large};

export default function ButtonHexFab(props:ButtonHexFabProps):JSX.Element {
  const { handleAction, loading, link, icon, disabled, size = 'small'} = props;
  const clickHandler = () => {
    if (handleAction) {
      handleAction();
    }
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
    <Fab color="secondary"
      aria-label="scan"
      sx={getsize(size)}
      disabled={disabled}
      onClick={() => clickHandler()}
    >
      {loading ? <CircularProgress/> : (
        icon ? clonedIconWithProps : (<DoNotDisturbIcon sx={iconStyles} />)
      )}
    </Fab>
  )};

  return (
    <Box className={styles.footerItem} data-visible={icon ? true : false}>
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