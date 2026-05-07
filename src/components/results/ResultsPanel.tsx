import React from 'react';
import { CalculatedResults } from '../../types';
import { Crosshair, Zap, Gauge, Signal, Target, TrendingUp, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface ResultsPanelProps {
  results: CalculatedResults;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ results }) => {
  const getVSWRStatus = (vswr: number) => {
    if (vswr <= 1.5) return { color: 'text-accent-green', bg: 'bg-accent-green/20', icon: CheckCircle, label: 'Excellent' };
    if (vswr <= 2.0) return { color: 'text-accent-orange', bg: 'bg-accent-orange/20', icon: AlertCircle, label: 'Good' };
    if (vswr <= 3.0) return { color: 'text-accent-orange', bg: 'bg-accent-orange/20', icon: AlertCircle, label: 'Fair' };
    return { color: 'text-accent-red', bg: 'bg-accent-red/20', icon: XCircle, label: 'Poor' };
  };

  const getReturnLossStatus = (rl: number) => {
    if (rl <= -20) return { color: 'text-accent-green', label: 'Excellent' };
    if (rl <= -10) return { color: 'text-accent-orange', label: 'Good' };
    if (rl <= -6) return { color: 'text-accent-orange', label: 'Fair' };
    return { color: 'text-accent-red', label: 'Poor' };
  };

  const vswrStatus = getVSWRStatus(results.vswr);
  const rlStatus = getReturnLossStatus(results.returnLoss);
  const VSWRIcon = vswrStatus.icon;

  const ResultCard = ({
    icon: Icon,
    label,
    value,
    unit,
    subtext,
    accentColor = 'cyan'
  }: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    unit?: string;
    subtext?: string;
    accentColor?: 'cyan' | 'green' | 'orange' | 'red';
  }) => {
    const colorMap = {
      cyan: 'border-accent-cyan/30 hover:border-accent-cyan/60',
      green: 'border-accent-green/30 hover:border-accent-green/60',
      orange: 'border-accent-orange/30 hover:border-accent-orange/60',
      red: 'border-accent-red/30 hover:border-accent-red/60'
    };

    return (
      <div className={`bg-bg-tertiary rounded-lg border ${colorMap[accentColor]} p-4 transition-colors`}>
        <div className="flex items-center gap-2 mb-2">
          <Icon className={`w-4 h-4 text-accent-${accentColor}`} />
          <span className="text-text-secondary text-xs font-sans">{label}</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`text-2xl font-mono font-bold text-text-primary`}>
            {typeof value === 'number' ? value.toFixed(2) : value}
          </span>
          {unit && <span className="text-text-secondary text-sm">{unit}</span>}
        </div>
        {subtext && <div className="text-text-secondary text-xs mt-1">{subtext}</div>}
      </div>
    );
  };

  return (
    <div className="bg-bg-secondary rounded-lg border border-border-default p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-5 h-5 text-accent-cyan" />
        <h2 className="text-lg font-semibold text-text-primary font-sans">Matching Parameters</h2>
      </div>

      {/* mloc & mtsep - Primary Results */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-text-secondary mb-3 uppercase tracking-wider">
          Primary Matching Values
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-bg-tertiary to-bg-primary rounded-lg border border-accent-cyan/30 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Crosshair className="w-4 h-4 text-accent-cyan" />
              <span className="text-text-secondary text-xs font-sans">mloc</span>
            </div>
            <div className="text-3xl font-mono font-bold text-accent-cyan">
              {results.mloc.toFixed(2)}
            </div>
            <div className="text-text-secondary text-xs mt-1">mm from load</div>
          </div>

          <div className="bg-gradient-to-br from-bg-tertiary to-bg-primary rounded-lg border border-accent-green/30 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-accent-green" />
              <span className="text-text-secondary text-xs font-sans">mtsep</span>
            </div>
            <div className="text-3xl font-mono font-bold text-accent-green">
              {results.mtsep.toFixed(2)}
            </div>
            <div className="text-text-secondary text-xs mt-1">stub length (mm)</div>
          </div>
        </div>
      </div>

      {/* VSWR & Return Loss */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-text-secondary mb-3 uppercase tracking-wider">
          Match Quality
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <ResultCard
            icon={Gauge}
            label="VSWR"
            value={results.vswr}
            unit=":1"
            subtext={`Match: ${vswrStatus.label}`}
            accentColor={vswrStatus.color === 'text-accent-green' ? 'green' : vswrStatus.color === 'text-accent-orange' ? 'orange' : 'red'}
          />
          <ResultCard
            icon={Signal}
            label="Return Loss"
            value={results.returnLoss}
            unit="dB"
            subtext={`Match: ${rlStatus.label}`}
            accentColor={rlStatus.color === 'text-accent-green' ? 'green' : 'orange'}
          />
        </div>
      </div>

      {/* Additional Parameters */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-text-secondary mb-3 uppercase tracking-wider">
          Additional Parameters
        </h3>
        <div className="space-y-3">
          <ResultCard
            icon={TrendingUp}
            label="Bandwidth (-10dB)"
            value={results.bandwidth}
            unit="MHz"
            accentColor="cyan"
          />
          <ResultCard
            icon={Zap}
            label="Efficiency"
            value={results.efficiency}
            unit="%"
            accentColor="green"
          />
        </div>
      </div>

      {/* Input Impedance */}
      <div className="bg-bg-tertiary rounded-lg border border-border-default p-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-accent-orange" />
          <span className="text-text-secondary text-xs font-sans">Input Impedance (Matched)</span>
        </div>
        <div className="font-mono text-lg">
          <span className="text-text-primary">
            {results.inputImpedance.real.toFixed(2)}
          </span>
          <span className="text-text-secondary mx-1">+ j</span>
          <span className="text-text-primary">
            {results.inputImpedance.imag.toFixed(2)}
          </span>
          <span className="text-text-secondary ml-1">Ω</span>
        </div>
        <div className="text-text-secondary text-xs mt-2">
          Reflection: {results.reflectionCoefficient.real.toFixed(3)} + j{results.reflectionCoefficient.imag.toFixed(3)}
        </div>
      </div>

      {/* Status Badge */}
      <div className={`mt-4 rounded-lg p-3 ${vswrStatus.bg}`}>
        <div className="flex items-center gap-2">
          <VSWRIcon className={`w-5 h-5 ${vswrStatus.color}`} />
          <div>
            <div className={`font-medium text-sm ${vswrStatus.color}`}>
              {vswrStatus.label} Match
            </div>
            <div className="text-text-secondary text-xs">
              {results.vswr <= 1.5
                ? 'Excellent impedance matching achieved'
                : results.vswr <= 2.0
                ? 'Good matching with acceptable reflection'
                : 'Consider additional matching network tuning'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
