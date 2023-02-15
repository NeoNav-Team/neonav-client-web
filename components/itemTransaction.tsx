
import { 
    Box,
    Typography
} from '@mui/material';
import styles from '../styles/generic.module.css';

interface itemTransactionProps {
    date: string;
    id: string;
    username: string;
    amount: number | string;
  }
  
  export default function ItemTransaction(props:itemTransactionProps):JSX.Element {
    const { date, id, username, amount } = props;
  
    return (
        <Box>
            <div className="pitch-mixin" data-augmented-ui="tr-clip both">
                <Typography>{date}</Typography>
                <Typography>{id}</Typography>
            </div>
            <div className="pitch-mixin" data-augmented-ui="tr-clip br-round bl-round inlay">
                <Typography>{username}</Typography>
                <Typography>{amount}</Typography>
            </div>
        </Box>
        // <div className={styles.item}>
        //     <div className="pitch-mixin" data-augmented-ui="tr-clip both">
        //         <div>{item.from || item.fromid}</div>
        //         <div>{timestamp(item.ts)}</div>
        //     </div>
        //     <div className="pitch-mixin" data-augmented-ui="tr-clip br-round bl-round inlay">
        //     <div>
        //     <div span={11}><div onClick={_.partial(getID, item.user)}>
        //         <div>{item.username || item.user}</div>
        //         <div>{<span>{item.user}</span>}</div>
                
        //     </div></Col>
        //     <div span={2}>💸</div>
        //     <div span={11} style={{textAlign: 'right', textIndent: '2.5vh'}}>
        //         <div>{item.amount}</div>
        //     </div>
        //     </div>
        //     </div>
        // </div>
    )
  }