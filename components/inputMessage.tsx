
import { 
    Typography,
    Box,
    Stack,
    TextField
} from '@mui/material';
import styles from '../styles/generic.module.css';

interface InputMessageProps {
  value?: string | null;
  clickHandler: Function;
}

export default function InputMessage(props:InputMessageProps):JSX.Element {
  const { value, clickHandler } = props;

  return (
    <div
        className={styles.presentValue}
        data-augmented-ui="tl-clip-x tr-rect br-clip bl-clip both"
        style={{padding: '1vh', minWidth: '100%'}}
        onClick={()=> clickHandler}
    >
        <Stack
            direction="row"
            justifyContent="left"
            alignItems="flex-start"
            spacing={1}
        >
            <Box>
            <Typography
                variant='h2' sx={{ fontSize: { xs: '2.5rem', sm: '3rem', md: '3.75rem' }}}>
                ⇴&nbsp;{value}
            </Typography>
            </Box>
            <Box  sx={{minWidth: '100%'}}>
                <TextField sx={{minWidth: '85%'}}/>
            </Box>
        </Stack>
    </div>
  )
}