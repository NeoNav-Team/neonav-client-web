import { 
  Box,
  Typography,
  Avatar,
  Stack,
} from '@mui/material';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import styles from '../styles/item.module.css';


interface subheaderEntityProps {
  title?: string;
  cover?: string;
  photo?: string;
  subtitle?: string;
}

export default function SubheaderFaction(props:subheaderEntityProps):JSX.Element {
  const { photo, cover, title, subtitle} = props;

  return (
    <div 
      className={styles.subtitleLine}
      data-augmented-ui="tr-clip br-clip-x both"
    >
      <Box sx={{background: cover}}> 
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          spacing={1}
        >
          <Box>
            <Avatar src={photo} variant="rounded" sx={{width: 150, height: 150, margin: '4px'}} >
              <SupervisedUserCircleIcon sx={{width: 150, height: 150, backgroundColor: 'var(--color-2)'}} color="primary" />
            </Avatar>
          </Box>
          <Box
          >  <Stack spacing={1}>
              <Typography variant="h2" sx={{fontSize: {xs: 24, md: 32, xl: 64}, textIndent: 0}}>{title}</Typography>
              <Typography variant="h3" sx={{fontSize: {xs: 16, md: 20, xl: 24}, textIndent: 0}}>{subtitle} </Typography>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </div>
  )
}