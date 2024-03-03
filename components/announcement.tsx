import { useContext, useEffect, useMemo, useState } from 'react';
import isEmpty from '@/utilities/isEmpty';
import { Context as NnContext } from './context/nnContext';
import { NnProviderValues, LooseObject } from './context/nnTypes';
import ItemMessage from './itemMessage';
import styles from '../styles/item.module.css';
import { Box, Modal } from '@mui/material';

interface AnnouncementProps {
    children?: React.ReactNode;
  }
  
export default function Announcement(props:AnnouncementProps):JSX.Element {
  const { children } = props;
  const { 
    state,
    closeAnnouncement = () => {},
  }: NnProviderValues = useContext(NnContext);
  const announcement:LooseObject = useMemo(() => {
    return state?.network?.announcement || {};
  }, [state]);
  const [open, setOpen] = useState(false);

  const handleModalClose = (event: React.SyntheticEvent | Event) => {
    closeAnnouncement();
  };

  useEffect(() => {
    setOpen(!isEmpty(announcement))
  }, [announcement, open, setOpen]);
  
  return (
    <>
      <Modal
        open={open}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={styles.announcementBox}>
          {announcement && (
            <ItemMessage
              key={announcement.ts}
              date={announcement.ts}
              text={announcement.text}
              username={announcement.from}
              id={''}
            />)}
        </Box>
      </Modal>
      {children}
    </>
  )
}