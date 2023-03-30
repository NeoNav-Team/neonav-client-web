import FactionSetStatusApp from '@/components/factionSetStatusApp';

export default function FactionProfile({
  params,
}: {
  params: { id: string };
}) {
  return (<FactionSetStatusApp params={params} />);
}