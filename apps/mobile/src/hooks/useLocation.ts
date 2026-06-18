import { useState, useEffect } from 'react';

interface LocationState {
  coords: { latitude: number; longitude: number } | null;
  error: string | null;
  loading: boolean;
}

export function useLocation(): LocationState {
  const [state, setState] = useState<LocationState>({
    coords: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({ coords: null, error: 'Geolocation not supported', loading: false });
      return;
    }

    const onSuccess = (pos: GeolocationPosition) => {
      const { latitude, longitude } = pos.coords;
      (window as any).__bonding_last_coords__ = { latitude, longitude };
      setState({ coords: { latitude, longitude }, error: null, loading: false });
    };

    const onError = (err: GeolocationPositionError) => {
      setState({ coords: null, error: err.message, loading: false });
    };

    const watchId = navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000,
    });

    // Also try immediate position
    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 30000,
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return state;
}
