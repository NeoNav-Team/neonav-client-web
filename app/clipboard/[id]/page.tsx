import ContactDetailApp from '@/components/contactDetailApp';

export default function ContactDetail({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  return (<ContactDetailApp params={params}/>);
}