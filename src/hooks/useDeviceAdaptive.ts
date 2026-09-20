import { useState, useEffect } from 'react';
import { DeviceType } from '../types';

export function useDeviceAdaptive() {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const [isKioskMode, setIsKioskMode] = useState<boolean>(false);

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      setWindowWidth(width);

      if (width <= 480) {
        setDeviceType('mobile');
      } else if (width <= 768) {
        setDeviceType('tablet');
      } else if (width <= 1024) {
        setDeviceType('laptop');
      } else if (width <= 1440) {
        setDeviceType('desktop');
      } else {
        setDeviceType('big_screen');
      }
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleKioskMode = () => {
    setIsKioskMode((prev) => !prev);
  };

  return {
    deviceType,
    windowWidth,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isLaptop: deviceType === 'laptop',
    isDesktop: deviceType === 'desktop',
    isBigScreen: deviceType === 'big_screen',
    isKioskMode,
    setIsKioskMode,
    toggleKioskMode,
  };
}
