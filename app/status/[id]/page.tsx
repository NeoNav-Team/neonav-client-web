import StatusAdminApp from "@/components/statusAdminApp";

export default function Notifications({
  params,
}: {
  params: { id: string };
}) {
  return (<StatusAdminApp params={params} />);
}