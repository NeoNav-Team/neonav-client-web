
import { Container } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';

interface ContainerProps {
  children?: React.ReactNode;
  nextHandler?: Function;
}

export default function InfiniteScrollContainer(props:ContainerProps):JSX.Element {
  const { children, nextHandler } = props;

  const handleNext = ()=> {
    console.log('handling next...');
    nextHandler && nextHandler();
  }

  return (
    <>
        <Container
            disableGutters
            sx={{
                overflow: 'auto',
                padding: '2vh',
                height: '100%',
                maxHeight: 'calc(100% - 200px)',
                display: 'flex',
                flexDirection: 'column-reverse',
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
            <InfiniteScroll
              dataLength={30}
              next={handleNext}
              style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
              inverse={true}
              hasMore={true}
              loader={<h4>Loading...</h4>}
              scrollableTarget="scrollableDiv"
            >
              {children}
            </InfiniteScroll>
        </Container>
    </>
  )
}