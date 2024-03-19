import React from "react";

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

const CustomImage: React.FC<ImageProps> = ({ src, alt, className, style }) => {
  return <img src={src} alt={alt} className={className} style={style} />;
};

export default CustomImage;
