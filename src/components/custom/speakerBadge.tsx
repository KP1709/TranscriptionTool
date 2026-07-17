import { Badge } from "@/components/ui/badge";

type Speaker = `S${number}` | 'UU';

const SpeakerColourMap: Record<Speaker, string> = {
    'S1': 'border-cyan-500',
    'S2': 'border-rose-500',
    'S3': 'border-indigo-500',
    'S4': 'border-teal-500',
    'S5': 'border-red-500',
    'S6': 'border-lime-500',
    'UU': 'border-slate-500'
};

export const getDefaultSpeakerLabel = (speakerCode: string) => {
    if (speakerCode === 'UU') return 'Unknown';

    const speakerNumber = speakerCode.match(/^S(\d+)$/)?.[1];
    return speakerNumber ? `Speaker ${speakerNumber}` : speakerCode;
};

export const getSpeakerDisplayName = (speakerCode: string, customLabel?: string) => {
    const trimmedLabel = customLabel?.trim();

    if (trimmedLabel) return trimmedLabel;

    return getDefaultSpeakerLabel(speakerCode);
};

const SpeakerBadge = ({ speakerCode, customLabel }: { speakerCode: string; customLabel?: string; }) => (
    <div className="flex items-center gap-3 mb-3">
        <Badge className={`text-[12px] bg-transparent  text-slate-950 border-2 p-3 ${SpeakerColourMap[speakerCode as Speaker]}`}>
            {getSpeakerDisplayName(speakerCode, customLabel)}
        </Badge>

        <div className="h-px flex-1 bg-border" />
    </div>
);

export default SpeakerBadge;