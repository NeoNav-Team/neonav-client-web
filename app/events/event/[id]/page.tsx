import EventsApp from '@/components/eventsApp';

export default function EventsEvent({
  params,
}: {
  params: { id: string };
}) {
  return <EventsApp initialEventId={params.id} />;
}
