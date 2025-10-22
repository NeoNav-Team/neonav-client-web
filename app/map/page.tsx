import dynamic from 'next/dynamic';

const MapApp = dynamic(() => import('@/components/mapApp'), {
  ssr: false,
  loading: () => <div>Loading map...</div>
});

export default function Map() {
  return (<MapApp />);
}