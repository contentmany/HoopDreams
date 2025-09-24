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
  const [avatarReady, setAvatarReady] = useState(false);

  useEffect(() => {
    // Initialize avatar customization system with better timing
    const initializeAvatar = async () => {
      try {
        // Wait for both AvatarKit and AvatarHooks to be available
        const waitForAvatarSystem = () => {
          return new Promise<void>((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 50; // 5 seconds maximum
            
            const check = () => {
              attempts++;
              
              if (window.AvatarKit && window.AvatarHooks) {
                console.log('Avatar system loaded successfully');
                resolve();
                return;
              }
              
              if (attempts >= maxAttempts) {
                reject(new Error('Avatar system failed to load within timeout'));
                return;
              }
              
              setTimeout(check, 100);
            };
            
            check();
          });
        };

        // Wait for avatar system to be available
        await waitForAvatarSystem();

        // Wait for DOM elements to be ready
        const checkDOMReady = () => {
          const requiredElements = [
            'avatarCanvas', 'skin', 'hairStyle', 'hairColor', 
            'eyeColor', 'eyeShape', 'brows', 'mouth', 'facial', 
            'accessory', 'btnRandom'
          ];
          return requiredElements.every(id => document.getElementById(id));
        };

        // Wait for DOM to be ready with polling
        let domAttempts = 0;
        while (!checkDOMReady() && domAttempts < 20) {
          await new Promise(resolve => setTimeout(resolve, 100));
          domAttempts++;
        }

        if (!checkDOMReady()) {
          console.error('Avatar DOM elements not ready after timeout');
          return;
        }

        // Initialize the avatar customization
        window.AvatarHooks.mountCustomize();
        setAvatarReady(true);
        console.log('Avatar customization system initialized successfully');
      } catch (error) {
        console.error('Failed to initialize avatar system:', error);
      }
    };

    // Start initialization
    initializeAvatar();
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
        <Card>
          <CardHeader>
            <CardTitle>Customize Appearance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div className="avatar-wrap">
                <canvas id="avatarCanvas" className="avatar128" width="128" height="128" aria-label="avatar preview"></canvas>

                <div className="controls">
                  <label>Skin
                    <select id="skin" data-testid="select-skin">
                      <option value="F1">Fair</option>
                      <option value="F2" selected>Tan</option>
                      <option value="F3">Brown</option>
                      <option value="F4">Deep</option>
                    </select>
                  </label>

                  <label>Hair Style
                    <select id="hairStyle" data-testid="select-hair-style">
                      <option>bald</option><option>buzz</option><option selected>short</option>
                      <option>afro</option><option>curls</option><option>waves</option>
                      <option>braids</option><option>locs</option><option>highTop</option>
                    </select>
                  </label>

                  <label>Hair Color
                    <select id="hairColor" data-testid="select-hair-color">
                      <option value="#2b2018">Deep Brown</option>
                      <option value="#3a2f25">Dark Walnut</option>
                      <option value="#4b382e">Chestnut</option>
                      <option value="#754c24">Auburn</option>
                      <option value="#111111">Jet Black</option>
                    </select>
                  </label>

                  <label>Eye Color
                    <select id="eyeColor" data-testid="select-eye-color">
                      <option value="#3a2f25">Brown</option>
                      <option value="#1f2d57">Navy</option>
                      <option value="#0a6a4f">Green</option>
                      <option value="#5b3a2e">Hazel</option>
                    </select>
                  </label>

                  <label>Eye Shape
                    <select id="eyeShape" data-testid="select-eye-shape">
                      <option>round</option><option selected>almond</option><option>droopy</option><option>sharp</option>
                    </select>
                  </label>

                  <label>Brows
                    <select id="brows" data-testid="select-brows">
                      <option value="true" selected>On</option>
                      <option value="false">Off</option>
                    </select>
                  </label>

                  <label>Mouth
                    <select id="mouth" data-testid="select-mouth">
                      <option>neutral</option><option selected>smile</option><option>grin</option><option>smirk</option><option>frown</option>
                    </select>
                  </label>

                  <label>Facial Hair
                    <select id="facial" data-testid="select-facial">
                      <option>none</option><option>goatee</option><option>mustache</option><option>chinstrap</option><option>full</option>
                    </select>
                  </label>

                  <label>Accessory
                    <select id="accessory" data-testid="select-accessory">
                      <option>none</option><option>headband</option><option>beanie</option><option>durag</option>
                    </select>
                  </label>

                  <button id="btnRandom" data-testid="button-random">Randomize</button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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