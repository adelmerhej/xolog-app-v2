'use client';

import { useState, useEffect } from 'react';

export const useScreenSize = () => {
  const getScreenSize = () => {
    if (typeof window === 'undefined') {
      // SSR fallback: return default (desktop)
      return {
        isXSmall: false,
        isSmall: false,
        isMedium: false,
        isLarge: true,
      };
    }
    const xSmallMedia = window.matchMedia('(max-width: 575.98px)');
    const smallMedia = window.matchMedia('(min-width: 576px) and (max-width: 991.98px)');
    const mediumMedia = window.matchMedia('(min-width: 992px) and (max-width: 1199.98px)');
    const largeMedia = window.matchMedia('(min-width: 1200px)');
    return {
      isXSmall: xSmallMedia.matches,
      isSmall: smallMedia.matches,
      isMedium: mediumMedia.matches,
      isLarge: largeMedia.matches,
    };
  };

  const [screenSize, setScreenSize] = useState(getScreenSize());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const xSmallMedia = window.matchMedia('(max-width: 575.98px)');
    const smallMedia = window.matchMedia('(min-width: 576px) and (max-width: 991.98px)');
    const mediumMedia = window.matchMedia('(min-width: 992px) and (max-width: 1199.98px)');
    const largeMedia = window.matchMedia('(min-width: 1200px)');
    const handler = () => setScreenSize(getScreenSize());
    [xSmallMedia, smallMedia, mediumMedia, largeMedia].forEach((media) => {
      media.addEventListener('change', handler);
    });
    return () => {
      [xSmallMedia, smallMedia, mediumMedia, largeMedia].forEach((media) => {
        media.removeEventListener('change', handler);
      });
    };
  }, []);

  return screenSize;
};

export const useScreenSizeClass = () => {
  const screenSize = useScreenSize();

  if (screenSize.isLarge) {
    return 'screen-large';
  }

  if (screenSize.isMedium) {
    return 'screen-medium';
  }

  if (screenSize.isSmall) {
    return 'screen-small';
  }

  return 'screen-x-small';
};

export function getSizeQualifier(width: number) {
  if (width <= 420) return 'xs';
  if (width <= 992) return 'sm';
  if (width < 1200) return 'md';
  return 'lg';
}