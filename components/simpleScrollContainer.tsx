
import { Container } from '@mui/material';

interface ContainerProps {
  children?: React.ReactNode;
}

export default function SimpleScrollContainer(props:ContainerProps):JSX.Element {
  const { children } = props;

  return (
    <Container
      disableGutters
      id="simpleScoll"
      sx={{
        overflow: 'auto',
        display: 'flex',
        padding: '2vh',
        width: '100%',
        maxHeight: '100%',
        maxWidth: '100%',
        overflowX: 'hidden',
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '0.69em'
        },
        '&::-webkit-scrollbar-track': {
          boxShadow: 'inset 0 0 6px var(--color-2)',
          webkitBoxShadow: 'inset 0 0 6px var(--color-0)'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'var(--color-2)',
          outline: '1px solid var(--color-1)'
        }
      }}
    >
      {children}
    </Container>
  )
}