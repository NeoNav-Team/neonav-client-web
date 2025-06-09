import {getLocalStorage, setLocalStorage, clearLocalStorage} from './localStorage';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const restoreScrollPosition = () => {
  const location = useLocation();

  useEffect(() => {
    const storedScroll = getLocalStorage(location.pathname);
    if (storedScroll) {
      window.scrollTo(0, parseInt(storedScroll));
      clearLocalStorage(location.pathname);
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location]);

  const handleBeforeUnload = () => {
    setLocalStorage(location.pathname, window.scrollY);
  };
}
