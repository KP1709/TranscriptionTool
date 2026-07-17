export type TranscriptSettingsType = {
    model: 'standard' | 'enhanced';
    maxDelay: number;
    domain: 'general' | 'medical' | 'finance';
    isFilterWordsRemoved: boolean;
    noSpeakers: number;
    speakerSensitivity: number;
    isPartialTranscriptShown: boolean;
};

export type TranscriptSegment = {
    id: string;
    speaker: string;
    text: string;
    partialText?: string | null;
};