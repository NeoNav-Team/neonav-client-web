import ChannelDetailApp from "@/components/channelDetailApp";

export default function ContactDetail({
  params,
}: {
  params: { id: string };
}) {
  return (<ChannelDetailApp params={params}/>);
}