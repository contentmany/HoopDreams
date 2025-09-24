import { getAvatarPhoto } from "./storage";

function Silhouette({ size = 48 }: { size?: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 128 128" 
      role="img" 
      aria-label="silhouette"
      style={{ display: "block", borderRadius: "50%", background: "#1f1f1f" }}
    >
      <circle cx="64" cy="64" r="64" fill="#262626" />
      <circle cx="64" cy="50" r="26" fill="#8a8a8a" />
      <path d="M18 112c6-22 24-34 46-34s40 12 46 34" fill="#8a8a8a" />
    </svg>
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
        display: "block", 
        background: "#1f1f1f" 
      }}
      className={className} 
    />
  );
}