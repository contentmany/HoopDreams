import Dashboard from '../Dashboard';

export default function DashboardExample() {
  return <Dashboard onNavigate={(path) => console.log(`Navigate to: ${path}`)} />;
}