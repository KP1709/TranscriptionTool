import { useEffect } from "react";
import { logger } from "@/lib/logger";
import { TimerIcon } from "@phosphor-icons/react";

type CountdownTimerType = {
    minutes: number;
    seconds: number;
    stopTranscribing: () => void;
};

const CountdownTimer = ({ minutes, seconds, stopTranscribing }: CountdownTimerType) => {
    useEffect(() => {
        if (minutes === 0 && seconds === 0) {
            stopTranscribing();
            logger.log('[AUDIO] - Recording stopped - timer finished', '', <TimerIcon />);
        }
    }, [minutes, seconds, stopTranscribing]);

    return (
        <div>
            <p>{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}</p>
        </div>
    );
};

export default CountdownTimer;