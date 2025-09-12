import GameCard from '../GameCard';

export default function GameCardExample() {
  return (
    <GameCard 
      opponent="Riverside Academy"
      gameType="Regular Season"
      location="Home"
      energyCost={3}
      onPlayGame={() => console.log('Play game clicked')}
      onScouting={() => console.log('Scouting clicked')}
    />
  );
}