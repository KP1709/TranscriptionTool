import { useCallback, useState } from "react";

type DownloadStatus = "idle" | "downloading" | "success" | "error";

const useFileDownload = () => {
    const [status, setStatus] = useState<DownloadStatus>("idle");
    const [error, setError] = useState<Error | null>(null);

    const downloadFile = useCallback(
        (text: string, filename: string, mimeType: string) => {
            setStatus("downloading");
            setError(null);

            try {
                const blob = new Blob([text], { type: mimeType });
                const url = URL.createObjectURL(blob);

                const link = document.createElement("a");
                link.href = url;
                link.download = filename;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                URL.revokeObjectURL(url);

                setStatus("success");
            } catch (err) {
                const error =
                    err instanceof Error ? err : new Error("Failed to download file");

                setError(error);
                setStatus("error");
            }
        },
        []
    );

    const saveAsTxt = useCallback(
        (text: string, filename = "document.txt") => {
            downloadFile(text, filename, "text/plain;charset=utf-8");
        },
        [downloadFile]
    );

    const saveAsMarkdown = useCallback(
        (text: string, filename = "document.md") => {
            downloadFile(text, filename, "text/markdown;charset=utf-8");
        },
        [downloadFile]
    );

    const saveAsJson = useCallback(
        (data: object, filename = "document.json") => {
            const jsonString = JSON.stringify(data, null, 2);
            downloadFile(jsonString, filename, "application/json;charset=utf-8");
        },
        [downloadFile]
    );

    const reset = useCallback(() => {
        setStatus("idle");
        setError(null);
    }, []);

    return {
        saveAsTxt,
        saveAsMarkdown,
        saveAsJson,
        status,
        error,
        isIdle: status === "idle",
        isDownloading: status === "downloading",
        isSuccess: status === "success",
        isError: status === "error",
        reset,
    };
};

export default useFileDownload;