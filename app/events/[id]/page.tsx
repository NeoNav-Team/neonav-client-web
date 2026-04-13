import EventsApp from '@/components/eventsApp';

export default function EventsLocation({
  params,
}: {
  params: { id: string };
}) {
  return (<EventsApp initialLocationId={params.id} />);
}
