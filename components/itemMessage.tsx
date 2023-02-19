
import { 
    Box,
    Stack,
    Typography
} from '@mui/material';
import styles from '../styles/item.module.css';
import { isoDateToDaily, isoDateToMonth, isoDateToOrbit } from '@/utilites/fomat';

interface itemTransactionProps {
    date?: string;
    id?: string;
    username?: string;
    text?: string;
  }
  
  export default function ItemTransaction(props:itemTransactionProps):JSX.Element {
    const { date, id, username, text } = props;
    const safeDate = date || '';
    console.log('date', date);
  
    return (
        <Box>
            <div className={styles.dateLine} data-augmented-ui="tr-clip both">
                <Stack direction="row" spacing={1}>
                <Typography className={styles.dateText}>{isoDateToDaily(safeDate)}</Typography>
                <Typography className={styles.dateText}><span>✦ {isoDateToMonth(safeDate)}</span></Typography>
                <Typography className={styles.dateText}><span>❂ {isoDateToOrbit(safeDate)}</span></Typography>
                </Stack>
            </div>
            <div className={styles.transactionLine} data-augmented-ui="tr-clip br-round bl-round inlay">
                <Stack
                    direction="row"
                    justifyContent="space-around"
                    alignItems="center"
                    spacing={0}
                >
                <Box sx={{minWidth:'45%'}}>
                    <Typography className={styles.idText}>{id}</Typography>
                    <Typography className={styles.userText}>{username}</Typography>
                </Box>
                <Box sx={{minWidth:'55%'}}>
                    <Typography>{text}</Typography>
                </Box>
                </Stack>
            </div>
        </Box>
    )
  }