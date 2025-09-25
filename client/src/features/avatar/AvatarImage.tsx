import { getAvatarPhoto } from "./storage";

function Silhouette({ size = 48 }: { size?: number }) {
  return (
    <img 
      src="/img/silhouette-grey.png" 
      alt="Default avatar"
      width={size}
      height={size}
      style={{ 
        width: size, 
        height: size, 
        borderRadius: "50%", 
        objectFit: "cover",
        display: "block"
      }}
    />
  );
}

export default function AvatarImage({ 
  size = 48, 
  className = "", 
  alt = "Avatar" 
}: {
  size?: number; 
  className?: string; 
  alt?: string;
}) {
  const photo = getAvatarPhoto();
  
  if (!photo) {
    return <Silhouette size={size} />;
  }
  
  return (
    <img 
      src={photo.dataUrl} 
      alt={alt} 
      width={size} 
      height={size}
      style={{ 
        width: size, 
        height: size, 
        borderRadius: "50%", 
        objectFit: "cover",
        objectPosition: "center", 
        display: "block"
      }}
      className={className} 
    />
  );
}