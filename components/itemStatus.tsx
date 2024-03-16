
import { 
  Box,
  Stack,
  Typography,
  Chip,
} from '@mui/material';
import Link from 'next/link';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Tag from '@mui/icons-material/Tag';
import styles from '../styles/item.module.css';
import { isoDateToDaily, isoDateToMonth } from '@/utilities/fomat';
import { ReactNode } from 'react';

interface itemStatusProps {
    date?: string;
    id?: string;
    username?: string;
    userid: string;
    text?: string;
    action?: string;
    collection?: string;
    hidden?: boolean;
    tag?: string;
    value?: string
  }
  
export default function ItemStatus(props:itemStatusProps):JSX.Element {
  const { date = '', id = '', username = '', userid = '', text = '', value = '', action = 'comment', hidden, collection, tag } = props;

  const statusAction  = (type:string) => {
    let verb = 'comments';
    switch(type) {
      case 'score':
        verb = 'distributes'
        break;
      case 'tally':
        verb = 'recognises'
        break;
      case 'rank':
        verb = 'ranks'
        break;
    }
    return verb;
  }

  const statusText = (type:string) => {
    let msg = text;
    switch(type) {
      case 'score':
        msg = `[${value}] points for`
        break;
      case 'tally':
        msg = 'your efforts in'
        break;
      case 'rank':
        msg = `[Class ${value}] in`
        break;
    }
    return msg;
  }

  const status:ReactNode = (
    <>
      <div className={styles.statusLine} data-augmented-ui="tr-clip inlay">
        <Box>
          <Stack direction="row"
            spacing={1}
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography>
              <span className={styles.name}>{username} ({userid})</span>  <span className={styles.action}>{statusAction(action)}</span> 》
              <span className={styles.comment}>{statusText(action)}</span> {tag && <Chip icon={<Tag />} component="span" label={tag} className={styles.hashtag} />}
            </Typography>
            {collection && (<MoreVertIcon />)}
          </Stack>
        </Box>
      </div><Stack direction="row" spacing={1} alignItems="flex-end" justifyContent="flex-end">
        <Box sx={{ minWidth: '50%', maxWidth: '79%' }}>
          <Stack direction="row" spacing={1}>
            <div>{hidden && <VisibilityOffIcon sx={{ fontSize: 16, opacity: 0.25 }} />}</div>
            <div className={styles.dateLine} data-augmented-ui="br-clip both">
              <Stack direction="row" spacing={1}>
                <div className={styles.dateText}>{isoDateToDaily(date)}</div>
                <div className={styles.dateText}><span>{isoDateToMonth(date)}</span></div>
              </Stack>
            </div>
          </Stack>
        </Box>
      </Stack>
    </>
  );


  return (
    <Box style={{padding: '1vh 0', width: '100%'}}>
      {collection ? (<Link href={`/${collection}/${id}`}>{status}</Link>) : status}
    </Box>
  )
}