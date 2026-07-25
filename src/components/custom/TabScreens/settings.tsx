import FieldCheckbox from "../forms/FieldCheckbox";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import { SpinButton } from "@/components/ui/spin-button";
import FieldSelect from "../forms/FieldSelect";
import type { TranscriptSettingsType } from "@/types";

type SettingsProps = {
    settings: TranscriptSettingsType;
    setSettings: (value: React.SetStateAction<TranscriptSettingsType>) => void;
    isSessionActive: boolean;
};

const models = [
    { label: 'Standard', value: 'standard' },
    { label: 'Enhanced', value: 'enhanced' },
];

const domains = [
    { label: 'General', value: 'general' },
    { label: 'Medical', value: 'medical' },
    { label: 'Finance', value: 'finance' }
];

const Settings = ({ settings, setSettings, isSessionActive }: SettingsProps) => {
    const updateSetting = <K extends keyof TranscriptSettingsType>
        (field: K, value: TranscriptSettingsType[K]) => {
        setSettings((prev) => ({ ...prev, [field]: value }));
    };

    const handleModelChange = (value: string) => {
        updateSetting('model', value as TranscriptSettingsType['model']);
    };

    const handleDomainChange = (value: string) => {
        updateSetting('domain', value as TranscriptSettingsType['domain']);
    };

    const handleFilterWordsChange = (checked: boolean | "indeterminate") => {
        updateSetting('isFilterWordsRemoved', checked === true);
    };

    const handlePartialTranscriptChange = (checked: boolean | "indeterminate") => {
        updateSetting('isPartialTranscriptShown', checked === true);
    };

    const handleCurseWordChange = (checked: boolean | "indeterminate") => {
        updateSetting('hideCurseWords', checked === true);
    };

    return (
        <form>
            <p className="text-sm text-muted-foreground mb-4">Once session has started, settings cannot be changed</p>
            <FieldGroup>
                <FieldSet disabled={isSessionActive}>
                    <FieldGroup>
                        <span className='flex gap-1.5'>
                            <FieldSelect
                                id='model'
                                label='Model'
                                items={models}
                                value={settings.model}
                                onValueChange={handleModelChange}
                            />
                            <FieldSelect
                                key={2}
                                id='domain'
                                label='Domain'
                                items={domains}
                                value={settings.domain}
                                onValueChange={handleDomainChange}
                            />
                        </span>
                        <span className='flex gap-1.5'>
                            <FieldCheckbox
                                id="filler"
                                label="Remove filler words"
                                checked={settings.isFilterWordsRemoved}
                                name="filler"
                                defaultChecked={false}
                                onCheckedChange={handleFilterWordsChange}
                                disabled={isSessionActive}
                            />

                            <FieldCheckbox
                                id="partials"
                                label="See partial transcript"
                                checked={settings.isPartialTranscriptShown}
                                name="partials"
                                defaultChecked={false}
                                onCheckedChange={handlePartialTranscriptChange}
                                disabled={isSessionActive}
                            />

                            <FieldCheckbox
                                id="curse"
                                label="Hide curse words"
                                checked={settings.hideCurseWords}
                                name="curse"
                                defaultChecked={false}
                                onCheckedChange={handleCurseWordChange}
                                disabled={isSessionActive}
                            />
                        </span>
                        <span className='flex gap-1.5'>
                            <SpinButton
                                value={settings.noSpeakers}
                                onChange={(noSpeakers) => updateSetting('noSpeakers', noSpeakers)}
                                min={2}
                                max={10}
                                step={1}
                                label='Speakers'
                            />

                            <SpinButton
                                value={settings.maxDelay}
                                onChange={(maxDelay) => updateSetting('maxDelay', maxDelay)}
                                min={0.7}
                                max={4}
                                step={0.1}
                                label='Delay'
                            />

                            <SpinButton
                                value={settings.speakerSensitivity}
                                onChange={(speakerSensitivity) => updateSetting('speakerSensitivity', speakerSensitivity)}
                                min={0.4}
                                max={1.0}
                                step={0.1}
                                label='Sensitivity'
                            />
                        </span>
                    </FieldGroup>
                </FieldSet>
            </FieldGroup>
        </form>
    );
};

export default Settings;