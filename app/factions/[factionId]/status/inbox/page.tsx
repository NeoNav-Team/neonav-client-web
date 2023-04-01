import StatusesApp from "@/components/statusesApp";

export default function Status({
  params,
}: {
  params: { factionId?: string };
}) {
  return (<StatusesApp params={{...params, outbound: false}} />);
}