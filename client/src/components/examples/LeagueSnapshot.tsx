import LeagueSnapshot from '../LeagueSnapshot';

export default function LeagueSnapshotExample() {
  // todo: remove mock functionality
  const standings = [
    { name: "Central High", wins: 12, losses: 2, streak: "W3", color: "#7A5BFF" },
    { name: "Westside Prep", wins: 11, losses: 3, streak: "W1", color: "#38E1C6" },
    { name: "Riverside Academy", wins: 10, losses: 4, streak: "L1", color: "#FF6B35" },
  ];

  const schedule = [
    { homeTeam: "Central High", awayTeam: "Oak Valley", week: 15 },
    { homeTeam: "Westside Prep", awayTeam: "Pine Ridge", week: 15 },
    { homeTeam: "Riverside Academy", awayTeam: "Mountain View", week: 16 },
  ];

  return (
    <LeagueSnapshot 
      standings={standings}
      schedule={schedule}
      onViewFull={(tab) => console.log(`View full ${tab}`)}
    />
  );
}