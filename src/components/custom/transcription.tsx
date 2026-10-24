import { useEffect, useMemo, useState } from "react";

import {
    CheckCircleIcon,
    ClipboardTextIcon,
    ClockCountdownIcon,
    DownloadSimpleIcon,
    FloppyDiskIcon,
    MicrophoneSlashIcon,
    WarningCircleIcon
} from "@phosphor-icons/react";

import LoggerConsole from "./logger";
import Speaker from "./TabScreens/speaker";
import Settings from "./TabScreens/settings";
import Transcript from "./transcript";
import TranscriptActions from "./transcriptActions";

import { logger } from "@/lib/logger";
import type { TranscriptSettingsType } from "@/types";

import useMicrophonePermissions from "@/hooks/useMicrophonePermissions";
import useLiveTranscript from "@/hooks/useLiveTranscript";
import useCountdownTimer from "@/hooks/useCountdownTimer";
import useBreakpoint from "@/hooks/useBreakpoint";
import useClipboard from "@/hooks/useClipboard";
import useFileDownload from "@/hooks/useFileDownload";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Transcription = () => {
    const [speakerLabels, setSpeakerLabels] = useState<Record<string, string>>({});
    const [isSettingUp, setIsSettingUp] = useState<boolean | null>(null);
    const [liveTrancriptSettings, setLiveTranscriptSettings] = useState<TranscriptSettingsType>({
        model: 'standard',
        maxDelay: 0.7,
        domain: 'general',
        isFilterWordsRemoved: false,
        noSpeakers: 2,
        speakerSensitivity: 0.5,
        isPartialTranscriptShown: false,
        hideCurseWords: true
    });

    const {
        isRecording,
        start: startTranscribing,
        stop: stopTranscribing,
        segments,
        isSessionActive,
    } = useLiveTranscript(liveTrancriptSettings);

    const width = useBreakpoint();
    const { reset, start: startTimer, stop: stopTimer, minutes, seconds } = useCountdownTimer(120);
    const { copy, error: copyError } = useClipboard();
    const { error, requestPermission } = useMicrophonePermissions();
    const { saveAsMarkdown, saveAsTxt, saveAsJson, isDownloading, isError, error: downloadError } = useFileDownload();


    const rawTranscript = useMemo(() => {
        return segments
            .map(segment => `[${speakerLabels[segment.speaker] ?? segment.speaker}]: ${segment.text}`)
            .join("\n\n");
    }, [segments, speakerLabels]);

    useEffect(() => {
        reset();
    }, []);

    const handleStartRecording = async () => {
        if (minutes === 0 && seconds === 0) {
            logger.log('[ACTION] - Timer has expired', 'Unable to start recording', <ClockCountdownIcon />);
            return;
        };
        setIsSettingUp(true);
        const nextPermissionState = await requestPermission();

        if (nextPermissionState !== 'granted') {
            logger.log('[AUDIO] - Microphone permission not granted', '', <MicrophoneSlashIcon />);
            return;
        }

        if (error) {
            logger.log('[AUDIO] - Microphone error', `${error}`, <MicrophoneSlashIcon />);
            return;
        }

        const isTranscriptionStart = await startTranscribing();

        if (isTranscriptionStart) startTimer();

        setIsSettingUp(false);
    };

    const handleStopRecording = () => {
        stopTranscribing();
        stopTimer();
    };

    const handleRawTranscript = async (action: string) => {
        if (!isSessionActive) return;
        if (isDownloading) logger.log('[ACTION] - Downloading transcript in progress', '', <DownloadSimpleIcon />);

        if (action === 'copy') {
            try {
                await copy(rawTranscript);
                logger.log('[ACTION] - Copied transcript', '', <ClipboardTextIcon />);
            } catch {
                logger.log('[ACTION][COPY] - Error in copying transcript', String(copyError), <WarningCircleIcon />);
            }
            return;
        }

        if (action === 'save-md') {
            logger.log('[ACTION][SAVE] - Save transcript in markdown file', '', <FloppyDiskIcon />);
            saveAsMarkdown(rawTranscript, 'transcript.md');
            if (isError) logger.log('[ACTION][SAVE] - Error in saving markdown file', String(downloadError), <WarningCircleIcon />);
            if (!isDownloading) logger.log('[ACTION][SAVE] - Transcript saved successfully', '', <CheckCircleIcon />);
            return;
        }

        if (action === 'save-txt') {
            logger.log('[ACTION][SAVE] - Save transcript in text file', '', <FloppyDiskIcon />);
            saveAsTxt(rawTranscript, 'transcript.txt');
            if (isError) logger.log('[ACTION][SAVE] - Error in saving text file', String(downloadError), <WarningCircleIcon />);
            if (!isDownloading) logger.log('[ACTION][SAVE] - Transcript saved successfully', '', <CheckCircleIcon />);
            return;
        }

        if (action === 'save-json') {
            logger.log('[ACTION][SAVE] - Save transcript in JSON file', '', <FloppyDiskIcon />);
            const transcriptData = {
                segments: segments,
                speakerLabels: speakerLabels
            };
            saveAsJson(transcriptData, 'transcript.json');
            if (isError) logger.log('[ACTION][SAVE] - Error in saving JSON file', String(downloadError), <WarningCircleIcon />);
            if (!isDownloading) logger.log('[ACTION][SAVE] - Transcript saved successfully', '', <CheckCircleIcon />);
        }
    };

    const isMobile = width < 768;

    return (
        <div className='h-[85vh]'>
            {isMobile ? (
                <div className='flex flex-col justify-between'>
                    <Tabs defaultValue="transcript">
                        <TabsList className="w-full">
                            <TabsTrigger value="transcript">Transcript</TabsTrigger>
                            <TabsTrigger value="speaker">Speaker</TabsTrigger>
                            <TabsTrigger value="logging">Logging</TabsTrigger>
                            <TabsTrigger value="settings">Settings</TabsTrigger>
                        </TabsList>

                        <div className='h-[75vh] p-1'>
                            <TabsContent value="transcript">
                                <Transcript
                                    segments={segments}
                                    rawTranscript={rawTranscript}
                                    isRecording={isRecording}
                                    speakerLabels={speakerLabels}
                                    isSessionActive={isSessionActive}
                                />
                            </TabsContent>

                            <TabsContent value="speaker">
                                <Speaker
                                    noSpeakers={liveTrancriptSettings.noSpeakers}
                                    segments={segments}
                                    speakerLabels={speakerLabels}
                                    setSpeakerLabels={setSpeakerLabels}
                                />
                            </TabsContent>

                            <TabsContent value="logging">
                                <LoggerConsole />
                            </TabsContent>

                            <TabsContent value="settings">
                                <Settings
                                    settings={liveTrancriptSettings}
                                    setSettings={setLiveTranscriptSettings}
                                    isSessionActive={isSessionActive}
                                />
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            ) : (
                <div className='grid grid-cols-[1fr_2fr] border-r-2'>
                    <Tabs defaultValue="settings" className='border-r-2'>
                        <TabsList className="w-full">
                            <TabsTrigger value="speaker">Speaker</TabsTrigger>
                            <TabsTrigger value="logging">Logging</TabsTrigger>
                            <TabsTrigger value="settings">Settings</TabsTrigger>
                        </TabsList>

                        <div className='h-[75vh] p-1'>
                            <TabsContent value="speaker">
                                <Speaker
                                    noSpeakers={liveTrancriptSettings.noSpeakers}
                                    segments={segments}
                                    speakerLabels={speakerLabels}
                                    setSpeakerLabels={setSpeakerLabels}
                                />
                            </TabsContent>

                            <TabsContent value="logging">
                                <LoggerConsole />
                            </TabsContent>

                            <TabsContent value="settings">
                                <Settings
                                    settings={liveTrancriptSettings}
                                    setSettings={setLiveTranscriptSettings}
                                    isSessionActive={isSessionActive}
                                />
                            </TabsContent>
                        </div>

                        <TranscriptActions
                            isRecording={isRecording}
                            isSessionActive={isSessionActive}
                            isSettingUp={isSettingUp}
                            minutes={minutes}
                            seconds={seconds}
                            onStartRecording={handleStartRecording}
                            onStopRecording={handleStopRecording}
                            stopTranscribing={stopTranscribing}
                            onCopyTranscript={() => handleRawTranscript('copy')}
                            onSaveMarkdown={() => handleRawTranscript('save-md')}
                            onSaveTxt={() => handleRawTranscript('save-txt')}
                            onSaveJson={() => handleRawTranscript('save-json')}
                        />

                    </Tabs>
                    <div className='p-2'>
                        <Transcript
                            segments={segments}
                            rawTranscript={rawTranscript}
                            isRecording={isRecording}
                            speakerLabels={speakerLabels}
                            isSessionActive={isSessionActive}
                        />
                    </div>
                </div>
            )}

            {isMobile && (
                <TranscriptActions
                    isRecording={isRecording}
                    isSessionActive={isSessionActive}
                    isSettingUp={isSettingUp}
                    minutes={minutes}
                    seconds={seconds}
                    onStartRecording={handleStartRecording}
                    onStopRecording={handleStopRecording}
                    stopTranscribing={stopTranscribing}
                    onCopyTranscript={() => handleRawTranscript('copy')}
                    onSaveMarkdown={() => handleRawTranscript('save-md')}
                    onSaveTxt={() => handleRawTranscript('save-txt')}
                    onSaveJson={() => handleRawTranscript('save-json')}
                />
            )}
        </div>
    );
};

export default Transcription;