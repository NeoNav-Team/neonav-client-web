import SecurityApp from "@/components/userSecurityApp";

export default function Security({
  params,
}: {
  params: { id: string };
}) {
  return (<SecurityApp />);
}