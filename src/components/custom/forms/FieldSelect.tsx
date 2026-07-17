import type { ReactNode } from "react";

import { Field, FieldLabel } from "@/components/ui/field";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export type FieldSelectOption = {
    label: string;
    value: string;
};

type FieldSelectProps = {
    id?: string;
    label: ReactNode;
    items: FieldSelectOption[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
    triggerClassName?: string;
    contentClassName?: string;
};

const FieldSelect = ({
    id,
    label,
    items,
    value,
    defaultValue,
    onValueChange,
    placeholder = "Select an option",
    className,
    triggerClassName,
    contentClassName,
}: FieldSelectProps) => {
    const handleValueChange = (nextValue: string | null) => {
        if (nextValue !== null) {
            onValueChange?.(nextValue);
        }
    };

    return (
        <Field className={className}>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            <Select value={value} defaultValue={defaultValue} onValueChange={handleValueChange}>
                <SelectTrigger id={id} className={triggerClassName}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent className={contentClassName}>
                    <SelectGroup>
                        {items.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                                {item.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </Field>
    );
};

export default FieldSelect;