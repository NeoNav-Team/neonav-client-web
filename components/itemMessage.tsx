
import { Fragment, useState } from 'react';
import Link from 'next/link';
import { 
  Box,
  Button,
  Stack,
  Typography
} from '@mui/material';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import styles from '../styles/item.module.css';
import { isoDateToDaily, isoDateToMonth } from '@/utilities/fomat';
import { LooseObject } from './context/nnTypes';

const LOCATION_REGEX = /(@L\d{9}\b)/;

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
  const hasButtons = 
    JSON.stringify(buttons).length >= 3 
    && !JSON.stringify(buttons).includes('amount');
  const hasRequest = JSON.stringify(buttons).includes('amount');
  const isSystemMsg = (id:string, username:string) => {
    return id === '0000000000' && username === 'tan/chat';
  }

  const clickHandler = (buttonAction:string) => {
    const actionParams = buttons[buttonAction].split(/[=&]+/);
    actionParams.push(buttonAction);
    dialogCallback && dialogCallback(actionParams);
  }

  const getEnrichedText = ():JSX.Element[] => {
    const textTokens = text.split(LOCATION_REGEX);
    const textElements = textTokens.map(token => {
      const path = "/map/" + token.replace("@", "");
      return (LOCATION_REGEX.test(token)) ? <Link href={path}>{token}</Link> : <Fragment>{token}</Fragment>;
    });
    return  textElements.map((element, index) => <Fragment key={index}> { element } </Fragment>) ;
  }
  
  return (
    <Box style={{padding: '1vh 0', width: '100%'}}>
      <Stack direction="row" spacing={1} alignItems="flex-end">
        <Box sx={{minWidth:'60%', maxWidth: '100%'}}>
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
          <Typography>
            <Link href={`/${id.includes('C') ? 'factions' : 'contacts'}/${id}`}>
              <span className={styles.name}>{username}</span>
            </Link>
             》 {getEnrichedText()}</Typography>
        </Box>
      </div>
      {hasRequest && (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center" 
          justifyContent="flex-end" 
          sx={{minWidth:'100%'}}
        >
          <Button
            size="small"
            variant="outlined"
            color="primary"
            onClick={() => {clickHandler('confirm')}}
            endIcon={<CurrencyExchangeIcon />}>
                View in c±sн
          </Button>
        </Stack>

      )}
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