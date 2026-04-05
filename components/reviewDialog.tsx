import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slider,
  TextField,
} from '@mui/material';
import {useRef, useState} from "react";
import { fetchLocationById } from './context/nnActionsLocation';

export interface ReviewDialogProps {
  id: string,
  open: boolean,
  handleClose: Function,
  addLocationReview: Function,
}

export default function ReviewDialog(props:ReviewDialogProps):JSX.Element {
  const {id, open, handleClose, addLocationReview} = props;

  const [ratingSliderValue, setRatingSliderValue] = useState(5);
  const reviewRef = useRef<any>();

  const handleChange = (event: Event, newValue: number | number[]) => {
    setRatingSliderValue(newValue as number);
  };

  const handleReviewConfirm = () => {
    addLocationReview(id!, {review: reviewRef.current.value, rating: ratingSliderValue});
    handleClose();
  };

  return (
    <Dialog
      open={open} 
      PaperProps={{
        sx: {
          width: "50%",      // Set a specific width
          minHeight: "25dvh"     // Set a specific height
        }
      }}>
      <DialogTitle>
        Leave a Review!
      </DialogTitle>
      <DialogContent sx={{ overflow: 'visible', pt: 4 }}>
        <Slider
          aria-label="Rating"
          valueLabelDisplay="auto"
          value={ratingSliderValue} 
          onChange={handleChange}
          min={0.1}
          max={10}
          step={0.1}
        />
        <TextField autoFocus fullWidth multiline inputRef={reviewRef} minRows={3} />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose()} variant="outlined" color="primary" autoFocus>Cancel</Button>
        <Button onClick={handleReviewConfirm} variant="outlined" color="primary" autoFocus>Post</Button>
      </DialogActions>
    </Dialog>
  );
}