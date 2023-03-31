import StatusAdminApp from "@/components/statusAdminApp";

export default function Status({
  params,
}: {
  params: { id: string };
}) {
  return (<StatusAdminApp params={params} />);
}