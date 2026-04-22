'use client';
import { Box, Stack, Typography } from '@mui/material';
import QrCodeIcon from '@mui/icons-material/QrCode';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Map from './svgr/map';
import TanChat from './svgr/tanchat';
import Cash from './svgr/cash';
import NeoSites from './svgr/neosites';
import ButtonHexFab from './buttonHexFab';
import { HOTBAR_OPTIONS, HotbarKey } from '../utilities/hotbarOptions';

const ICON_MAP: Record<HotbarKey, JSX.Element> = {
  tanchat:   <TanChat />,
  cash:      <Cash />,
  channels:  <RoomPreferencesIcon />,
  map:       <Map />,
  sites:     <NeoSites />,
  garden:    <LocalFloristIcon />,
  events:    <CalendarMonthIcon />,
  qrScanner: <QrCodeScannerIcon />,
  myQRCode:  <QrCodeIcon />,
};

interface HotbarProps {
  keys: HotbarKey[];
  onAction: (action: string) => void;
}

const labelStyle = {
  fontFamily: 'Jura',
  fontSize: '0.65rem',
  letterSpacing: '0.05rem',
  mt: 0.5,
};

export default function Hotbar({ keys, onAction }: HotbarProps): JSX.Element {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: 'rgba(18, 4, 88, 0.92)',
        borderTop: '1px solid rgba(67, 199, 255, 0.35)',
        backdropFilter: 'blur(6px)',
        paddingBottom: 'calc(8px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      <Stack direction="row" justifyContent="space-around" alignItems="center" sx={{ pt: 1 }}>
        {keys.map((key) => {
          const option = HOTBAR_OPTIONS[key];
          return (
            <Box key={key} sx={{ textAlign: 'center' }}>
              <ButtonHexFab
                size="medium"
                icon={ICON_MAP[key]}
                handleAction={() => onAction(option.action)}
              />
              <Typography sx={labelStyle}>{option.label}</Typography>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
