/* eslint-disable indent */

import { 
  Avatar,
  Badge,
  Box,
  Stack,
  Typography
} from '@mui/material';
import Link from 'next/link';
import ChatIcon from '@mui/icons-material/Chat';
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences';
import ThreePIcon from '@mui/icons-material/ThreeP';
import BadgeIcon from '@mui/icons-material/Badge';
import Groups3Icon from '@mui/icons-material/Groups3';
import styles from '../styles/item.module.css';

interface itemContactProps {
    id?: string;
    username?: string;
    subtitle?: string;
    collection?: string;
    thumbnail?: string;
    unread?: number;
  }
  
export default function ItemContact(props:itemContactProps):JSX.Element {
  const {
    id = '',
    username = '',
    collection = 'contacts',
    unread = null,
    subtitle,
    thumbnail 
  } = props;
  
  const personIcon = (collectionType:string) => {
    let icon = <ThreePIcon />;
    switch (collectionType) {
      case  'contacts':
        icon = <BadgeIcon />;
        break;
      case  'factions':
        icon = <Groups3Icon />;
        break;
      case  'channels/admin':
        icon = <RoomPreferencesIcon />;
        break;
      default:
        break;
    }
    return icon;
  }
  
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
        <Link href={`/${collection}/${id}`}>
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
                <Stack direction="row" spacing={1} alignItems="center" style={{maxWidth: '80%'}}>
                  <Avatar src={thumbnail} sx={{width: 24, height: 24, fontSize: 12, backgroundColor:'var(--color-3)'}}>{username[0]}</Avatar>
                  <Typography variant='h6' sx={{whiteSpace:'nowrap', overflow:'hidden', textOverflow: 'ellipsis'}}>
                    <span className={styles.name}>{username}</span>
                    <span className={styles.id}> | {id}</span>
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="right" style={{maxWidth: '20%'}}>
                {personIcon(collection)}
                <Badge
                  badgeContent={unread}
                  color="secondary"
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                >
                  {id.length !== 10 && (
                    <Link href={`/chat/${id}`}>
                      <ChatIcon />
                    </Link>
                  )}
                </Badge> 
                </Stack>
              </Stack>
            </Box>
          </div>
        </Link>
      )}
    </Box>
  )
}