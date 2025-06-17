import ChatAppJoin from "@/components/chatAppJoin";

export default function Chats({
  params,
}: {
  params: { id: string };
}) {
  return (<ChatAppJoin params={params}/>);
}