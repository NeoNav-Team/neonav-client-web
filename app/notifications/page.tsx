import ChatApp from "@/components/chatApp";

export default function Notifications({
  params,
}: {
  params: { id: string };
}) {
  return (<ChatApp msgBtn={false} notify={true} />);
}