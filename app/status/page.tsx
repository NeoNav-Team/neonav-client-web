import GardenApp from "@/components/gardenApp";

export default function Notifications({
  params,
}: {
  params: { id: string };
}) {
  return (<GardenApp incoming={false} params={params} />);
}