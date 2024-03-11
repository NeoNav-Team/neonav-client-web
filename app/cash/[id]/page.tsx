import CashApp from "@/components/cashApp";

export default function Cash({ params }: { params: { id: string } }) {
  return <CashApp id={params.id} />;
}
