import {
    Box,
    Stack,
} from '@mui/material';
import styles from '../styles/generic.module.css';
import ButtonHexFab, { ButtonHexFabProps } from './buttonHexFab';

/* SO MANY PROPS! */
interface FooterNavProps {
    children?: React.ReactNode;
    bigHexProps?: ButtonHexFabProps; 
    firstHexProps?: ButtonHexFabProps; 
    secondHexProps?: ButtonHexFabProps; 
    thirdHexProps?: ButtonHexFabProps; 
    fourthHexProps?: ButtonHexFabProps; 
}
  
export default function FooterNav(props:FooterNavProps):JSX.Element {
    const {
        children,
        bigHexProps,
        firstHexProps, 
        secondHexProps,
        thirdHexProps,
        fourthHexProps,
    } = props;
  
    return (
      <div style={{ minHeight: '110px'}} >
        <div className={styles.gridBackground}></div>
        <div style={{ marginBottom: '10px', textAlign: 'center' }}>
            {children ? (
                <>{children}</>
            ) : (
                <Stack
                    direction="row"
                    sx={{minHeight: 110}}
                    justifyContent="center"
                    alignItems="flex-end"
                    spacing={1}
                >
                    <Box>
                        {firstHexProps && (<ButtonHexFab {...firstHexProps} />)}
                    </Box>
                    <Box>
                        {secondHexProps && (<ButtonHexFab {...secondHexProps} size={secondHexProps?.size || 'medium'}  />)}
                    </Box>
                    <Box>
                        {bigHexProps && (<ButtonHexFab {...bigHexProps} size={bigHexProps?.size || 'large'} />)}
                    </Box>
                    <Box>
                        {thirdHexProps && (<ButtonHexFab {...thirdHexProps} size={thirdHexProps?.size || 'medium'}  />)}
                    </Box>
                    <Box>
                        {fourthHexProps && (<ButtonHexFab {...fourthHexProps} />)}
                    </Box>
                </Stack>
            )}
        </div>
      </div>
    )
 }