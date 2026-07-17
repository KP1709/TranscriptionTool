import { useCallback, useEffect, useRef, useState } from "react";

const useCountdownTimer = (initialSeconds = 0) => {
    const [remaining, setRemaining] = useState(initialSeconds);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const start = useCallback(() => {
        if (intervalRef.current) return;

        intervalRef.current = setInterval(() => {
            setRemaining((current) => {
                if (current <= 1) {
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                    }
                    return 0;
                }
                return current - 1;
            });
        }, 1000);
    }, []);

    const stop = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const reset = useCallback((seconds = initialSeconds) => {
        stop();
        setRemaining(seconds);
    }, [initialSeconds, stop]);

    useEffect(() => {
        return stop;
    }, [stop]);

    return {
        minutes: Math.floor(remaining / 60),
        seconds: remaining % 60,
        start,
        stop,
        reset,
    };
};

export default useCountdownTimer;