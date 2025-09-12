import { CharacterPreview, CharacterPreviewProps } from './CharacterPreview';

export interface CharacterFullProps extends Omit<CharacterPreviewProps, 'variant'> {
  // Additional props specific to full-body character display
  showTeamNumber?: boolean;
}

export function CharacterFull({ 
  look, 
  size = 'lg',
  showTeamNumber = true,
  className = '',
  ...props 
}: CharacterFullProps) {
  // Only show team number if explicitly requested and number exists
  const displayLook = showTeamNumber && look.teamNumber 
    ? look 
    : { ...look, teamNumber: undefined };

  return (
    <CharacterPreview
      look={displayLook}
      variant="full"
      size={size}
      className={`border border-border rounded-lg bg-card/50 ${className}`}
      {...props}
    />
  );
}