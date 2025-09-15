import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Preloader from './Preloader';

const RouteLoader = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Show preloader when route changes
    setIsLoading(true);
    
    // Simulate route loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1 second loading time

    // Also check if all resources are loaded
    const handleLoad = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 200);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', handleLoad);
    };
  }, [location.pathname]); // Re-run when route changes

  if (isLoading) {
    return <Preloader />;
  }

  return children;
};

export default RouteLoader;