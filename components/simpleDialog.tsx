import { memo, useState, useRef } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from '@mui/material';

interface SimpleDialogProps {
  dialog?: string;
  open: boolean;
  handleAction?: Function;
  useInput?: boolean;
  handleClose: Function;
}

function SimpleDialog(props:SimpleDialogProps):JSX.Element {
  const { dialog, handleAction, handleClose, open, useInput } = props;
  const [err, setErr] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const valueRef = useRef<any>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    !isDirty && setIsDirty(true);
    err && setErr(false);
  }

  const goHandleClose = () => {
    handleClose();
  }
  
  const handleYes = () => {
    handleAction && handleAction();
    handleClose();
  } 

  const handleconfirm = () => {
    if (!isDirty) {
      setErr(true);
    } else {
      handleAction && handleAction(valueRef?.current?.value);
    }
  }

  return (
    <Dialog
      open={open || false}
      onClose={goHandleClose}
    >
      <DialogContent>
        <DialogContentText>
          {dialog}
        </DialogContentText>
        <div>
          {useInput && (
            <TextField autoFocus fullWidth inputRef={valueRef} error={err} onChange={handleChange} />
          )}
        </div>
      </DialogContent>
      <DialogActions>
        {!useInput ? (
          <>
            <Button onClick={goHandleClose} variant="outlined" color="primary">No</Button>
            <Button onClick={handleYes}  variant="outlined" color="primary" autoFocus>Yes</Button>
          </>
        ) : (
          <Button onClick={handleconfirm} disabled={!isDirty} variant="outlined" color="primary" autoFocus>Confirm</Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default memo(SimpleDialog);
