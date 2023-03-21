import ChatApp from "@/components/chatApp";

export default function Chats({
  params,
}: {
  params: { id: string };
}) {
  return (<ChatApp msgBtn={true} params={params}/>);
}