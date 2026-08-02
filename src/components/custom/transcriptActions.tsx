import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsThreeIcon } from "@phosphor-icons/react";

import CountdownTimer from "./countdownTimer";
import React from "react";

type TranscriptActionsProps = {
    isRecording: boolean;
    isSessionActive: boolean;
    isSettingUp?: boolean | null;
    minutes: number;
    seconds: number;
    onStartRecording: () => void;
    onStopRecording: () => void;
    stopTranscribing: () => void;
    onCopyTranscript: () => void;
    onSaveMarkdown: () => void;
    onSaveTxt: () => void;
    onSaveJson: () => void;
};

const TranscriptActions = ({
    isRecording,
    isSessionActive,
    isSettingUp = false,
    minutes,
    seconds,
    onStartRecording,
    onStopRecording,
    stopTranscribing,
    onCopyTranscript,
    onSaveMarkdown,
    onSaveTxt,
    onSaveJson
}: TranscriptActionsProps) => {
    const dropdownItems = [
        { label: 'Save as .md', onClick: onSaveMarkdown },
        { label: 'Save as .txt', onClick: onSaveTxt },
        { label: 'Save as .json', onClick: onSaveJson },
    ];

    return (
        <div className='grid grid-cols-2 grid-rows-2 gap-1 h-18.75 justify-items-center'>
            <Button
                className='row-1 col-1 cursor-pointer'
                variant='default'
                onClick={isRecording ? onStopRecording : onStartRecording}>
                {isRecording ? "Stop" : "Start"} Transcribing
                {isSettingUp && "..."}
            </Button>

            <ButtonGroup className={`row-1 col-2 ${!isSessionActive ? 'cursor-not-allowed' : ''}`}>
                <Button
                    disabled={!isSessionActive}
                    variant='secondary'
                    onClick={() => onCopyTranscript()}
                    className='cursor-pointer'>
                    Copy transcript
                </Button>
                <ButtonGroupSeparator />
                <DropdownMenu closeParentOnEsc>
                    <DropdownMenuTrigger render={
                        <Button
                            disabled={!isSessionActive}
                            variant='secondary'
                            size='icon'
                            className='cursor-pointer'>
                            <DotsThreeIcon />
                        </Button>
                    } />
                    <DropdownMenuContent>
                        <DropdownMenuGroup>
                            {dropdownItems.map((item, index) => (
                                <React.Fragment key={item.label}>
                                    <DropdownMenuItem
                                        className='cursor-pointer'
                                        onClick={() => item.onClick()}>
                                        {item.label}
                                    </DropdownMenuItem>
                                    {index < dropdownItems.length - 1 && <DropdownMenuSeparator />}
                                </React.Fragment>
                            ))}
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </ButtonGroup>

            <span className='row-2 col-span-2 items-center'>
                <CountdownTimer minutes={minutes} seconds={seconds} stopTranscribing={stopTranscribing} />
            </span>
        </div >
    );
};

export default TranscriptActions;
