
import {QRCodeSVG} from 'qrcode.react';
import { useContext, useMemo } from 'react';
import { Context as NnContext } from '../components/context/nnContext';
import { NnProviderValues } from '../components/context/nnTypes';

interface MyQRCodeProps {
  value?: string;
  size: number;
}

export default function MyQRCode(props:MyQRCodeProps):JSX.Element {
  const { 
    state,
  }: NnProviderValues = useContext(NnContext); 

  const userId:string = useMemo(() => {
    return state?.user?.profile?.auth?.userid || 'Meat Popcicle';
  }, [state]);
  const size = props?.size || 500;
  const value = props?.value || userId;

  return (
    <>
      <QRCodeSVG size={size} value={value} width={!size ? '100%' : ''} />
    </>
  )
}