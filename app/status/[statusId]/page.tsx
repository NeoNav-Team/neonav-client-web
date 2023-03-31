import StatusAdminApp from "@/components/statusAdminApp";

export default function Status({
  params,
}: {
  params: { statusId: string };
}) {
  return (<StatusAdminApp params={params} />);
}