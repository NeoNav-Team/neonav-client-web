
import { 
  Box,
  Stack,
  Typography
} from '@mui/material';
import Link from 'next/link';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import styles from '../styles/item.module.css';

interface itemContactProps {
    id?: string;
    username?: string;
    subtitle?: string;
  }
  
export default function ItemContact(props:itemContactProps):JSX.Element {
  const {id = '', username = '', subtitle } = props;
  
  return (
    <Box style={{padding: '4px 0', width: '100%'}}>
      {subtitle ? (
        <div 
          className={styles.subtitleLine}
          data-augmented-ui="tr-clip both"
        >
          <Typography variant='h5'>{subtitle}</Typography>
        </div>
      ) : (
        <Link href={`/contacts/${id}`}>
          <div 
            className={styles.transactionLine}
            data-augmented-ui="tr-clip br-round bl-round inlay"
          >
            <Box>
              <Stack direction="row"
                spacing={1}
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant='h6' sx={{whiteSpace:'nowrap', overflow:'hidden', textOverflow: 'ellipsis'}}>
                  <span className={styles.name}>{username}</span>
                  <span className={styles.id}> | {id}</span>
                </Typography>
                <MoreVertIcon />
              </Stack>
            </Box>
          </div>
        </Link>
      )}
    </Box>
  )
}