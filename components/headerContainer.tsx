import { AppBar, Container, IconButton } from '@mui/material';
import Logo from './svgr/logo';

interface PageContainerProps {
  children?: React.ReactNode;
}

export default function HeaderContainer(props:PageContainerProps):JSX.Element {
  const { children } = props;
  return (
    <AppBar>
      <Container>
        <IconButton>
            <Logo sx={{ fontSize: 40 }} />
        </IconButton>
        {children}
      </Container>
    </AppBar>
  )
}