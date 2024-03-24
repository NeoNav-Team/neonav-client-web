
import { 
  Grid,
  Typography
} from '@mui/material';
import styles from '../styles/generic.module.css';

interface InputBalanceProps {
  balance?: number | null;
  children?: React.ReactNode;
  label?: string;
}

export default function InputBalance(props:InputBalanceProps):JSX.Element {
  const { balance, label = 'BALANCE' } = props;

  return (
    <div
      className={styles.presentValue}
      data-augmented-ui="tl-clip-x tr-rect br-clip bl-clip both"
      style={{padding: '2vh'}}
    >
      <Typography variant='h4' sx={{
        color:'var(--color-0)',
        filter: 'drop-shadow(var(--color-0) 0px 0px 5px)',
        position: 'absolute',
        opacity: '0.5',
        fontSize: { xs: '1rem', sm: '1.5rem', md: '2.125rem' }
      }}>
        {label}
      </Typography>
      <Grid
        container
        direction="row"
        justifyContent="flex-end"
        alignItems="baseline"
      >
        <Grid>
          <Typography
            variant='h2' sx={{ fontSize: { xs: '2.5rem', sm: '3rem', md: '3.75rem' }}}>
                    &nbsp;{balance}
          </Typography>
        </Grid>
        <Grid>
          <Typography variant='h4' sx={{
            color:'var(--color-0)',
            filter: 'drop-shadow(var(--color-0) 0px 0px 5px)',
            letterSpacing: { xs: '-0.121rem', sm: '-0.25rem', md: '-0.33rem' },
            fontSize: { xs: '1rem', sm: '1.5rem', md: '2.125rem' }
          }}>c±sн</Typography>
        </Grid>
      </Grid>
    </div>
  )
}