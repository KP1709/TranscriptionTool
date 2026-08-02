import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useMemo, type Dispatch, type SetStateAction } from "react";
import { getDefaultSpeakerLabel } from "../speakerBadge";
import type { TranscriptSegment } from "@/types";

type SpeakerProps = {
    noSpeakers: number;
    segments: TranscriptSegment[];
    setSpeakerLabels: Dispatch<SetStateAction<Record<string, string>>>;
    speakerLabels: Record<string, string>;
    isFinal?: boolean;
};

const Speaker = ({ noSpeakers, segments, setSpeakerLabels, speakerLabels }: SpeakerProps) => {
    const speakerCodes = useMemo(() => {
        const codes = new Set<string>(['UU']);

        segments.forEach((segment) => {
            if (segment.speaker) {
                codes.add(segment.speaker);
            }
        });

        for (let index = 1; index <= noSpeakers; index += 1) {
            codes.add(`S${index}`);
        }

        return Array.from(codes).sort((left, right) => {
            if (left === 'UU') return 1;
            if (right === 'UU') return -1;

            return Number(left.slice(1)) - Number(right.slice(1));
        });
    }, [noSpeakers, segments]);

    useEffect(() => {
        setSpeakerLabels((prev) => {
            const nextLabels = { ...prev };
            let hasChanged = false;

            speakerCodes.forEach((speakerCode) => {
                if (!(speakerCode in nextLabels)) {
                    nextLabels[speakerCode] = getDefaultSpeakerLabel(speakerCode);
                    hasChanged = true;
                }
            });

            return hasChanged ? nextLabels : prev;
        });
    }, [setSpeakerLabels, speakerCodes]);

    const updateSpeakerLabel = (speakerCode: string, value: string) => {
        setSpeakerLabels((prev) => ({ ...prev, [speakerCode]: value }));
    };

    return (
        <ScrollArea className='h-[60vh]'>
            {speakerCodes.map((speakerCode) => (
                <label key={speakerCode} className="flex flex-col py-2">
                    <span className="text-sm font-medium">{getDefaultSpeakerLabel(speakerCode)}</span>
                    <Input
                        value={speakerLabels[speakerCode] ?? ''}
                        onChange={(event) => updateSpeakerLabel(speakerCode, event.target.value)}
                    />
                </label>
            ))}
        </ScrollArea>
    );
};

export default Speaker;