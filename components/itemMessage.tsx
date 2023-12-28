
import { 
  Box,
  Stack,
  Typography
} from '@mui/material';
import styles from '../styles/item.module.css';
import { isoDateToDaily, isoDateToMonth } from '@/utilities/fomat';

interface itemMessageProps {
    date?: string;
    id?: string;
    username?: string;
    text?: string;
  }
  
export default function ItemMessage(props:itemMessageProps):JSX.Element {
  const { date = '', id = '', username = '', text = '' } = props;
  const isSystemMsg = (id:string, username:string) => {
    return id === '0000000000' && username === 'tan/chat';
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
    </Box>
  )
}