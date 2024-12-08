import { useEffect, useState } from 'react';

const useWindowSize = () => {
  // We are on the server
  const isSSR = typeof window === 'undefined';

  const [windowSize, setWindowSize] = useState({
    width: isSSR ? 1200 : window.innerWidth,
    height: isSSR ? 800 : window.innerHeight
  });

  const [onMobile, setOnMobile] = useState(false);

  useEffect(() => {
    window.addEventListener('resize', () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    });

    return () => {
      window.removeEventListener('resize', () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      });
    };
  }, []);

  useEffect(() => {
    if (windowSize.width <= 576) {
      setOnMobile(true);
    } else {
      setOnMobile(false);
    }
  }, [windowSize.width]);

  return {
    windowSize,
    onMobile
  };
};

export default useWindowSize;
