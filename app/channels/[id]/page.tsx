import ChannelAdminApp from "@/components/channelAdminApp";

export default function ChannelAdmin({
  params,
}: {
  params: { id: string };
}) {
  return (<ChannelAdminApp params={params}/>);
}