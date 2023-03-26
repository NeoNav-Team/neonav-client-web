import GardenApp from '@/components/gardenApp';

export default function Garden({
  params,
}: {
  params: { id: string };
}) {
  return (<GardenApp incoming={false} params={params} />);
}