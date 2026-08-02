import { Badge } from "@/components/ui/badge";

const SPEAKER_BORDER_COLORS = [
    'border-cyan-500',
    'border-rose-500',
    'border-indigo-500',
    'border-teal-500',
    'border-red-500',
    'border-lime-500',
    'border-amber-500',
    'border-violet-500',
    'border-sky-500',
    'border-fuchsia-500',
];

const getSpeakerBorderColor = (speakerCode: string) => {
    if (speakerCode === 'UU') return 'border-slate-500';

    const speakerNumber = Number.parseInt(speakerCode.match(/^S(\d+)$/)?.[1] ?? '', 10);
    if (!Number.isFinite(speakerNumber)) return 'border-slate-500';

    return SPEAKER_BORDER_COLORS[Math.abs(speakerNumber) % SPEAKER_BORDER_COLORS.length];
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
        <Badge className={`text-[12px] bg-transparent text-slate-950 border-2 p-3 ${getSpeakerBorderColor(speakerCode)}`}>
            {getSpeakerDisplayName(speakerCode, customLabel)}
        </Badge>

        <div className="h-px flex-1 bg-border" />
    </div>
);

export default SpeakerBadge;