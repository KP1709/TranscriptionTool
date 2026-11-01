import { Marker, MarkerContent } from "@/components/ui/marker";
import SpeakerBadge from "@/components/custom/speakerBadge";
import ViewportScrollWrapper from "@/components/ui/viewport-scroll-wrapper";
import type { TranscriptSegment } from "@/types";

type TranscriptProps = {
    segments: TranscriptSegment[];
    rawTranscript: string;
    isRecording: boolean;
    isSessionActive: boolean;
    speakerLabels: Record<string, string>;
};

const formatTimestamp = (timestamp: number) => {
    const totalSeconds = Math.floor(timestamp);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
};

const Transcript = ({ segments, rawTranscript, isRecording, isSessionActive, speakerLabels }: TranscriptProps) => {
    const hasTranscriptStarted = segments.length > 0 || rawTranscript.trim().length > 0;
    const shouldShowStoppedMessage = !isRecording && isSessionActive && hasTranscriptStarted;

    return (
        <div className="relative">
            <ViewportScrollWrapper
                className="h-[65vh] pr-3 md:h-[85vh]"
                scrollAreaClassName="h-full"
                showScrollToBottomButton
                scrollDependencies={[segments.length, rawTranscript]}
            >
                <div>
                    {!rawTranscript && (
                        <Marker>
                            <MarkerContent>Waiting for speech...</MarkerContent>
                        </Marker>
                    )}

                    {rawTranscript && segments.map((segment, index) => (
                        <div key={segment.id} className="mb-4">
                            <SpeakerBadge speakerCode={segment.speaker} customLabel={speakerLabels[segment.speaker]} timestamp={formatTimestamp(segment.timestamp)} />
                            <p>
                                <span>{segment.text}</span>
                                {index === segments.length - 1 && segment.partialText && (
                                    <span className="font-extrabold"> {segment.partialText}</span>
                                )}
                            </p>
                        </div>
                    ))}

                    {shouldShowStoppedMessage && (
                        <Marker variant="separator" role="status">
                            <MarkerContent>Transcription has stopped</MarkerContent>
                        </Marker>
                    )}
                </div>
            </ViewportScrollWrapper>
        </div>
    );
};

export default Transcript;
