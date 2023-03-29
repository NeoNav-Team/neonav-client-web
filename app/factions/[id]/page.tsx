import FactionProfileApp from '@/components/factionProfileApp';

export default function FactionProfile({
  params,
}: {
  params: { id: string };
}) {
  return (<FactionProfileApp params={params} />);
}