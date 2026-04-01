export type HotbarKey = 'tanchat' | 'cash' | 'channels' | 'map' | 'sites' | 'garden' | 'qrScanner' | 'myQRCode';

export interface HotbarOption {
  label: string;
  action: string; // route (starts with '/') or modal name
}

export const HOTBAR_OPTIONS: Record<HotbarKey, HotbarOption> = {
  tanchat:   { label: 'Tan / Chat',      action: '/chat' },
  cash:      { label: 'Credits',         action: '/cash' },
  channels:  { label: 'Channels',        action: '/channels' },
  map:       { label: 'Map',             action: '/map' },
  sites:     { label: 'NeoSites',        action: '/sites' },
  garden:    { label: 'Jaden / Garden',  action: '/garden' },
  qrScanner: { label: 'QR Scanner',      action: 'qrCodeScan' },
  myQRCode:  { label: 'My QR Code',      action: 'myQRCode' },
};

export const DEFAULT_HOTBAR: HotbarKey[] = ['map', 'myQRCode', 'qrScanner'];
