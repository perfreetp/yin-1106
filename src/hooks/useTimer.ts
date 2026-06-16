import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerOptions {
  initialTime?: number;
  autoStart?: boolean;
  onComplete?: () => void;
  onTick?: (remainingTime: number) => void;
}

interface UseTimerReturn {
  timeRemaining: number;
  isRunning: boolean;
  isPaused: boolean;
  isCompleted: boolean;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  reset: (newTime?: number) => void;
  formatTime: () => string;
  progress: number;
}

export const useTimer = (totalTime: number, options: UseTimerOptions = {}): UseTimerReturn => {
  const { initialTime, autoStart = false, onComplete, onTick } = options;

  const [timeRemaining, setTimeRemaining] = useState(initialTime ?? totalTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const totalTimeRef = useRef(totalTime);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onCompleteRef = useRef(onComplete);
  const onTickRef = useRef(onTick);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onTickRef.current = onTick;
  }, [onComplete, onTick]);

  const formatTime = useCallback(() => {
    const mins = Math.floor(timeRemaining / 60);
    const secs = timeRemaining % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [timeRemaining]);

  const progress = totalTimeRef.current > 0
    ? ((totalTimeRef.current - timeRemaining) / totalTimeRef.current) * 100
    : 0;

  const tick = useCallback(() => {
    setTimeRemaining((prev) => {
      const newTime = prev - 1;
      if (newTime <= 0) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setIsRunning(false);
        setIsPaused(false);
        setIsCompleted(true);
        onCompleteRef.current?.();
        return 0;
      }
      onTickRef.current?.(newTime);
      return newTime;
    });
  }, []);

  const start = useCallback(() => {
    if (isRunning) return;

    setIsRunning(true);
    setIsPaused(false);
    setIsCompleted(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(tick, 1000);
  }, [isRunning, tick]);

  const pause = useCallback(() => {
    if (!isRunning || isPaused) return;

    setIsPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [isRunning, isPaused]);

  const resume = useCallback(() => {
    if (!isPaused || timeRemaining <= 0) return;

    setIsPaused(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(tick, 1000);
  }, [isPaused, timeRemaining, tick]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    setIsPaused(false);
  }, []);

  const reset = useCallback((newTime?: number) => {
    stop();
    const resetTime = newTime ?? initialTime ?? totalTimeRef.current;
    totalTimeRef.current = resetTime;
    setTimeRemaining(resetTime);
    setIsCompleted(false);
  }, [stop, initialTime]);

  useEffect(() => {
    if (autoStart) {
      start();
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoStart, start]);

  return {
    timeRemaining,
    isRunning,
    isPaused,
    isCompleted,
    start,
    pause,
    resume,
    stop,
    reset,
    formatTime,
    progress,
  };
};

export const useCountdown = (seconds: number, onComplete?: () => void) => {
  return useTimer(seconds, {
    autoStart: true,
    onComplete,
  });
};
