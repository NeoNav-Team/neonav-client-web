import CashHistoryApp from '@/components/cashHistoryApp';

export default function CashHistory({ params }: { params: { id: string } }) {
  return (<CashHistoryApp id={params.id} />);
}