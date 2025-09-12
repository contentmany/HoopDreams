import MainMenu from '../MainMenu';

export default function MainMenuExample() {
  return <MainMenu onNavigate={(path) => console.log(`Navigate to: ${path}`)} />;
}