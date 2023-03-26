
import { 
  Box,
  Stack,
  Typography
} from '@mui/material';
import Link from 'next/link';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import styles from '../styles/item.module.css';
import { isoDateToDaily, isoDateToMonth } from '@/utilites/fomat';

interface itemStatusProps {
    date?: string;
    id?: string;
    username?: string;
    text?: string;
    action?: string;
    collection?: string;
    hidden?: boolean;
  }
  
export default function ItemStatus(props:itemStatusProps):JSX.Element {
  const { date = '', id = '', username = '', text = '', action, hidden, collection } = props;
  const statusText = action ? action : 'comments';

  return (
    <Box style={{padding: '1vh 0', width: '100%'}}>
      <div className={styles.statusLine} data-augmented-ui="tr-clip inlay">
        <Box>
          <Stack direction="row"
            spacing={1}
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography>
              <span className={styles.name}>{username}</span>  <span className={styles.action}>{statusText}</span> 》
              <span className={styles.comment}>{text}</span>
            </Typography>
            {collection && (<Link href={`/${collection}/${id}`}><MoreVertIcon /></Link>)}
          </Stack>
        </Box>
      </div>
      <Stack direction="row" spacing={1} alignItems="flex-end" justifyContent="flex-end">
        <Box sx={{minWidth:'50%', maxWidth: '79%'}}>
          <Stack direction="row" spacing={1}>
            <div>{hidden && <VisibilityOffIcon sx={{fontSize: 16, opacity: 0.25}} />}</div>
            <div className={styles.dateLine} data-augmented-ui="br-clip both">
              <Stack direction="row" spacing={1}>
                <div className={styles.dateText}>{isoDateToDaily(date)}</div>
                <div className={styles.dateText}><span>{isoDateToMonth(date)}</span></div>
              </Stack>
            </div>
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}