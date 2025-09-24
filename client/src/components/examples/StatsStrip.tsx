import StatsStrip from '../StatsStrip';

export default function StatsStripExample() {
  const stats = [
    { label: "Energy", current: 8, max: 10 },
    { label: "Mood", current: 7, max: 10 },
    { label: "Clout", current: 25, max: 100 },
    { label: "Chemistry", current: 65, max: 100 },
    { label: "Health", current: 100, max: 100 },
    { label: "Reputation", current: 15, max: 100 },
  ];

  return <StatsStrip stats={stats} />;
}