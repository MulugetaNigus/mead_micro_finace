'use client';

import { useState, useEffect, useRef, forwardRef } from 'react';

interface CurrencyInputProps {
  value: number | string | undefined;
  onChange: (numericValue: number | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  id?: string;
  name?: string;
  onBlur?: () => void;
}

/**
 * A money input that displays comma-formatted numbers while typing.
 * e.g. 4000 → "4,000"  |  40000 → "40,000"  |  400000 → "400,000"
 *
 * Internally stores a plain string so the user can type freely.
 * Calls onChange with the parsed numeric value (or undefined if empty/invalid).
 */
export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, placeholder = '0', className, disabled, min, max, id, name, onBlur }, ref) => {
    // Format a number to comma-separated string, preserving trailing decimal point/zeros
    const format = (raw: string): string => {
      if (!raw && raw !== '0') return '';
      // Split on decimal point
      const [intPart, decPart] = raw.split('.');
      const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return decPart !== undefined ? `${formatted}.${decPart}` : formatted;
    };

    // Strip commas to get raw numeric string
    const strip = (v: string) => v.replace(/,/g, '');

    // Initialise display value from the controlled `value` prop
    const initDisplay = () => {
      if (value === undefined || value === '' || value === null) return '';
      const n = Number(value);
      if (isNaN(n)) return '';
      return format(String(value));
    };

    const [display, setDisplay] = useState<string>(initDisplay);
    const prevValueRef = useRef<number | string | undefined>(value);

    // Sync when the controlled value changes from outside (e.g. form reset)
    useEffect(() => {
      if (prevValueRef.current !== value) {
        prevValueRef.current = value;
        setDisplay(initDisplay());
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = strip(e.target.value);

      // Allow only digits and at most one decimal point
      if (raw !== '' && !/^\d*\.?\d*$/.test(raw)) return;

      // Reformat with commas, preserving trailing '.' or '.0' etc.
      const formatted = format(raw);
      setDisplay(formatted);

      // Parse and emit numeric value
      if (raw === '' || raw === '.') {
        onChange(undefined);
      } else {
        const num = parseFloat(raw);
        onChange(isNaN(num) ? undefined : num);
      }
    };

    return (
      <input
        ref={ref}
        id={id}
        name={name}
        type="text"
        inputMode="decimal"
        value={display}
        onChange={handleChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={className}
        autoComplete="off"
      />
    );
  }
);

CurrencyInput.displayName = 'CurrencyInput';
