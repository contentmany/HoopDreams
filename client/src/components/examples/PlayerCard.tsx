import PlayerCard from '../PlayerCard';

export default function PlayerCardExample() {
  return (
    <div className="space-y-4 p-4">
      <PlayerCard 
        firstName="Marcus"
        lastName="Johnson"
        position="PG"
        archetype="Pass First"
        team="Central High"
        teamColor="#7A5BFF"
        ovr={85}
        showStats={true}
      />
      
      <PlayerCard 
        firstName="Tyler"
        lastName="Williams"
        position="SF"
        archetype="3&D"
        team="Westside Prep"
        teamColor="#38E1C6"
        ovr={78}
      />
    </div>
  );
}