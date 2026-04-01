'use client';
import { QRCodeSVG } from 'qrcode.react';
import { useContext } from 'react';
import { Avatar, Box, Divider, Typography, useMediaQuery } from '@mui/material';
import { Context as NnContext } from '../components/context/nnContext';
import { NnProviderValues } from '../components/context/nnTypes';
import { apiUrl } from '../utilities/constants';

interface MyQRCodeProps {
  value?: string;
}

export default function MyQRCode(props: MyQRCodeProps): JSX.Element {
  const { state }: NnProviderValues = useContext(NnContext);
  const isPortrait = useMediaQuery('(orientation: portrait)');

  const accountId = state?.network?.selected?.account || '';
  const value = props?.value || accountId;
  const thumbnailUrl = accountId
    ? `${apiUrl.protocol}://${apiUrl.hostname}/api/image/${accountId}/thumbnail`
    : '';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2vmin' }}>
      <QRCodeSVG
        value={value || 'Meat Popsicle'}
        size={500}
        includeMargin={false}
        style={{ width: 'min(80vw, 55vh)', height: 'auto', display: 'block' }}
      />
      {isPortrait && (
        <>
          <Divider sx={{ width: 'min(80vw, 55vh)', borderColor: 'rgba(0,0,0,0.2)', my: 1.5 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, maxWidth: 'min(80vw, 55vh)' }}>
            <Avatar
              src={thumbnailUrl}
              sx={{ width: 48, height: 48, flexShrink: 0, backgroundColor: 'var(--color-3)' }}
            />
            <Typography sx={{ fontFamily: 'monospace', fontSize: '1.5rem', color: 'rgba(0,0,0,0.75)', wordBreak: 'break-all' }}>
              {accountId}
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
}
