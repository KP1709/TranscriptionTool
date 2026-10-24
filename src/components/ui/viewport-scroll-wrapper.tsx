import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type ViewportScrollWrapperProps = {
    children: React.ReactNode;
    className?: string;
    scrollAreaClassName?: string;
    scrollDependencies?: readonly unknown[];
    onViewportScroll?: React.UIEventHandler<HTMLDivElement>;
    showScrollToBottomButton?: boolean;
    scrollToBottomButtonLabel?: string | React.ReactNode;
    scrollToBottomButtonLabelAriaLabel?: string;
    scrollToBottomButtonClassName?: string;
    threshold?: number;
    autoScrollEnabled?: boolean;
};

const ViewportScrollWrapper = ({
    children,
    className,
    scrollAreaClassName,
    scrollDependencies = [],
    onViewportScroll,
    showScrollToBottomButton = false,
    scrollToBottomButtonLabel = "Scroll to latest",
    scrollToBottomButtonClassName,
    threshold = 80,
    autoScrollEnabled = true,
    scrollToBottomButtonLabelAriaLabel = ''
}: ViewportScrollWrapperProps) => {
    const viewportRef = useRef<HTMLDivElement | null>(null);
    const [showScrollToBottom, setShowScrollToBottom] = useState(false);
    const [isFollowingLatest, setIsFollowingLatest] = useState(true);

    const scrollToBottom = useCallback((behavior: ScrollBehavior = "auto") => {
        const viewport = viewportRef.current;
        if (!viewport) return;

        viewport.scrollTo({ top: viewport.scrollHeight, behavior });
        setShowScrollToBottom(false);
        setIsFollowingLatest(true);
    }, []);

    const handleViewportScroll = useCallback(
        (event: React.UIEvent<HTMLDivElement>) => {
            const viewport = viewportRef.current;
            if (!viewport) return;

            const distanceFromBottom = viewport.scrollHeight - (viewport.scrollTop + viewport.clientHeight);
            const isNearBottom = distanceFromBottom <= threshold;

            if (isNearBottom) {
                setShowScrollToBottom(false);
                setIsFollowingLatest(true);
            } else {
                setShowScrollToBottom(true);
                setIsFollowingLatest(false);
            }

            onViewportScroll?.(event);
        },
        [onViewportScroll, threshold]
    );

    useEffect(() => {
        if (!autoScrollEnabled || !isFollowingLatest) return;

        const frame = window.requestAnimationFrame(() => {
            scrollToBottom("auto");
        });

        return () => window.cancelAnimationFrame(frame);
    }, [autoScrollEnabled, isFollowingLatest, scrollDependencies, scrollToBottom]);

    return (
        <div className={cn("relative", className)}>
            <ScrollArea
                className={scrollAreaClassName}
                viewportRef={viewportRef}
                onViewportScroll={handleViewportScroll}
                enableAutoScroll
            >
                {children}
            </ScrollArea>

            {showScrollToBottomButton && showScrollToBottom && (
                <Button
                    type="button"
                    variant="secondary"
                    className={cn("absolute bottom-4 right-4 rounded-full shadow-lg cursor-pointer", scrollToBottomButtonClassName)}
                    onClick={() => scrollToBottom("smooth")}
                    aria-label={scrollToBottomButtonLabelAriaLabel}
                >
                    {scrollToBottomButtonLabel}
                </Button>
            )}
        </div>
    );
};

export default ViewportScrollWrapper;
