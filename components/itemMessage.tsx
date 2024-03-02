
import { 
  Box,
  Button,
  Stack,
  Typography
} from '@mui/material';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import styles from '../styles/item.module.css';
import { isoDateToDaily, isoDateToMonth } from '@/utilities/fomat';
import { LooseObject } from './context/nnTypes';

interface itemMessageProps {
    date?: string;
    id?: string;
    username?: string;
    text?: string;
    buttons?: LooseObject;
    dialogCallback?: Function;
  }
  
export default function ItemMessage(props:itemMessageProps):JSX.Element {
  const { buttons = {}, date = '', dialogCallback = null, id = '', username = '', text = '' } = props;
  const hasButtons = JSON.stringify(buttons).length >= 3;
  const isSystemMsg = (id:string, username:string) => {
    return id === '0000000000' && username === 'tan/chat';
  }

  const clickHandler = (buttonAction:string) => {
    const actionParams = buttons[buttonAction].split('=');
    actionParams.push(buttonAction);
    console.log(buttons[buttonAction], actionParams);
    dialogCallback && dialogCallback(actionParams);
  }
  
  return (
    <Box style={{padding: '1vh 0', width: '100%'}}>
      <Stack direction="row" spacing={1} alignItems="flex-end">
        <Box sx={{minWidth:'60%', maxWidth: '80%'}}>
          <div className={styles.dateLine} data-augmented-ui="tr-clip both">
            <Stack direction="row" spacing={1}>
              <div className={styles.idSmallText}>{id}</div>
              <div className={styles.dateText}>{isoDateToDaily(date)}</div>
              <div className={styles.dateText}><span>{isoDateToMonth(date)}</span></div>
            </Stack>
          </div>
        </Box>
      </Stack>
      <div className={isSystemMsg(id, username) ? styles.systemLine : styles.transactionLine} data-augmented-ui="tr-clip br-round bl-round inlay">
        <Box>
          <Typography><span className={styles.name}>{username}</span> 》 {text}</Typography>
        </Box>
      </div>
      {hasButtons && (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center" 
          justifyContent="flex-end" 
          sx={{minWidth:'100%'}}
        >
          <div>
            <Button
              size="small"
              variant="outlined"
              color="secondary"
              onClick={() => {clickHandler('decline')}}
              endIcon={<ThumbDownOffAltIcon />}>
                Decline
            </Button>
          </div>
          <div>
            <Button
              size="small"
              variant="outlined"
              color="success"
              onClick={() => {clickHandler('confirm')}}
              endIcon={<ThumbUpOffAltIcon />}>
                Confirm
            </Button>
          </div>
        </Stack>
      )}
    </Box>
  )
}