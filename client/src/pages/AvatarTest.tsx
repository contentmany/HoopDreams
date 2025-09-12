import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { randomAvatar, composeAvatar } from '../../../src/lib/avatar';

export default function AvatarTest() {
  const [avatarDataUrl, setAvatarDataUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  const generateRandomAvatar = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await randomAvatar();
      setAvatarDataUrl(result.dataUrl);
      console.log('Generated avatar with parts:', result.parts);
    } catch (err) {
      setError(`Failed to generate avatar: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateSpecificAvatar = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const parts = {
        tone: 'f2',
        expr: 'neutral',
        eyes: { shape: 'round', color: 'brown' },
        brows: 'straight',
        mouth: 'neutral',
        hair: 'short',
        accessory: 'none'
      };
      
      const dataUrl = await composeAvatar(parts);
      setAvatarDataUrl(dataUrl);
      console.log('Generated avatar with specific parts:', parts);
    } catch (err) {
      setError(`Failed to generate specific avatar: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    // Generate a random avatar on component mount
    generateRandomAvatar();
  }, []);
  
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Avatar System Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={generateRandomAvatar} 
              disabled={isLoading}
              data-testid="button-random-avatar"
            >
              {isLoading ? 'Generating...' : 'Generate Random Avatar'}
            </Button>
            
            <Button 
              onClick={generateSpecificAvatar} 
              disabled={isLoading}
              variant="outline"
              data-testid="button-specific-avatar"
            >
              Generate Specific Avatar
            </Button>
          </div>
          
          {error && (
            <div className="text-red-600 p-4 bg-red-50 rounded" data-testid="error-message">
              {error}
            </div>
          )}
          
          {avatarDataUrl && (
            <div className="flex justify-center" data-testid="avatar-display">
              <img 
                src={avatarDataUrl} 
                alt="Generated Avatar" 
                className="w-64 h-64 border rounded-lg bg-gray-100"
                data-testid="avatar-image"
              />
            </div>
          )}
          
          {isLoading && (
            <div className="text-center p-8" data-testid="loading-message">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2">Generating avatar...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}