import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

const LazyImage = ({ 
  src, 
  alt, 
  className, 
  fallback = "https://api.dicebear.com/7.x/initials/svg?seed=C",
  ...props 
}: LazyImageProps) => {
  const [error, setError] = useState(false);

  return (
    <img
      src={error ? fallback : src}
      alt={alt}
      className={cn("object-contain", className)}
      onError={() => setError(true)}
      {...props}
    />
  );
};

export default LazyImage;
