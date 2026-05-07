import React from 'react';

interface InputFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  disabled?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 10000,
  step = 1,
  unit = '',
  disabled = false
}) => {
  return (
    <div className="mb-4">
      <label className="block text-text-secondary text-sm mb-1.5 font-sans">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className="w-full bg-bg-tertiary border border-border-default rounded px-3 py-2 text-text-primary font-mono text-sm focus:border-accent-cyan transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

export const SliderInput: React.FC<SliderInputProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = ''
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <label className="text-text-secondary text-sm font-sans">{label}</label>
        <span className="text-accent-cyan font-mono text-sm">
          {value.toFixed(1)}{unit}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          min={min}
          max={max}
          step={step}
          className="w-full h-2 bg-bg-tertiary rounded-lg appearance-none cursor-pointer accent-accent-cyan"
          style={{
            background: `linear-gradient(to right, #58a6ff 0%, #58a6ff ${percentage}%, #21262d ${percentage}%, #21262d 100%)`
          }}
        />
      </div>
      <div className="flex justify-between text-text-secondary text-xs mt-1">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
};

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  options
}) => {
  return (
    <div className="mb-4">
      <label className="block text-text-secondary text-sm mb-1.5 font-sans">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-bg-tertiary border border-border-default rounded px-3 py-2 text-text-primary font-sans text-sm focus:border-accent-cyan transition-colors cursor-pointer"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

interface ComplexInputProps {
  label: string;
  realValue: number;
  imagValue: number;
  onRealChange: (value: number) => void;
  onImagChange: (value: number) => void;
  unit?: string;
}

export const ComplexInput: React.FC<ComplexInputProps> = ({
  label,
  realValue,
  imagValue,
  onRealChange,
  onImagChange,
  unit = 'Ω'
}) => {
  return (
    <div className="mb-4">
      <label className="block text-text-secondary text-sm mb-1.5 font-sans">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={realValue}
          onChange={(e) => onRealChange(parseFloat(e.target.value) || 0)}
          className="w-24 bg-bg-tertiary border border-border-default rounded px-3 py-2 text-text-primary font-mono text-sm focus:border-accent-cyan transition-colors"
        />
        <span className="text-text-secondary font-mono">+ j</span>
        <input
          type="number"
          value={imagValue}
          onChange={(e) => onImagChange(parseFloat(e.target.value) || 0)}
          className="w-24 bg-bg-tertiary border border-border-default rounded px-3 py-2 text-text-primary font-mono text-sm focus:border-accent-cyan transition-colors"
        />
        <span className="text-text-secondary text-sm">{unit}</span>
      </div>
    </div>
  );
};
