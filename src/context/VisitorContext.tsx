import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  visitorTracker,
  VisitorStats,
} from '../services/visitorTrackingService';

interface VisitorContextType extends VisitorStats {
  formatVisitorCount: (count: number | null) => string;
}

const VisitorContext = createContext<VisitorContextType | undefined>(undefined);

export const VisitorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<VisitorStats>({
    totalUniqueVisitors: null,
    liveVisitors: 0,
    isLive: false,
    isLoading: true,
    isFirebaseConnected: false,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    // Asynchronously initialize tracking in background without blocking page render
    visitorTracker.startTracking((updated) => {
      if (isMounted) {
        setStats((prev) => ({ ...prev, ...updated }));
      }
    });

    return () => {
      isMounted = false;
      visitorTracker.cleanup();
    };
  }, []);

  const formatVisitorCount = (count: number | null): string => {
    if (count === null || count === undefined) return '—';
    return count.toLocaleString();
  };

  return (
    <VisitorContext.Provider
      value={{
        ...stats,
        formatVisitorCount,
      }}
    >
      {children}
    </VisitorContext.Provider>
  );
};

export const useVisitorStats = (): VisitorContextType => {
  const context = useContext(VisitorContext);
  if (!context) {
    throw new Error('useVisitorStats must be used within a VisitorProvider');
  }
  return context;
};
