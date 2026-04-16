import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slider,
  TextField,
  Typography,
} from '@mui/material';
import {useRef, useState, useContext} from 'react';
import { Context as NnContext } from '@/components/context/nnContext';
import { NnProviderValues } from '@/components/context/nnTypes';

export interface ReviewDialogProps {
  id: string,
  open: boolean,
  handleClose: Function,
}

export default function ReviewDialog(props:ReviewDialogProps):JSX.Element {
  const {id, open, handleClose} = props;

  const [ratingSliderValue, setRatingSliderValue] = useState(5);
  const reviewRef = useRef<any>();
  const { 
    addLocationReview = (id: string, review:any) => {},
  }: NnProviderValues = useContext(NnContext);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setRatingSliderValue(newValue as number);
  };

  const handleReviewConfirm = () => {
    addLocationReview(id!, {review: reviewRef.current.value, rating: ratingSliderValue});
    handleClose();
  };

  const marks = [
    {
      value: 0.1,
      label: '0.1'
    },
    {
      value: 5.0,
      label: '5.0'
    },
    {
      value: 10.0,
      label: '10.0'
    },
  ];

  const reviewPrompt = [
    'Is this place preem or just scop?',
    'Drop the deets before you delta.',
    'Gonk-free zone or total flatline?',
    'Gonk-trap or a hidden gem?',
    "What’s the word on the street?",
    'Sensor data received. Please add personal observations.',
    'Optimizing city-wide systems. Rate your interaction.',
    'Is this colony module functional or failing?',
    'Log your transit experience for the next traveler.',
    'Log your findings for the Neotropolis archive.'
  ];

  // Get "random" prompt based on location ID
  const currentPrompt = reviewPrompt[parseInt(id.slice(1)) % reviewPrompt.length];

  return (
    <Dialog
      open={open} 
      PaperProps={{
        sx: {
          width: '80%',
          minHeight: '25dvh'
        }
      }}>
      <DialogTitle>
        Leave a Review!
      </DialogTitle>
      <DialogContent sx={{ overflow: 'visible', pt: 4 }}>
        <Slider
          aria-label='Rating'
          valueLabelDisplay='auto'
          value={ratingSliderValue} 
          onChange={handleChange}
          marks={marks}
          min={0.1}
          max={10}
          step={0.1}
          color='secondary'
        />
        <TextField autoFocus fullWidth multiline inputRef={reviewRef} minRows={3} label={currentPrompt} />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose()} variant='outlined' color='primary' autoFocus>Cancel</Button>
        <Button onClick={handleReviewConfirm} variant='outlined' color='primary' autoFocus>Post</Button>
      </DialogActions>
    </Dialog>
  );
}