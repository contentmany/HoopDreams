import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';

interface AvatarCustomizeNewProps {
  onNavigate?: (path: string) => void;
}

export default function AvatarCustomizeNew({ onNavigate }: AvatarCustomizeNewProps) {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [avatarReady, setAvatarReady] = useState(false);

  useEffect(() => {
    // Load CSS and JS modules
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/css/avatar.css';
    document.head.appendChild(link);

    // Load and initialize procedural avatar system after DOM is ready
    const initializeAvatar = () => {
      const script = document.createElement('script');
      script.type = 'module';
      script.innerHTML = `
        import { mountCustomize } from '/js/avatar-hooks.js';
        
        // Robust DOM readiness check with retries
        function waitForElements(maxAttempts = 20) {
          const canvas = document.getElementById('avatarCanvas');
          const skinSelect = document.getElementById('skin');
          const hairSelect = document.getElementById('hair');
          
          if (canvas && skinSelect && hairSelect) {
            console.log('Avatar elements found, initializing...');
            mountCustomize();
          } else if (maxAttempts > 0) {
            console.log('Waiting for avatar elements... attempts left:', maxAttempts);
            setTimeout(() => waitForElements(maxAttempts - 1), 100);
          } else {
            console.error('Avatar elements not found after maximum attempts');
          }
        }
        
        // Start checking for elements
        waitForElements();
      `;
      document.head.appendChild(script);
    };
    
    // Initialize after a small delay to ensure React has rendered
    setTimeout(initializeAvatar, 100);

    setLoading(false);
  }, []);

  const handleSave = () => {
    onNavigate?.('/builder');
    setLocation('/builder');
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => {
                  onNavigate?.('/new');
                  setLocation('/new');
                }}
                data-testid="button-back"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle>Customize Appearance</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Create your unique look for the basketball courts
            </div>
          </CardContent>
        </Card>

        {/* Avatar Customization */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <div className="avatar-wrap">
                  <canvas 
                    id="avatarCanvas" 
                    width="128" 
                    height="128" 
                    aria-label="avatar preview"
                  />
                  <div className="controls">
                    <label>Skin:
                      <select id="skin" data-testid="select-skin" defaultValue="F3">
                        <option value="F1">F1</option>
                        <option value="F2">F2</option>
                        <option value="F3">F3</option>
                        <option value="F4">F4</option>
                      </select>
                    </label>
                    <label>Hair:
                      <select id="hair" data-testid="select-hair" defaultValue="short">
                        <option value="bald">bald</option>
                        <option value="buzz">buzz</option>
                        <option value="short">short</option>
                        <option value="afro">afro</option>
                        <option value="curls">curls</option>
                        <option value="braids">braids</option>
                        <option value="waves">waves</option>
                        <option value="locs">locs</option>
                        <option value="beanie">beanie</option>
                        <option value="durag">durag</option>
                        <option value="headband">headband</option>
                      </select>
                    </label>
                    <label>Hair Color:
                      <select id="hairColor" data-testid="select-hair-color" defaultValue="#2b2018">
                        <option value="#2b2018">#2b2018</option>
                        <option value="#3a2f25">#3a2f25</option>
                        <option value="#4b382e">#4b382e</option>
                        <option value="#754c24">#754c24</option>
                        <option value="#111111">#111111</option>
                      </select>
                    </label>
                    <label>Eyes:
                      <select id="eyeColor" data-testid="select-eye-color" defaultValue="#3a2f25">
                        <option value="#3a2f25">#3a2f25</option>
                        <option value="#1f2d57">#1f2d57</option>
                        <option value="#0a6a4f">#0a6a4f</option>
                        <option value="#5b3a2e">#5b3a2e</option>
                      </select>
                    </label>
                    <label>Facial Hair:
                      <select id="facial" data-testid="select-facial" defaultValue="none">
                        <option value="none">none</option>
                        <option value="goatee">goatee</option>
                        <option value="mustache">mustache</option>
                        <option value="full">full</option>
                      </select>
                    </label>
                    <button id="btnRandom" data-testid="button-random">Randomize</button>
                  </div>
                  <button 
                    id="avatarSave" 
                    className="btn btn-primary" 
                    data-next="/builder"
                    data-testid="button-save"
                  >
                    Save & Continue
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Procedural Avatars</h4>
                <p className="text-sm text-muted-foreground">
                  This system draws smooth head-only avatars using canvas rendering. No image files needed!
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Features</h4>
                <p className="text-sm text-muted-foreground">
                  Customize skin tone, hair styles, eye color, facial hair, and accessories. Perfect for basketball courts.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Rendering</h4>
                <p className="text-sm text-muted-foreground">
                  Crisp at any size (128/96/64/40px) with proper layering: skin → eyes → brows → facial features → hair.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <Button 
            variant="outline"
            onClick={() => {
              onNavigate?.('/new');
              setLocation('/new');
            }}
            data-testid="button-back"
          >
            Back
          </Button>
        </div>
      </div>

    </div>
  );
}