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
    let mounted = true;
    let initializationAttempted = false;

    // Load CSS first
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/css/avatar.css';
    document.head.appendChild(link);

    // Enhanced DOM ready check with better timing
    const checkDOMReady = () => {
      if (!mounted) return false;
      
      // Check for all required elements
      const requiredElements = [
        'avatarCanvas',
        'skin', 
        'hairStyle', 
        'hairColor', 
        'eyeColor', 
        'eyeShape',
        'brows',
        'mouth',
        'facial', 
        'accessory',
        'btnRandom'
      ];
      
      const missingElements = requiredElements.filter(id => !document.getElementById(id));
      
      if (missingElements.length === 0) {
        console.log('All avatar DOM elements are ready');
        return true;
      } else {
        console.log('Missing avatar elements:', missingElements);
        return false;
      }
    };

    // Initialize avatar system with improved error handling
    const initializeAvatar = () => {
      if (initializationAttempted || !mounted) return;
      initializationAttempted = true;

      try {
        console.log('Creating avatar initialization script...');
        
        // Create script element for module import
        const script = document.createElement('script');
        script.type = 'module';
        script.innerHTML = `
          try {
            console.log('Loading avatar engine...');
            import('/js/proc-avatar.js').then(() => {
              console.log('Avatar engine loaded, loading hooks...');
              return import('/js/avatar-hooks.js');
            }).then(({ mountCustomize }) => {
              console.log('Avatar hooks loaded, attempting to mount...');
              mountCustomize();
              console.log('Avatar system initialized successfully');
              
              // Dispatch custom event to notify React component
              window.dispatchEvent(new CustomEvent('avatarReady'));
            }).catch(error => {
              console.error('Failed to load avatar system:', error);
              window.dispatchEvent(new CustomEvent('avatarError', { detail: error }));
            });
          } catch (error) {
            console.error('Script execution error:', error);
            window.dispatchEvent(new CustomEvent('avatarError', { detail: error }));
          }
        `;
        
        document.head.appendChild(script);
        
      } catch (error) {
        console.error('Failed to create avatar initialization script:', error);
        // Reset flag to allow retry
        initializationAttempted = false;
      }
    };

    // More robust timing mechanism
    const startAvatarSystem = () => {
      if (!mounted) return;

      // Use multiple strategies to ensure DOM is ready
      const strategies = [
        // Strategy 1: Immediate check
        () => {
          if (checkDOMReady()) {
            initializeAvatar();
            return true;
          }
          return false;
        },
        
        // Strategy 2: RequestAnimationFrame for next repaint
        () => new Promise(resolve => {
          requestAnimationFrame(() => {
            if (checkDOMReady()) {
              initializeAvatar();
              resolve(true);
            } else {
              resolve(false);
            }
          });
        }),
        
        // Strategy 3: Small delay with retry
        () => new Promise(resolve => {
          setTimeout(() => {
            if (checkDOMReady()) {
              initializeAvatar();
              resolve(true);
            } else {
              resolve(false);
            }
          }, 100);
        }),
        
        // Strategy 4: Polling with backoff
        () => new Promise(resolve => {
          let attempts = 0;
          const maxAttempts = 20;
          
          const poll = () => {
            if (!mounted) {
              resolve(false);
              return;
            }
            
            attempts++;
            if (checkDOMReady()) {
              initializeAvatar();
              resolve(true);
            } else if (attempts < maxAttempts) {
              const delay = Math.min(100 * attempts, 1000); // Exponential backoff up to 1s
              setTimeout(poll, delay);
            } else {
              console.error('Failed to find all avatar elements after maximum attempts');
              resolve(false);
            }
          };
          
          poll();
        })
      ];

      // Execute strategies sequentially until one succeeds
      const executeStrategies = async () => {
        for (const strategy of strategies) {
          try {
            const success = await strategy();
            if (success) {
              console.log('Avatar initialization strategy succeeded');
              break;
            }
          } catch (error) {
            console.warn('Avatar initialization strategy failed:', error);
          }
        }
      };

      executeStrategies();
    };

    // Add event listeners for avatar system feedback
    const handleAvatarReady = () => {
      if (mounted) {
        console.log('Avatar system is ready');
        setAvatarReady(true);
      }
    };

    const handleAvatarError = (event: Event) => {
      if (mounted) {
        const customEvent = event as CustomEvent<any>;
        console.error('Avatar system error:', customEvent.detail);
        // Reset initialization flag to allow retry
        initializationAttempted = false;
      }
    };

    window.addEventListener('avatarReady', handleAvatarReady);
    window.addEventListener('avatarError', handleAvatarError);

    // Start the avatar system initialization
    startAvatarSystem();
    setLoading(false);

    // Cleanup function
    return () => {
      mounted = false;
      window.removeEventListener('avatarReady', handleAvatarReady);
      window.removeEventListener('avatarError', handleAvatarError);
    };
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