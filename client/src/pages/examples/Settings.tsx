import Settings from '../Settings';

export default function SettingsExample() {
  return (
    <Settings 
      onNavigateToLoad={() => console.log('Navigate to load page')}
      onResetGame={() => console.log('Game reset requested')}
    />
  );
}