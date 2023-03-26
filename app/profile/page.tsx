import UserProfileApp from '@/components/userProfileApp';

export default function Garden({
  params,
}: {
  params: { id: string };
}) {
  return (<UserProfileApp />);
}