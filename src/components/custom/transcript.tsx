import { Marker, MarkerContent } from "@/components/ui/marker";
import SpeakerBadge from "@/components/custom/speakerBadge";
import ViewportScrollWrapper from "@/components/ui/viewport-scroll-wrapper";
import type { TranscriptSegment } from "@/types";

type TranscriptProps = {
    segments: TranscriptSegment[];
    rawTranscript: string;
    socketState?: string | null;
    speakerLabels: Record<string, string>;
};

const Transcript = ({ segments, rawTranscript, socketState, speakerLabels }: TranscriptProps) => {
    return (
        <div className="relative">
            <ViewportScrollWrapper
                className="h-[65vh] pr-3"
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
                            <SpeakerBadge speakerCode={segment.speaker} customLabel={speakerLabels[segment.speaker]} />
                            <p>
                                <span>{segment.text}</span>
                                {index === segments.length - 1 && segment.partialText && (
                                    <span className="font-extrabold"> {segment.partialText}</span>
                                )}
                            </p>
                        </div>
                    ))}

                    {socketState === "closed" && (
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
