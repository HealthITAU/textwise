import { useCallback, useEffect, useRef, useState } from "react";

function useCooldown() {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isCoolingDown, setIsCoolingDown] = useState(false);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);

  const startCooldown = useCallback((seconds: number) => {
    setTimeRemaining(seconds);
    setIsCoolingDown(true);
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
    }
    timerIdRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerIdRef.current as NodeJS.Timeout);
          setIsCoolingDown(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    return () => {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
      }
    };
  }, []);

  return { timeRemaining, isCoolingDown, startCooldown };
}

export default useCooldown;
