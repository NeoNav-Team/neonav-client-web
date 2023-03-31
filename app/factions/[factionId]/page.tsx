import FactionProfileApp from '@/components/factionProfileApp';

export default function FactionProfile({
  params,
}: {
  params: { 
    factionId: string
 };
}) {
  return (<FactionProfileApp params={params} />);
}