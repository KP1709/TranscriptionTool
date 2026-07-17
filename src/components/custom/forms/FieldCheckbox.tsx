import type { ReactNode } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";

export type FieldCheckboxProps = {
    id?: string;
    label: ReactNode;
    name?: string;
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean | "indeterminate") => void;
    className?: string;
    labelClassName?: string;
    checkboxClassName?: string;
    disabled?: boolean;
};

const FieldCheckbox = ({
    id,
    label,
    name,
    checked,
    defaultChecked,
    onCheckedChange,
    className,
    labelClassName,
    checkboxClassName,
    disabled,
}: FieldCheckboxProps) => {
    const checkboxId = id ?? `${name ?? "checkbox"}-field`;

    return (
        <Field orientation="horizontal" className={className}>
            <Checkbox
                id={checkboxId}
                name={name}
                checked={checked}
                defaultChecked={defaultChecked}
                onCheckedChange={onCheckedChange}
                className={checkboxClassName}
                disabled={disabled}
            />
            <FieldLabel htmlFor={checkboxId} className={labelClassName}>
                {label}
            </FieldLabel>
        </Field>
    );
};

export default FieldCheckbox;