import { useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import BackLink from "@/components/BackLink";
import { saveAvatarPhoto, getAvatarPhoto, clearAvatarPhoto } from "@/features/avatar/storage";
import AvatarImage from "@/features/avatar/AvatarImage";
import { useToast } from "@/hooks/use-toast";

const EXPORT_SIZE = 512;

export default function AvatarPhoto() {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [minScale, setMinScale] = useState(1);
  const [scale, setScale] = useState(1);
  const cropSize = 320;
  const imgRef = useRef<HTMLImageElement | null>(null);
  const { toast } = useToast();

  const current = getAvatarPhoto();

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setFileUrl(url);
  }

  function onImgLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const el = e.currentTarget;
    const w = el.naturalWidth, h = el.naturalHeight;
    setNatural({ w, h });
    const cover = Math.max(cropSize / w, cropSize / h); // fit (no zoom)
    setMinScale(cover);
    setScale(cover);
  }

  function exportCanvas(): string | null {
    if (!imgRef.current || !natural) return null;
    const { w, h } = natural;
    const s = scale;
    const canvas = document.createElement("canvas");
    canvas.width = EXPORT_SIZE; 
    canvas.height = EXPORT_SIZE;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#111"; 
    ctx.fillRect(0, 0, EXPORT_SIZE, EXPORT_SIZE);
    const drawW = w * (EXPORT_SIZE / cropSize) * s;
    const drawH = h * (EXPORT_SIZE / cropSize) * s;
    const dx = (EXPORT_SIZE - drawW) / 2;
    const dy = (EXPORT_SIZE - drawH) / 2;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(imgRef.current, dx, dy, drawW, drawH);
    return canvas.toDataURL("image/png");
  }

  function onSave() {
    const dataUrl = exportCanvas();
    if (!dataUrl) return;
    saveAvatarPhoto(dataUrl);
    toast({
      title: "Photo saved",
      description: "Your avatar photo has been updated successfully.",
    });
    // stay here; user uses Back to return.
  }

  function onClear() {
    clearAvatarPhoto();
    setFileUrl(null);
    setNatural(null);
    toast({
      title: "Photo cleared",
      description: "Your avatar photo has been removed.",
    });
  }

  const previewStyle = useMemo(() => ({ 
    transform: `translate(-50%, -50%) scale(${scale})` 
  }), [scale]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <BackLink className="text-purple-300 hover:text-white transition-colors">
            ← Back
          </BackLink>
          <h1 className="text-3xl font-bold text-white">Set Your Photo</h1>
        </div>
        
        <p className="text-purple-200">
          Silhouette shows until you save a photo.
        </p>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-black/20 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white">Current Avatar</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <AvatarImage size={96} />
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white">Upload a photo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="file-upload" className="text-purple-200">
                  Choose from gallery or take photo
                </Label>
                <input 
                  id="file-upload"
                  type="file" 
                  accept="image/*" 
                  onChange={onFile}
                  className="mt-2 block w-full text-sm text-purple-200
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-lg file:border-0
                           file:text-sm file:font-medium
                           file:bg-purple-600 file:text-white
                           hover:file:bg-purple-700"
                />
              </div>

              {fileUrl && (
                <div className="space-y-4">
                  <div 
                    className="mx-auto bg-black rounded-lg overflow-hidden relative"
                    style={{
                      width: cropSize, 
                      height: cropSize,
                    }}
                  >
                    <img 
                      ref={imgRef} 
                      src={fileUrl} 
                      onLoad={onImgLoad} 
                      alt="to crop"
                      style={{
                        position: "absolute", 
                        top: "50%", 
                        left: "50%",
                        ...previewStyle,
                        transformOrigin: "center center", 
                        userSelect: "none", 
                        pointerEvents: "none",
                      }} 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-purple-200">Zoom</Label>
                    <Slider
                      value={[scale]}
                      onValueChange={(value) => setScale(value[0])}
                      min={minScale}
                      max={Math.max(minScale * 2, minScale + 0.01)}
                      step={0.01}
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <Button 
                  onClick={onSave} 
                  disabled={!fileUrl}
                  className="bg-purple-600 hover:bg-purple-700"
                  data-testid="button-save"
                >
                  Save
                </Button>
                <Button 
                  onClick={onClear} 
                  variant="outline"
                  className="border-purple-500 text-purple-300 hover:bg-purple-800/50"
                  data-testid="button-clear"
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}