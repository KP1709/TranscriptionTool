import { useCallback, useEffect, useRef, useState } from "react";
import { useRealtimeTranscription, useRealtimeEventListener, } from "@speechmatics/real-time-client-react";
import { usePCMAudioRecorderContext, usePCMAudioListener, } from "@speechmatics/browser-audio-input-react";
import { logger } from "@/lib/logger";
import type { TranscriptSegment, TranscriptSettingsType } from "@/types";

const SAMPLE_RATE = 16000;

const useLiveTranscript = ({ ...liveTranscriptSettings }: TranscriptSettingsType) => {
    const [segments, setSegments] = useState<TranscriptSegment[]>([]);
    const currentSpeakerRef = useRef("Unknown");
    const [currentSpeaker, setCurrentSpeaker] = useState("Unknown");
    const {
        model,
        maxDelay,
        domain,
        isFilterWordsRemoved,
        noSpeakers,
        speakerSensitivity,
        isPartialTranscriptShown,
        hideCurseWords
    } = liveTranscriptSettings;

    const {
        startTranscription,
        stopTranscription,
        sendAudio,
        socketState,
        sessionId
    } = useRealtimeTranscription();

    const isSessionActive = Boolean(sessionId) && socketState !== 'closed';

    const { startRecording, stopRecording, isRecording } = usePCMAudioRecorderContext();

    useEffect(() => {
        if (!socketState) return;
        logger.log('[SPEECHMATICS][SocketState]', `Status:${socketState}`);
    }, [socketState]);

    useEffect(() => {
        if (!sessionId) return;
        logger.log('[SPEECHMATICS][SessionId]', `Session id:${sessionId}`);
    }, [sessionId]);

    useRealtimeEventListener("receiveMessage", (event) => {
        const message = event.data;
        if (!message) return;

        switch (message.message) {
            case "RecognitionStarted":
                logger.log("[SPEECHMATICS][RecognitionStarted]");
                break;
            case "AudioAdded":
                // logger.log("[SPEECHMATICS][AudioAdded]");
                break;
            case "Error":
                logger.log("[SPEECHMATICS][Error]", `${message.reason}`);
                break;
            case "Warning":
                logger.log("[SPEECHMATICS][Warning]", `${message.reason}`);
                break;
            case "Info":
                logger.log("[SPEECHMATICS][Info]", `${message.reason}`);
                break;
            case "EndOfTranscript":
                logger.log("[SPEECHMATICS][EndOfTranscript]");
                break;

            case "AddTranscript":
                const detectedSpeaker =
                    message.results?.[0]?.alternatives?.[0]?.speaker;

                const speaker = detectedSpeaker ?? currentSpeakerRef.current;

                if (detectedSpeaker) {
                    currentSpeakerRef.current = detectedSpeaker;
                    setCurrentSpeaker(detectedSpeaker);
                }

                const isProfanity = message.results?.[0]?.alternatives?.[0].tags?.includes('profanity');
                const text = isProfanity && hideCurseWords ? '*****' : message.metadata.transcript.trim();

                setSegments(prev => {
                    if (!text) return prev;

                    const clearedSegments = prev.map(segment => ({ ...segment, partialText: null }));
                    const lastSegment = clearedSegments[clearedSegments.length - 1];

                    // Extend current turn if same speaker
                    if (lastSegment?.speaker === speaker) {
                        return [...clearedSegments.slice(0, -1),
                        { ...lastSegment, text: `${lastSegment.text} ${text}`.trim(), isFinal: false, partialText: null }
                        ];
                    }

                    // Speaker changed -> start a new turn.
                    logger.log("[SPEECHMATICS][AddTranscript]", `Detected speaker change: ${speaker}`);
                    return [...clearedSegments, { speaker, text, id: crypto.randomUUID(), isFinal: true, partialText: null }];
                });
                break;

            case "AddPartialTranscript":
                setSegments(prev => {
                    if (prev.length === 0) return prev;
                    const lastSegment = prev.length - 1;

                    const last = prev[lastSegment];
                    if (!last) return prev;

                    return prev.map((segment, index) => ({
                        ...segment,
                        partialText: index === lastSegment ? message.metadata.transcript : null
                    }));
                });
                break;
        }
    });

    // Send microphone audio to Speechmatics
    // Make sure audio is sent as Float32Array
    usePCMAudioListener((audio) => {
        const audioFloat32ArrayCopy = new Float32Array(audio);
        sendAudio(audioFloat32ArrayCopy);
    });

    const start = useCallback(async () => {
        try {
            if (isRecording) {
                logger.log('[AUDIO] - Recording already active');
                return true;
            }

            if (!sessionId) {
                const response = await fetch(
                    import.meta.env.VITE_JWT_TOKEN_URL
                    // 'http://localhost:3001/api/speechmatics-token' <-- Local server
                );

                const { jwt } = await response.json();

                if (!jwt) {
                    logger.log('[SERVER][Token]', 'Token not valid or generated');
                    return false;
                }
                logger.log('[SERVER][Token]', 'Token generated successfully');

                await startTranscription(jwt, {
                    transcription_config: {
                        model: model,
                        max_delay: maxDelay,
                        language: "en",
                        output_locale: "en-GB",
                        enable_partials: isPartialTranscriptShown,
                        diarization: "speaker",
                        domain: domain === 'general' ? undefined : domain,
                        transcript_filtering_config: {
                            "remove_disfluencies": isFilterWordsRemoved
                        },
                        speaker_diarization_config: {
                            speaker_sensitivity: speakerSensitivity,
                            max_speakers: noSpeakers
                        }
                    },
                    audio_format: {
                        type: "raw",
                        encoding: "pcm_f32le",
                        sample_rate: SAMPLE_RATE,
                    },
                });

                logger.log('[SPEECHMATICS] - Transcription session started');
            }

            await startRecording({
                recordingOptions: { sampleRate: SAMPLE_RATE }
            });

            logger.log("[AUDIO] - Recording started");
            return true;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            logger.log('[SPEECHMATICS] - Transcription failed', errorMessage);
            return false;
        }
    }, [sessionId, isRecording, startTranscription, startRecording, liveTranscriptSettings]);

    const stop = useCallback(async () => {
        if (!isRecording) {
            logger.log('[AUDIO] - Recording already stopped');
            return;
        }

        stopRecording();
        logger.log("[AUDIO] - Recording stopped");
    }, [isRecording, stopRecording]);

    const stopSession = useCallback(async () => {
        stopRecording();
        logger.log("[AUDIO] - Recording stopped");

        await stopTranscription()
            .then(() => logger.log('[SPEECHMATICS] - Transcription session stopped successfully'))
            .catch(() => logger.log('[SPEECHMATICS] - Transcription session not stopped successfully'));
    }, [stopRecording, stopTranscription]);

    return {
        socketState,
        stop,
        stopSession,
        start,
        isRecording,
        segments,
        currentSpeaker,
        isSessionActive,
        sessionId
    };
};

export default useLiveTranscript;