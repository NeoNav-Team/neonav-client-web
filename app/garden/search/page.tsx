import GardenSearchApp from '@/components/gardenSearchApp';

export default function Garden({
  params,
}: {
  params: { id: string };
}) {
  return (<GardenSearchApp />);
}