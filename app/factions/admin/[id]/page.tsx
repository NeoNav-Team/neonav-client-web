import FactionAdminApp from "@/components/factionAdminApp";

export default function FactionAdmin({
  params,
}: {
  params: { id: string };
}) {
  return (<FactionAdminApp params={params}/>);
}