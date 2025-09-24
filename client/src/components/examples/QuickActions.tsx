import QuickActions from '../QuickActions';

export default function QuickActionsExample() {
  return (
    <QuickActions onAction={(path) => console.log(`Navigate to: ${path}`)} />
  );
}