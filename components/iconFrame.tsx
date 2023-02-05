import React from 'react';
import { Box, IconButton } from '@mui/material';
import styles from '../styles/iconframe.module.css';

interface ButtonIconProps {
    height?: number;
    width?: number;
    title?: string;
    isEven?: boolean;
    icon?: React.ReactNode;
}

const sizeValues = {
    xs: {
        width: 96,
        height: 96,
        fontSize: 64 
    },
    md: {
        width: 96,
        height: 96,
        fontSize: 64 
    },
    lg: {
        width: 96,
        height: 96,
        fontSize: 64 
    },
    xl: {
        width: 96,
        height: 96,
        fontSize: 64 
    }
}

function ButtonIcon(props:ButtonIconProps):JSX.Element {
    const { title, isEven, icon } = props;
    const evenClass = isEven ? 'even' : '';

    const boxSizing = {
        width: {
            xs: 64,
            sm: 72,
            md: 96,
            lg: 108,
            xl: 120,
        },
        height: {
            xs: 64,
            sm: 72,
            md: 96,
            lg: 108,
            xl: 120,
        },
        fontSize: {
            xs: 48,
            sm: 60,
            md: 72,
            lg: 88,
            xl: 96,
        }
    };


  return (
    <Box>
        <Box className={styles.iconFrame} sx={boxSizing}>
            <div className={evenClass && styles.even}>
                <div className={styles.abg} data-augmented-ui="all-hexangle-down inlay" />
                <div className={styles.augment} data-augmented-ui="all-hexangle-up border" />
                    <IconButton 
                        className={styles.iconButton} 
                        sx={boxSizing}
                    >
                        {icon}
                    </IconButton>
            </div>
        </Box>
        {title &&
            <div className={styles.iconName} data-augmented-ui="tl-clip br-clip inlay">
                <span>{title}</span>
            </div>
        }
    </Box>
  )
}
export default ButtonIcon;