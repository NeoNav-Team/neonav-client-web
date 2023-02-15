
import { 
    Box,
    Stack,
    Typography
} from '@mui/material';
import styles from '../styles/item.module.css';
import { isoDateToDaily, isoDateToMonth, isoDateToOrbit } from '@/utilites/fomat';

interface itemTransactionProps {
    date: string;
    id: string;
    username: string;
    amount: number | string;
  }
  
  export default function ItemTransaction(props:itemTransactionProps):JSX.Element {
    const { date, id, username, amount } = props;

    const directionEmoji = (amount: number | string) => {
        const value = parseInt(amount as string, 10) || 0;
        let pay = '';
        if (value >= 100 )  {
            pay = '🤩'
        }
        if (value >= 1000 )  {
            pay = '🤑'
        }
        if (value >= 10000 )  {
            pay = '🤪'
        }
        if (value >= 100000 )  {
            pay = '🫠'
        }
        if (value <= -100) {
            pay = '🥹'
        }
        if (value <= -1000) {
            pay = '😭'
        }
        if (value <= -10000 )  {
            pay = '🤮'
        }
        if (value <= -100000 )  {
            pay = '🤯'
        }
        if (value > 0) {
            return <span>⇢ 💸{pay} ⇢</span>
        } else {
            return <span>⇠ 💸{pay} ⇠</span>
        }
    }
    const profitClass = (amount: number | string) => {
        const value = parseInt(amount as string, 10) || 0;
        return value >= 0 ? styles.gain : styles.loss; 
    }
  
    return (
        <Box>
            <div className={styles.dateLine} data-augmented-ui="tr-clip both">
                <Stack direction="row" spacing={1}>
                <Typography className={styles.dateText}>{isoDateToDaily(date)}</Typography>
                <Typography className={styles.dateText}><span>✦ {isoDateToMonth(date)}</span></Typography>
                <Typography className={styles.dateText}><span>❂ {isoDateToOrbit(date)}</span></Typography>
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
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={1}
                >
                    <Box sx={{maxWidth:'50%'}}>
                        <Typography className={styles.directionText}>{directionEmoji(amount)}</Typography>
                    </Box>
                    <Box sx={{maxWidth:'50%'}}>
                        <Typography className={profitClass(amount)} >{amount}&nbsp;</Typography>
                    </Box>
                </Stack>
                </Box>
                </Stack>
            </div>
        </Box>
    )
  }