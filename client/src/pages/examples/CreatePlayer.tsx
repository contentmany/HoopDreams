import CreatePlayer from '../CreatePlayer';

export default function CreatePlayerExample() {
  return (
    <CreatePlayer onCreatePlayer={(data) => console.log('Player created:', data)} />
  );
}