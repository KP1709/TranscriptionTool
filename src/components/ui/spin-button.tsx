import * as React from "react";
import { CaretUpIcon, CaretDownIcon } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export interface SpinButtonProps
    extends Omit<
        React.InputHTMLAttributes<HTMLInputElement>,
        "onChange" | "value"
    > {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    label?: React.ReactNode;
    description?: React.ReactNode;
    error?: React.ReactNode;
}

export function SpinButton({
    value,
    onChange,
    min = Number.NEGATIVE_INFINITY,
    max = Number.POSITIVE_INFINITY,
    step = 1,
    className,
    disabled,
    label,
    description,
    error,
    id,
    ...props
}: SpinButtonProps) {
    const inputId = React.useId();
    const resolvedId = id ?? inputId;
    const descriptionId = description ? `${resolvedId}-description` : undefined;
    const errorId = error ? `${resolvedId}-error` : undefined;
    const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;


    const clamp = (v: number) => Math.min(max, Math.max(min, v));

    const precision = (step.toString().split(".")[1] ?? "").length;

    const round = (n: number) => Number(n.toFixed(precision));

    const increment = () => {
        if (!disabled) {
            onChange(clamp(round(value + step)));
        }
    };

    const decrement = () => {
        if (!disabled) {
            onChange(clamp(round(value - step)));
        }
    };

    return (
        <Field className="w-fit">
            {label ? <FieldLabel htmlFor={resolvedId}>{label}</FieldLabel> : null}

            <FieldContent>
                <div className="relative w-full">
                    <Input
                        id={resolvedId}
                        type="number"
                        value={value}
                        step={step}
                        disabled={disabled}
                        aria-describedby={describedBy}
                        aria-invalid={Boolean(error)}
                        onChange={(e) => {
                            const next = Number(e.target.value);

                            if (!Number.isNaN(next)) {
                                onChange(clamp(next));
                            }
                        }}
                        className={cn(
                            "pr-8 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
                            className
                        )}
                        {...props}
                    />

                    <div className="absolute inset-y-px right-px flex w-8 flex-col overflow-hidden rounded-r-[calc(var(--radius)-1px)]">
                        <button
                            type="button"
                            onClick={increment}
                            disabled={disabled || value >= max}
                            tabIndex={-1}
                            aria-controls={resolvedId}
                            aria-label="Increment value"
                            className="flex flex-1 items-center justify-center border-l border-b bg-background transition-colors hover:bg-accent active:bg-accent/80 focus-visible:bg-accent disabled:pointer-events-none disabled:opacity-50"
                        >
                            <CaretUpIcon size={14} weight="regular" />
                        </button>

                        <button
                            type="button"
                            onClick={decrement}
                            disabled={disabled || value <= min}
                            tabIndex={-1}
                            aria-controls={resolvedId}
                            aria-label="Decrement value"
                            className="flex flex-1 items-center justify-center border-l bg-background transition-colors hover:bg-accent active:bg-accent/80 focus-visible:bg-accent disabled:pointer-events-none disabled:opacity-50"
                        >
                            <CaretDownIcon size={14} weight="regular" />
                        </button>
                    </div>
                </div>

                {description ? (
                    <FieldDescription id={descriptionId}>{description}</FieldDescription>
                ) : null}

                {error ? <FieldError id={errorId}>{error}</FieldError> : null}
            </FieldContent>
        </Field>
    );
}