'use client';

import Image from 'next/image';

const NextImage = ({ src, alt, priority = false, quality }) => {
  const myLoader = ({ src, quality }) => {
    if (src[0] === 'v') {
      return `https://res.cloudinary.com/thasup/image/upload/q_${quality || 60}/${src}`;
    } else {
      return `https://www.dropbox.com/s/${src}?raw=1&q=${quality || 70}`;
    }
  };

  return (
    <Image
      loader={myLoader}
      src={src}
      fill
      sizes="100vw"
      style={{ objectFit: 'cover' }}
      quality={quality}
      priority={priority}
      alt={alt}
    />
  );
};

export default NextImage;
