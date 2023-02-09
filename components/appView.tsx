import { 
    Container,
} from '@mui/material';
import styles from '../styles/generic.module.css';

interface AppViewProps {
    children?: React.ReactNode;
}

export default function AppView(props:AppViewProps):JSX.Element {
    const { children } = props;

    return (
        <Container disableGutters sx={{marginTop: '74px'}}>
            <div
                className={styles.darkPane}
                data-augmented-ui="tl-clip-x tr-rect br-clip bl-clip both"
                style={{
                    minHeight: 'calc(100vh - 84px)'
                }}
            >
                {children}
            </div>
        </Container>
    )
}