import { useState } from "react";

type MicrophonePermissionState = "granted" | "denied" | "prompt" | "unsupported";

const useMicrophonePermissions = () => {
    const [permissionState, setPermissionState] = useState<MicrophonePermissionState>("prompt");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const finish = (nextState: MicrophonePermissionState, nextError?: string | null): MicrophonePermissionState => {
        setPermissionState(nextState);
        setError(nextError ?? null);
        setIsLoading(false);
        return nextState;
    };

    const requestPermission = async (): Promise<MicrophonePermissionState> => {
        setIsLoading(true);
        setError(null);

        if (typeof window === "undefined" || typeof navigator === "undefined") {
            return finish("unsupported", "This environment does not support microphone permissions.");
        }

        if (navigator.permissions?.query) {
            try {
                const microphonePermission = await navigator.permissions.query({
                    name: "microphone" as PermissionName,
                });

                if (microphonePermission.state === "granted") {
                    return finish("granted");
                }

                if (microphonePermission.state === "prompt") {
                    if (navigator.mediaDevices?.getUserMedia) {
                        try {
                            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                            stream.getTracks().forEach((track) => track.stop());
                            return finish("granted");
                        } catch {
                            return finish("denied", "Microphone access has not been granted.");
                        }
                    }
                }

                return finish(microphonePermission.state as MicrophonePermissionState);
            } catch (permissionError) {
                console.warn("Unable to query microphone permissions", permissionError);
            }
        }

        if (navigator.mediaDevices?.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                stream.getTracks().forEach((track) => track.stop());
                return finish("granted");
            } catch {
                return finish("denied", "Microphone access has not been granted.");
            }
        }

        return finish("unsupported", "This browser does not support microphone access.");
    };

    return {
        permissionState,
        isMicEnabled: permissionState === "granted",
        isLoading,
        error,
        requestPermission,
    };
};

export default useMicrophonePermissions;
