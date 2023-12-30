import {QrScanner} from '@yudiel/react-qr-scanner';

interface QrCodeReaderProps {
  successHandler?: (id: string) => void;
  children?: React.ReactNode;
}

export default function QrCodeReader(props: QrCodeReaderProps): JSX.Element {
  const { successHandler, children } = props;

  const onSuccess = (result:any) => {
    let cleanId = result?.replace(/[^0-9]+/g, '') || '';
    successHandler && successHandler(cleanId);
  }

  const onError = (error:any) => {
    console.log(error?.message);
    successHandler && successHandler('');
  }

  return (
    <>
      <QrScanner
        onDecode={result => onSuccess(result)}
        onError={error => onError(error)}
      />
      {children}
    </>
  )
}