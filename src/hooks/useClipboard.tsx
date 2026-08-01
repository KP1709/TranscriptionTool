import { useCallback, useState } from "react";

type ClipboardStatus = "idle" | "success" | "error";

interface UseClipboardOptions {
    onCopy?: (text: string) => void;
    onError?: (error: Error) => void;
}

const useClipboard = (options: UseClipboardOptions = {}) => {
    const { onCopy, onError } = options;

    const [copiedText, setCopiedText] = useState("");
    const [status, setStatus] = useState<ClipboardStatus>("idle");
    const [error, setError] = useState<Error | null>(null);

    const copy = useCallback(
        async (text: string) => {
            try {
                await navigator.clipboard.writeText(text);

                setCopiedText(text);
                setStatus("success");
                setError(null);

                onCopy?.(text);

                return true;
            } catch (err) {
                const e = err instanceof Error ? err : new Error("Failed to copy");

                setStatus("error");
                setError(e);

                onError?.(e);

                return false;
            }
        },
        [onCopy, onError]
    );

    const read = useCallback(async () => {
        try {
            const text = await navigator.clipboard.readText();

            setCopiedText(text);
            setStatus("success");
            setError(null);

            return text;
        } catch (err) {
            const e = err instanceof Error ? err : new Error("Failed to read clipboard");

            setStatus("error");
            setError(e);

            onError?.(e);

            return null;
        }
    }, [onError]);

    const reset = useCallback(() => {
        setCopiedText("");
        setStatus("idle");
        setError(null);
    }, []);

    return {
        copiedText,
        status,
        error,
        copy,
        read,
        reset,
    };
};

export default useClipboard;