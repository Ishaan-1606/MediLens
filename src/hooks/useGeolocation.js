import { useEffect, useState, useRef } from "react";
export default function useGeolocation({ enableAuto = false } = {}) {
  const [status, setStatus] = useState(enableAuto ? "asking" : "idle");
  const [coords, setCoords] = useState(null);
  const watchId = useRef(null);

  useEffect(() => {
    if (!enableAuto) return;
    if (!("geolocation" in navigator)) {
      setStatus("unsupported");
      return;
    }
    setStatus("asking");
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setCoords({ latitude: p.coords.latitude, longitude: p.coords.longitude });
        setStatus("granted");
      },
      (err) => {
        if (err.code === 1) setStatus("denied");
        else setStatus("error");
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
    );
    return () => {
      if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    };
  }, [enableAuto]);

  const request = (opts = {}) => {
    if (!("geolocation" in navigator)) {
      setStatus("unsupported");
      return;
    }
    setStatus("asking");
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setCoords({ latitude: p.coords.latitude, longitude: p.coords.longitude });
        setStatus("granted");
      },
      (err) => {
        if (err.code === 1) setStatus("denied");
        else setStatus("error");
      },
      {
        enableHighAccuracy: opts.enableHighAccuracy || false,
        timeout: opts.timeout || 8000,
        maximumAge: opts.maximumAge || 60000
      }
    );
  };

  const clear = () => {
    setCoords(null);
    setStatus("idle");
  };

  return { status, coords, request, clear, setCoords };
}
