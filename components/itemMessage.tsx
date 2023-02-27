
import { 
    Box,
    Stack,
    Typography
} from '@mui/material';
import { isoDateToDaily, isoDateToMonth, isoDateToOrbit } from '@/utilites/fomat';

interface itemTransactionProps {
    date?: string;
    id?: string;
    username?: string;
    text?: string;
  }
  
  export default function ItemTransaction(props:itemTransactionProps):JSX.Element {
    const { date = '', id = '', username = '', text = '' } = props;
    const isSystemMsg = (id:string, username:string) => {
        return id === '0000000000' && username === 'tan/chat';
    }
  
    return (
        <Box style={{padding: '1vh 0'}}>
                <Stack direction="row" spacing={1} alignItems="flex-end">
                <Box sx={{minWidth:'40%', maxWidth: '40%'}}>
                <div data-augmented-ui="tr-clip tr-rect both">
                    <Typography>{id}</Typography>
                    <Typography>{username}</Typography>
                </div>
                </Box>
                <Box sx={{minWidth:'45%', maxWidth: '59%'}}>
                <div data-augmented-ui="tr-clip both">
                    <Stack direction="row" spacing={1}>
                        <Typography>{isoDateToDaily(date)}</Typography>
                        <Typography><span>✦ {isoDateToMonth(date)}</span></Typography>
                        <Typography><span>❂ {isoDateToOrbit(date)}</span></Typography>
                    </Stack>
                </div>
                </Box>
            </Stack>
            <div data-augmented-ui="tr-clip br-round bl-round inlay">
                <Box>
                    <Typography> 》 {text}</Typography>
                </Box>
            </div>
        </Box>
    )
  }