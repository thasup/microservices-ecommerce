import React from "react";
import Image from "next/image";

const NextImage = ({ src, alt, priority, quality }) => {
  const myLoader = ({ src, quality }) => {
    return `https://www.dropbox.com/s/${src}.webp?raw=1&q=${quality || 75}`;
  };

  return (
    <Image
      loader={myLoader}
      src={src.slice(0, -4)}
      layout="fill"
      objectFit="cover"
      priority={priority || false}
      alt={alt}
    />
  );
};

export default NextImage;
