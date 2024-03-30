import {QrScanner} from '@yudiel/react-qr-scanner';

interface QrCodeReaderProps {
  successHandler?: (id: string) => void;
  children?: React.ReactNode;
}

export default function QrCodeReader(props: QrCodeReaderProps): JSX.Element {
  const { successHandler, children } = props;

  const onSuccess = (result:any) => {
    console.log('result', result);
    if (result.match(/^[0-9a-zA-Z]{1}[0-9]{9}$/g)) {
      successHandler && successHandler(result);
    }
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