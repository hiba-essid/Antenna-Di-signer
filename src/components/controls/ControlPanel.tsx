import React from 'react';
import { InputField, SliderInput, SelectField, ComplexInput } from './InputField';
import { AntennaConfig, MatchingConfig } from '../../types';
import { Radio, Settings2, Zap } from 'lucide-react';

interface ControlPanelProps {
  antennaConfig: AntennaConfig;
  matchingConfig: MatchingConfig;
  onAntennaChange: (config: Partial<AntennaConfig>) => void;
  onMatchingChange: (config: Partial<MatchingConfig>) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  antennaConfig,
  matchingConfig,
  onAntennaChange,
  onMatchingChange
}) => {
  const antennaTypeOptions = [
    { value: 'dipole', label: 'Half-Wave Dipole' },
    { value: 'monopole', label: 'Quarter-Wave Monopole' },
    { value: 'patch', label: 'Microstrip Patch' },
    { value: 'yagi', label: 'Yagi-Uda' },
    { value: 'helix', label: 'Helical' }
  ];

  const matchingMethodOptions = [
    { value: 'single-stub', label: 'Single Stub' },
    { value: 'double-stub', label: 'Double Stub' },
    { value: 'quarter-wave', label: 'Quarter Wave Transformer' },
    { value: 'l-match', label: 'L-Network' },
    { value: 'pi-match', label: 'Pi-Network' }
  ];

  const stubTypeOptions = [
    { value: 'open', label: 'Open Circuit' },
    { value: 'short', label: 'Short Circuit' }
  ];

  const lineTypeOptions = [
    { value: 'coaxial', label: 'Coaxial Cable' },
    { value: 'microstrip', label: 'Microstrip' },
    { value: 'stripline', label: 'Stripline' }
  ];

  return (
    <div className="bg-bg-secondary rounded-lg border border-border-default p-6">
      {/* Antenna Configuration */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Radio className="w-5 h-5 text-accent-cyan" />
          <h2 className="text-lg font-semibold text-text-primary font-sans">Antenna Configuration</h2>
        </div>

        <SelectField
          label="Antenna Type"
          value={antennaConfig.type}
          onChange={(value) => onAntennaChange({ type: value as AntennaConfig['type'] })}
          options={antennaTypeOptions}
        />

        <SliderInput
          label="Frequency"
          value={antennaConfig.frequency}
          onChange={(value) => onAntennaChange({ frequency: value })}
          min={100}
          max={10000}
          step={10}
          unit=" MHz"
        />

        <InputField
          label="Antenna Length"
          value={antennaConfig.length}
          onChange={(value) => onAntennaChange({ length: value })}
          min={0}
          max={1000}
          step={0.1}
          unit="mm"
        />

        <InputField
          label="Characteristic Impedance"
          value={antennaConfig.impedance}
          onChange={(value) => onAntennaChange({ impedance: value })}
          min={1}
          max={500}
          step={0.1}
          unit="Ω"
        />

        <div className="border-t border-border-default pt-4 mt-4">
          <h3 className="text-sm font-medium text-text-secondary mb-3">Impedance Parameters</h3>
          <ComplexInput
            label="Feed Point Impedance"
            realValue={antennaConfig.feedReal}
            imagValue={antennaConfig.feedImag}
            onRealChange={(value) => onAntennaChange({ feedReal: value })}
            onImagChange={(value) => onAntennaChange({ feedImag: value })}
            unit="Ω"
          />
          <ComplexInput
            label="Load Impedance"
            realValue={antennaConfig.loadReal}
            imagValue={antennaConfig.loadImag}
            onRealChange={(value) => onAntennaChange({ loadReal: value })}
            onImagChange={(value) => onAntennaChange({ loadImag: value })}
            unit="Ω"
          />
        </div>
      </div>

      {/* Matching Network Configuration */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Settings2 className="w-5 h-5 text-accent-green" />
          <h2 className="text-lg font-semibold text-text-primary font-sans">Matching Network</h2>
        </div>

        <SelectField
          label="Matching Method"
          value={matchingConfig.method}
          onChange={(value) => onMatchingChange({ method: value as MatchingConfig['method'] })}
          options={matchingMethodOptions}
        />

        <SelectField
          label="Stub Type"
          value={matchingConfig.stubType}
          onChange={(value) => onMatchingChange({ stubType: value as 'open' | 'short' })}
          options={stubTypeOptions}
        />

        <SelectField
          label="Transmission Line"
          value={matchingConfig.transmissionLine}
          onChange={(value) => onMatchingChange({ transmissionLine: value as MatchingConfig['transmissionLine'] })}
          options={lineTypeOptions}
        />

        <InputField
          label="Line Impedance"
          value={matchingConfig.lineImpedance}
          onChange={(value) => onMatchingChange({ lineImpedance: value })}
          min={1}
          max={200}
          step={0.1}
          unit="Ω"
        />

        <SliderInput
          label="Velocity Factor"
          value={matchingConfig.velocityFactor}
          onChange={(value) => onMatchingChange({ velocityFactor: value })}
          min={0.3}
          max={1.0}
          step={0.01}
          unit=""
        />
      </div>
    </div>
  );
};
