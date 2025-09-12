import GameHeader from '../GameHeader';

export default function GameHeaderExample() {
  return (
    <GameHeader 
      showAdvanceWeek={true} 
      onAdvanceWeek={() => console.log('Advance week clicked')}
      onMenuToggle={() => console.log('Menu toggled')}
    />
  );
}