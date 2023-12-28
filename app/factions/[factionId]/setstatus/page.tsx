import FactionSetStatusApp from '@/components/factionSetStatusApp';

export default function FactionProfile({
  params,
}: {
  params: { factionId: string };
}) {
  return (<FactionSetStatusApp params={params} />);
}