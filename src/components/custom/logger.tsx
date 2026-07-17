import { useEffect, useState } from "react";
import { logger, type LoggerEntry } from "@/lib/logger";
import ViewportScrollWrapper from "@/components/ui/viewport-scroll-wrapper";
import { Marker, MarkerContent } from "@/components/ui/marker";

const LoggerConsole = () => {
    const [logs, setLogs] = useState<LoggerEntry[]>([]);
    const [openLogIndices, setOpenLogIndices] = useState<Set<number>>(new Set());

    useEffect(() => {
        return logger.subscribe(setLogs);
    }, []);

    const toggleLogOpen = (index: number, isOpen: boolean) => {
        setOpenLogIndices((current) => {
            const next = new Set(current);

            if (isOpen) {
                next.add(index);
            } else {
                next.delete(index);
            }

            return next;
        });
    };

    const LogDisplay = () => {
        if (logs.length === 0) {
            return (
                <div className="flex min-w-0 flex-col gap-2 p-2 h-[7-vh]">
                    <Marker>
                        <MarkerContent>
                            No logs recorded
                        </MarkerContent>
                    </Marker>
                </div>
            );
        }

        return (
            <div className="flex min-w-0 flex-col gap-2 p-2">
                {logs.map((log, i) => (
                    <div key={i} className="min-w-0">
                        <details
                            open={openLogIndices.has(i)}
                            onToggle={(event) => toggleLogOpen(i, event.currentTarget.open)}
                            className="w-full max-w-full overflow-hidden rounded-md border border-dashed border-slate-300 p-2"
                        >
                            <summary className="cursor-pointer wrap-break-word text-[0.8rem]">
                                {log.message}{!!log.secondary?.length ? ` - (${log.secondary?.length})` : ''}
                            </summary>
                            {log.secondary &&
                                <div className="mt-2 min-w-0">
                                    {log.secondary.map((detail, detailIndex) => (
                                        <pre key={detailIndex} className="overflow-x-hidden whitespace-pre-wrap wrap-break-word text-[0.8rem] text-slate-600">
                                            {detail}
                                        </pre>
                                    ))}
                                </div>}
                        </details>
                    </div>))}
            </div>
        );
    };

    return (
        <div className="w-full min-w-0">
            <ViewportScrollWrapper
                className="w-full max-w-full h-[70vh] pr-2"
                scrollAreaClassName="h-full"
                showScrollToBottomButton
                scrollDependencies={[logs.length]}
            >
                <LogDisplay />
            </ViewportScrollWrapper>
        </div>
    );
};

export default LoggerConsole;