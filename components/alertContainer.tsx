import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';



interface AlertContainerProps {
    children?: React.ReactNode;
  }
  
export default function AlertContainer(props:AlertContainerProps):JSX.Element {
  const { children } = props;
  const alert = {show: false, severity: '', message:''};


  const handleAlertClose = () => {};
  
  return (
    <>
      <Snackbar
        open={alert?.show}
        onClose={handleAlertClose}
        autoHideDuration={2500}
        style={{
          bottom: '15vh',
          filter: 'drop-shadow(rgb(255, 255, 255) 0px 0px 4px)'
        }}
      >
        <Alert 
          severity={alert?.severity === 'error' ? 'error' : 'success'}
          variant="outlined"
        >
          {alert?.message}
        </Alert>
      </Snackbar>
      {children}
    </>
  )
}