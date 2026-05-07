import React, { useState, useMemo, useCallback } from 'react';
import { AntennaConfig, MatchingConfig, CalculatedResults, RadiationPatternPoint, S11DataPoint } from './types';
import { ControlPanel } from './components/controls';
import { RadiationPattern, SmithChart, S11Plots } from './components/plots';
import { ResultsPanel } from './components/results';
import { calculateAntennaParameters, generateRadiationPattern, generateS11Data } from './utils/antennaMath';
import { Antenna, Radio, Activity, Github, ExternalLink, Cpu } from 'lucide-react';

const defaultAntennaConfig: AntennaConfig = {
  type: 'dipole',
  frequency: 2450,
  impedance: 50,
  length: 30,
  feedReal: 73,
  feedImag: 43,
  loadReal: 50,
  loadImag: 0
};

const defaultMatchingConfig: MatchingConfig = {
  method: 'single-stub',
  stubType: 'open',
  transmissionLine: 'coaxial',
  lineImpedance: 50,
  velocityFactor: 0.66
};

function App() {
  const [antennaConfig, setAntennaConfig] = useState<AntennaConfig>(defaultAntennaConfig);
  const [matchingConfig, setMatchingConfig] = useState<MatchingConfig>(defaultMatchingConfig);

  const handleAntennaChange = useCallback((changes: Partial<AntennaConfig>) => {
    setAntennaConfig(prev => ({ ...prev, ...changes }));
  }, []);

  const handleMatchingChange = useCallback((changes: Partial<MatchingConfig>) => {
    setMatchingConfig(prev => ({ ...prev, ...changes }));
  }, []);

  const calculatedResults = useMemo<CalculatedResults>(() => {
    return calculateAntennaParameters(antennaConfig, matchingConfig);
  }, [antennaConfig, matchingConfig]);

  const radiationPattern = useMemo<RadiationPatternPoint[]>(() => {
    return generateRadiationPattern(antennaConfig.type, antennaConfig.frequency);
  }, [antennaConfig.type, antennaConfig.frequency]);

  const s11Data = useMemo<S11DataPoint[]>(() => {
    const bandwidth = 500;
    return generateS11Data(
      antennaConfig,
      antennaConfig.frequency - bandwidth,
      antennaConfig.frequency + bandwidth,
      201
    );
  }, [antennaConfig]);

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="bg-bg-secondary border-b border-border-default sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent-cyan/20 flex items-center justify-center">
                <Antenna className="w-6 h-6 text-accent-cyan" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-text-primary font-sans tracking-tight">
                  Antenna Designer
                </h1>
                <p className="text-text-secondary text-xs font-mono">
                  mloc / mtsep Calculator & Visualizer
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-bg-tertiary rounded-full">
                <Activity className="w-4 h-4 text-accent-green" />
                <span className="text-text-secondary text-xs font-mono">Live</span>
              </div>
              <div className="text-text-secondary text-xs">
                v1.0.0
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Controls */}
          <div className="lg:col-span-3">
            <div className="sticky top-24">
              <ControlPanel
                antennaConfig={antennaConfig}
                matchingConfig={matchingConfig}
                onAntennaChange={handleAntennaChange}
                onMatchingChange={handleMatchingChange}
              />
            </div>
          </div>

          {/* Middle Column - Visualizations */}
          <div className="lg:col-span-6 space-y-6">
            {/* Radiation Pattern */}
            <RadiationPattern
              data={radiationPattern}
              antennaType={antennaConfig.type}
            />

            {/* Smith Chart */}
            <SmithChart
              impedance={calculatedResults.inputImpedance}
              loadImpedance={{ real: antennaConfig.loadReal, imag: antennaConfig.loadImag }}
              matchedPoint={calculatedResults.inputImpedance}
              stubPosition={{ mloc: calculatedResults.mloc, mtsep: calculatedResults.mtsep }}
            />

            {/* S11 Plots */}
            <S11Plots
              data={s11Data}
              centerFrequency={antennaConfig.frequency}
            />
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-3">
            <div className="sticky top-24">
              <ResultsPanel results={calculatedResults} />

              {/* Quick Reference Card */}
              <div className="mt-4 bg-bg-secondary rounded-lg border border-border-default p-4">
                <h3 className="text-sm font-medium text-text-primary mb-3 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-accent-cyan" />
                  Quick Reference
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Frequency</span>
                    <span className="text-text-primary font-mono">{antennaConfig.frequency} MHz</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">λ (wavelength)</span>
                    <span className="text-text-primary font-mono">
                      {(300 / antennaConfig.frequency).toFixed(2)} mm
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Line Z₀</span>
                    <span className="text-text-primary font-mono">{matchingConfig.lineImpedance} Ω</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Velocity Factor</span>
                    <span className="text-text-primary font-mono">{matchingConfig.velocityFactor}</span>
                  </div>
                  <div className="border-t border-border-default pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">λ/2 dipole</span>
                      <span className="text-text-primary font-mono">~{(150 / antennaConfig.frequency * 10).toFixed(1)} mm</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-bg-secondary border-t border-border-default mt-12">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-text-secondary text-xs">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4" />
              <span>Antenna Designer - RF Matching Calculator</span>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="flex items-center gap-1 hover:text-accent-cyan transition-colors"
              >
                <Github className="w-3 h-3" />
                <span>Documentation</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-1 hover:text-accent-cyan transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Help</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
