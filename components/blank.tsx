
interface BlankProps {
  children?: React.ReactNode;
}

export default function Blank(props:BlankProps):JSX.Element {
  const { children } = props;

  return (
    <>
        {children}
    </>
  )
}