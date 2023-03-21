import { 
  Typography,
  Box,
  Stack,
  TextField
} from '@mui/material';
import styles from '../styles/generic.module.css';

interface InputMessageProps {
  value?: string | null;
  disabled?: boolean;
  changeHandler: Function;
  submitHandler: Function;
}

export default function InputMessage(props:InputMessageProps):JSX.Element {
  const { disabled, value, changeHandler, submitHandler } = props;

  return (
    <div
      className={styles.presentValue}
      data-augmented-ui="tl-clip-x tr-rect br-clip bl-clip both"
      style={{padding: '1vh', minWidth: '100%'}}
    >
      <Stack
        direction="row"
        justifyContent="left"
        alignItems="flex-start"
        spacing={1}
      >
        <Box>
          <Typography
            variant='h2' sx={{ fontSize: { xs: '2.5rem', sm: '3rem', md: '3.75rem' }}}>
                ⇴&nbsp;
          </Typography>
        </Box>
        <Box  sx={{minWidth: '100%'}}>
          <form
            onSubmit={event => submitHandler(event)}
            autoComplete="off"
          >
            <TextField
              onChange={event => changeHandler(event)}
              value={value}
              disabled={disabled}
              sx={{minWidth: '85%'}}
              placeholder="type message here"
              inputProps={{
                autoComplete: "chrome-off",
              }}
            />
            <input type="submit" disabled={disabled} style={{'visibility':'hidden', 'position':'absolute'}}/>
          </form>
        </Box>
      </Stack>
    </div>
  )
}