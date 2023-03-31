import FactionStatusAdminApp from '@/components/statusAdminApp';

export default function FactionStatusAdmin({
  params,
}: {
  params: { 
    factionId: string
    statusId: string
  };
}) {
  return (<FactionStatusAdminApp params={params} />);
}