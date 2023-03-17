import { useState } from 'react';
import { 
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import styles from '../styles/generic.module.css';

type RequestButton = {
  icon?: React.ReactNode;
  value?: string;
  label?: string;
}

interface ToggleButtonsProps {
  defaultButton?: string;
  handleAction?: Function;
  requests?: RequestButton[];
}

export default function ToggleButtons(props:ToggleButtonsProps):JSX.Element {
  const { defaultButton, handleAction, requests = [] } = props;

  const [ requestTypeValue, setRequestTypeValue ] = useState(defaultButton || requests[0].value || '');

  const handleRequestToggle = (event: React.MouseEvent<HTMLElement>, request: string) => {
    setRequestTypeValue(request);
    handleAction && handleAction(request)
  }

  return (
    <div
      className={styles.togglePanel}
      data-augmented-ui="inlay"
    >
      <ToggleButtonGroup
        color="primary"
        exclusive
        aria-label="Request Actions"
        sx={{width: '100%'}}
        onChange={handleRequestToggle}
      >
        {requests.length >= 1 && requests.map( request => {
          return (
            <ToggleButton 
              value={request.value || ''}
              selected={requestTypeValue == request.value}
              sx={{width: `${100 / requests.length}%`}}
              key={`request_${request.value}`}
            >
              <Typography variant='h6'>{request.label || ''}</Typography>
              <span style={{marginLeft: '10px', height: '24px'}}>
                {request.icon ? request.icon : <SportsSoccerIcon />}
              </span>
            </ToggleButton>
          )}
        )}
      </ToggleButtonGroup>
    </div>
  )
}