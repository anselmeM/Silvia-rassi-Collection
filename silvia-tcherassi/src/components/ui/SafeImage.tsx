import { useState, ImgHTMLAttributes } from 'react';

interface SafeImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export default function SafeImage({ 
  src, 
  alt, 
  fallbackSrc = '/images/placeholder.svg', 
  className, 
  ...props 
}: SafeImageProps) {
  const [error, setError] = useState(false);

  return (
    <img
      src={error ? fallbackSrc : src}
      alt={alt}
      className={className}
      onError={() => {
        if (!error) setError(true);
      }}
      {...props}
    />
  );
}
