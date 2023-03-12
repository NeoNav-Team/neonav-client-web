import { useContext } from 'react';
import { Context as NnContext } from './context/nnContext';
import { NnProviderValues } from './context/nnTypes';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

interface AlertsProps {
    children?: React.ReactNode;
  }
  
export default function Alerts(props:AlertsProps):JSX.Element {
  const { children } = props;
  const { 
    state,
    closeAlert = () => {},
  }: NnProviderValues = useContext(NnContext);
  const alert = state?.network?.alert;

  const handleAlertClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    closeAlert();
  };

  
  return (
    <>
      {/* mid page alerts for success / error */}
      <Snackbar
        open={alert?.show}
        onClose={handleAlertClose}
        autoHideDuration={2500}
        style={{
          bottom: '50%',
          filter: 'drop-shadow(rgb(255, 255, 255) 0px 0px 4px)',
          background: 'rgba(255,255,255, .125)',
          maxWidth: '300px',
        }}
      >
        <Alert 
          severity={alert?.severity === 'error' ? 'error' : 'success'}
          variant="outlined"
          sx={{width: '100%'}}
        >
          {alert?.message}
        </Alert>
      </Snackbar>
      {children}
    </>
  )
}