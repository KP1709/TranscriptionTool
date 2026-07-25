import { Button } from "@/components/ui/button";
import useLiveTranscript from "@/hooks/useLiveTranscript";
import useCountdownTimer from "@/hooks/useCountdownTimer";
import { useEffect, useState } from "react";
import CountdownTimer from "./countdownTimer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoggerConsole from "./logger";
import Speaker from "./TabScreens/speaker";
import Settings from "./TabScreens/settings";
import Transcript from "./transcript";
import type { TranscriptSettingsType } from "@/types";
import useMicrophonePermissions from "@/hooks/useMicrophonePermissions";
import { logger } from "@/lib/logger";
import useBreakpoint from "@/hooks/useBreakpoint";

const Transcription = () => {
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
        socketState,
        start: startTranscribing,
        stop: stopTranscribing,
        segments,
        rawTranscript,
        isSessionActive,
    } = useLiveTranscript(liveTrancriptSettings);

    const width = useBreakpoint();
    const { reset, start: startTimer, stop: stopTimer, minutes, seconds } = useCountdownTimer(120);
    const { error, requestPermission } = useMicrophonePermissions();
    const [speakerLabels, setSpeakerLabels] = useState<Record<string, string>>({});
    const [isSettingUp, setIsSettingUp] = useState(false);

    useEffect(() => {
        reset();
    }, []);


    const handleStartRecording = async () => {
        setIsSettingUp(true);
        const nextPermissionState = await requestPermission();

        if (nextPermissionState !== 'granted') {
            logger.log('[AUDIO] - Microphone permission not granted');
            return;
        }

        if (error) {
            logger.log('[AUDIO] - Microphone error', `${error}`);
            return;
        }

        const isTranscriptionStart = await startTranscribing();

        if (isTranscriptionStart) {
            startTimer();
        }

        setIsSettingUp(false);
    };

    const handleStopRecording = () => {
        stopTranscribing();
        stopTimer();
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
                                    socketState={socketState}
                                    speakerLabels={speakerLabels}
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
                        <div className='flex flex-row items-center justify-between h-[5vh]'>
                            <Button variant='default' onClick={isRecording ? handleStopRecording : handleStartRecording}>
                                {isRecording ? "Stop" : "Start"} Transcribing
                                {isSettingUp && "..."}
                            </Button>

                            <span className='mr-8'>
                                <CountdownTimer minutes={minutes} seconds={seconds} stopTranscribing={stopTranscribing} />
                            </span>
                        </div>
                    </Tabs>
                    <div className='p-2'>
                        <Transcript
                            segments={segments}
                            rawTranscript={rawTranscript}
                            socketState={socketState}
                            speakerLabels={speakerLabels}
                        />
                    </div>
                </div>
            )}

            {isMobile && (
                <div className='flex flex-row items-center justify-between h-[5vh]'>
                    <Button variant='default' onClick={isRecording ? handleStopRecording : handleStartRecording}>
                        {isRecording ? "Stop" : "Start"} Transcribing
                        {isSettingUp && "..."}
                    </Button>

                    <span className='mr-8'>
                        <CountdownTimer minutes={minutes} seconds={seconds} stopTranscribing={stopTranscribing} />
                    </span>
                </div>
            )}
        </div>
    );
};

export default Transcription;