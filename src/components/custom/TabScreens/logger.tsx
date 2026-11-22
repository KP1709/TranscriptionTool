import { useEffect, useState } from "react";
import { logger, type LoggerEntry } from "@/lib/logger";
import ViewportScrollWrapper from "@/components/ui/viewport-scroll-wrapper";
import { Marker, MarkerContent } from "@/components/ui/marker";
import {
    TraceCollapsible,
    TraceCollapsibleContent,
    TraceCollapsibleTrigger,
    TraceIcon,
    TraceLine,
    TraceTitle,
} from "@/components/ui/trace";
import { ArrowDownIcon } from "@phosphor-icons/react";


const LogDisplay = ({ logs }: { logs: LoggerEntry[]; }) => {
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
                    <div className="w-full max-w-sm">
                        {log.secondary &&
                            <TraceCollapsible>
                                <TraceCollapsibleTrigger>
                                    <TraceLine>
                                        <TraceIcon>
                                            {log.icon}
                                        </TraceIcon>
                                        <TraceTitle>{log.message}</TraceTitle>
                                    </TraceLine>
                                </TraceCollapsibleTrigger>
                                <TraceCollapsibleContent>
                                    {log.secondary.map((detail, detailIndex) => (
                                        <pre key={detailIndex} className="overflow-x-hidden whitespace-pre-wrap wrap-break-word text-[0.8rem] text-slate-600">
                                            {detail}
                                        </pre>
                                    ))}
                                </TraceCollapsibleContent>
                            </TraceCollapsible>}

                        {!log.secondary &&
                            <TraceLine>
                                <TraceIcon>
                                    {log.icon}
                                </TraceIcon>
                                <TraceTitle>{log.message}</TraceTitle>
                            </TraceLine>
                        }

                    </div>
                </div>))}
        </div>
    );
};

const LoggerConsole = () => {
    const [logs, setLogs] = useState<LoggerEntry[]>([]);

    useEffect(() => {
        return logger.subscribe(setLogs);
    }, []);

    return (
        <div className="w-full min-w-0">
            <ViewportScrollWrapper
                className="w-full max-w-full h-[70vh] pr-2"
                scrollAreaClassName="h-full"
                showScrollToBottomButton={true}
                scrollToBottomButtonLabel={<ArrowDownIcon />}
                scrollToBottomButtonLabelAriaLabel="Scroll to bottom"
                scrollToBottomButtonClassName="bg-primary text-white hover:bg-primary/80"
                scrollDependencies={[logs.length]}
                autoScrollEnabled={false}
            >
                <LogDisplay logs={logs} />
            </ViewportScrollWrapper>
        </div>
    );
};

export default LoggerConsole;