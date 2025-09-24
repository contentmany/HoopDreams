import { useEffect, useRef, useState, useCallback } from 'react';
import { CharacterLook, LAYER_ORDER } from '@/types/character';

export interface CharacterPreviewProps {
  look: CharacterLook;
  variant?: 'portrait' | 'full';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

interface LayerCache {
  [key: string]: {
    original: HTMLImageElement;
    tinted?: HTMLCanvasElement;
    color?: string;
  };
}

// Module-level cache singleton to share across all instances
const globalLayerCache: LayerCache = {};

export function CharacterPreview({ 
  look, 
  variant = 'portrait', 
  size = 'md',
  className = '' 
}: CharacterPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderIdRef = useRef<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Canvas dimensions based on variant
  const dimensions = variant === 'portrait' 
    ? { width: 256, height: 256 }
    : { width: 384, height: 512 };

  // Size classes
  const sizeClasses = {
    sm: variant === 'portrait' ? 'w-16 h-16' : 'w-24 h-32',
    md: variant === 'portrait' ? 'w-32 h-32' : 'w-48 h-64', 
    lg: variant === 'portrait' ? 'w-48 h-48' : 'w-72 h-96'
  };

  // Get asset path for a layer
  const getAssetPath = (layer: string, variant: string): string => {
    const basePath = `/assets/characters/${variant}/${layer}`;
    
    switch (layer) {
      case 'head':
        return `${basePath}/${look.skin}.png`;
      case 'hair':
        return `${basePath}/${look.hair}.png`;
      case 'brows':
        return `${basePath}/${look.brows}.png`;
      case 'eyes':
        return `${basePath}/${look.eyes}.png`;
      case 'nose':
        return `${basePath}/${look.nose}.png`;
      case 'mouth':
        return `${basePath}/${look.mouth}.png`;
      case 'accessory':
        return look.accessory !== 'none' ? `${basePath}/${look.accessory}.png` : '';
      case 'jersey':
        return `${basePath}/neutral.png`; // Use grayscale for tinting
      case 'shorts':
        return `${basePath}/neutral.png`; // Use grayscale for tinting
      case 'legs':
        return `${basePath}/${look.skin}.png`;
      case 'socks':
        return `${basePath}/white.png`;
      case 'shoes':
        return `${basePath}/black.png`;
      default:
        return `${basePath}/default.png`;
    }
  };

  // Load and cache layer image
  const loadLayerImage = useCallback((layer: string): Promise<HTMLImageElement> => {
    const path = getAssetPath(layer, variant);
    
    if (!path) {
      return Promise.reject(new Error(`No asset path for layer: ${layer}`));
    }

    if (globalLayerCache[path]?.original) {
      return Promise.resolve(globalLayerCache[path].original);
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        if (!globalLayerCache[path]) globalLayerCache[path] = { original: img };
        else globalLayerCache[path].original = img;
        resolve(img);
      };
      img.onerror = () => reject(new Error(`Failed to load: ${path}`));
      img.src = path;
    });
  }, [variant]);

  // Tint grayscale image to color using canvas
  const tintImage = (sourceImg: HTMLImageElement, color: string): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    canvas.width = sourceImg.width;
    canvas.height = sourceImg.height;
    
    // Draw original image
    ctx.drawImage(sourceImg, 0, 0);
    
    // Apply color tint using multiply blend mode
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Restore alpha channel
    ctx.globalCompositeOperation = 'destination-in';
    ctx.drawImage(sourceImg, 0, 0);
    
    return canvas;
  };

  // Get tinted version of layer with caching
  const getTintedLayer = useCallback((layer: string, color: string): Promise<HTMLCanvasElement | HTMLImageElement> => {
    const path = getAssetPath(layer, variant);
    
    if (!path) {
      return Promise.reject(new Error(`No asset path for layer: ${layer}`));
    }

    // Check cache for tinted version
    if (globalLayerCache[path]?.tinted && globalLayerCache[path]?.color === color) {
      return Promise.resolve(globalLayerCache[path].tinted!);
    }

    return loadLayerImage(layer).then(img => {
      if (['jersey', 'shorts'].includes(layer)) {
        const tinted = tintImage(img, color);
        globalLayerCache[path].tinted = tinted;
        globalLayerCache[path].color = color;
        return tinted;
      }
      return img;
    });
  }, [variant, loadLayerImage]);

  // Render character layers to canvas
  const renderCharacter = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Assign unique render ID to prevent stale renders
    const renderId = ++renderIdRef.current;
    
    const ctx = canvas.getContext('2d')!;
    
    // Set up high-DPI rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);
    
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);
    setIsLoading(true);

    try {
      // Get layers to render
      const layersToRender = LAYER_ORDER.filter(layer => {
        // Skip accessory if none
        if (layer === 'accessory' && look.accessory === 'none') return false;
        // Skip full-body layers for portrait
        if (variant === 'portrait' && ['shorts', 'legs', 'socks', 'shoes'].includes(layer)) return false;
        return true;
      });

      // Preload all layers in parallel
      const layerPromises = layersToRender.map(async layer => {
        try {
          let renderSource: HTMLCanvasElement | HTMLImageElement;
          
          // Get appropriate layer with tinting
          if (layer === 'jersey') {
            renderSource = await getTintedLayer(layer, look.jerseyColor);
          } else if (layer === 'shorts') {
            renderSource = await getTintedLayer(layer, look.shortsColor);
          } else {
            renderSource = await loadLayerImage(layer);
          }
          
          return { layer, renderSource };
        } catch (error) {
          console.warn(`Failed to load layer ${layer}:`, error);
          return null;
        }
      });

      const loadedLayers = await Promise.all(layerPromises);
      
      // Check if this render is still current
      if (renderId !== renderIdRef.current) return;

      // Draw layers in order
      for (const layerData of loadedLayers) {
        if (layerData && renderId === renderIdRef.current) {
          ctx.drawImage(layerData.renderSource, 0, 0, dimensions.width, dimensions.height);
        }
      }

      if (renderId === renderIdRef.current) {
        setIsLoading(false);
      }
    } catch (error) {
      console.warn('Error rendering character layers:', error);
      if (renderId === renderIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [look, variant, dimensions, getTintedLayer, loadLayerImage]);

  // Re-render when look changes
  useEffect(() => {
    renderCharacter();
  }, [look, variant]);

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain"
        style={{ 
          imageRendering: 'auto',
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`
        }}
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-card/50 rounded">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {/* Team number overlay for jersey */}
      {look.teamNumber && variant === 'full' && (
        <div 
          className="absolute text-white font-bold text-center"
          style={{
            top: '35%',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: size === 'lg' ? '24px' : size === 'md' ? '16px' : '12px',
            textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
          }}
        >
          {look.teamNumber}
        </div>
      )}
    </div>
  );
}