import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import BackLink from '@/components/BackLink';

interface PhotoAvatarProps {
  currentPhotoUrl?: string;
  onSave?: (photoUrl: string) => void;
}

export default function PhotoAvatar({ currentPhotoUrl, onSave }: PhotoAvatarProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState([1.0]);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file',
        variant: 'destructive'
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSelectedImage(result);
      setZoom([1.0]);
      setPosition({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
  }, [toast]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!selectedImage) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  }, [selectedImage, position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const exportCroppedImage = useCallback(() => {
    if (!selectedImage || !canvasRef.current || !imageRef.current) return null;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Set canvas size to 256x256
    canvas.width = 256;
    canvas.height = 256;

    // Calculate image dimensions and position
    const img = imageRef.current;
    const scale = zoom[0];
    const imgWidth = img.naturalWidth * scale;
    const imgHeight = img.naturalHeight * scale;

    // Draw the image cropped to square
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, 256, 256);
    ctx.drawImage(
      img,
      position.x,
      position.y,
      imgWidth,
      imgHeight
    );

    return canvas.toDataURL('image/png');
  }, [selectedImage, zoom, position]);

  const handleSave = useCallback(() => {
    const croppedImage = exportCroppedImage();
    if (!croppedImage) {
      toast({
        title: 'Error',
        description: 'Failed to process image',
        variant: 'destructive'
      });
      return;
    }

    // Save to localStorage
    localStorage.setItem('avatar_photo', croppedImage);

    // Call onSave callback
    onSave?.(croppedImage);

    toast({
      title: 'Photo saved',
      description: 'Your avatar photo has been saved successfully'
    });
  }, [exportCroppedImage, onSave, toast]);

  const navigate = (delta: number) => {
    // Use wouter's setLocation with fallback
    if (delta === -1) {
      setLocation('/profile'); // Fallback to profile since that's where PhotoAvatar is typically accessed from
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        <button 
          onClick={handleBack}
          className="text-primary hover:text-primary/80 transition-colors mb-4"
          data-testid="button-back"
        >
          ← Back
        </button>

        <Card>
          <CardHeader>
            <CardTitle>Photo Avatar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!selectedImage ? (
              <div className="space-y-4">
                <div className="text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                    data-testid="button-select-photo"
                  >
                    Select Photo
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Choose from gallery or take a photo
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Image Preview */}
                <div className="relative w-64 h-64 mx-auto border-2 border-dashed border-muted overflow-hidden rounded-lg">
                  <div
                    className="absolute inset-0 cursor-move select-none"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    <img
                      ref={imageRef}
                      src={selectedImage}
                      alt="Selected"
                      style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${zoom[0]})`,
                        objectFit: 'contain',
                        transformOrigin: 'top left',
                        pointerEvents: 'none',
                        maxWidth: 'none',
                        maxHeight: 'none'
                      }}
                      data-testid="img-crop-preview"
                    />
                  </div>
                  <div className="absolute inset-0 pointer-events-none border border-primary/50 rounded-lg" />
                </div>

                {/* Zoom Control */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Zoom: {zoom[0].toFixed(2)}x</label>
                  <Slider
                    value={zoom}
                    onValueChange={setZoom}
                    min={1.0}
                    max={3.0}
                    step={0.01}
                    data-testid="slider-zoom"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedImage(null)}
                    className="flex-1"
                    data-testid="button-select-different"
                  >
                    Select Different
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="flex-1"
                    data-testid="button-save-photo"
                  >
                    Save Photo
                  </Button>
                </div>

                {/* Hidden canvas for export */}
                <canvas
                  ref={canvasRef}
                  className="hidden"
                  data-testid="canvas-export"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}