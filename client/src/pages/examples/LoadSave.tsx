import LoadSave from '../LoadSave';

export default function LoadSaveExample() {
  return (
    <LoadSave 
      onLoadSlot={(id) => console.log(`Load slot ${id}`)}
      onNewGame={() => console.log('Start new game')}
      onDeleteSlot={(id) => console.log(`Delete slot ${id}`)}
    />
  );
}