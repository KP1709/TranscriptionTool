export type TranscriptSettingsType = {
    model: 'standard' | 'enhanced';
    maxDelay: number;
    domain: 'general' | 'medical' | 'finance';
    isFilterWordsRemoved: boolean;
    noSpeakers: number;
    speakerSensitivity: number;
    isPartialTranscriptShown: boolean;
    hideCurseWords: boolean;
};

export type TranscriptSegment = {
    id: string;
    speaker: string;
    text: string;
    timestamp: number;
    partialText?: string | null;
};