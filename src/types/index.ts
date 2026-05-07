export interface AntennaConfig {
  type: 'dipole' | 'monopole' | 'patch' | 'yagi' | 'helix';
  frequency: number; // MHz
  impedance: number; // Ohms
  length: number; // mm
  feedReal: number;
  feedImag: number;
  loadReal: number;
  loadImag: number;
}

export interface MatchingConfig {
  method: 'single-stub' | 'double-stub' | 'quarter-wave' | 'l-match' | 'pi-match';
  stubType: 'open' | 'short';
  transmissionLine: 'coaxial' | 'microstrip' | 'stripline';
  lineImpedance: number;
  velocityFactor: number;
}

export interface CalculatedResults {
  mloc: number; // Matching location in mm
  mtsep: number; // Stub length in mm
  vswr: number;
  returnLoss: number; // dB
  bandwidth: number; // MHz at -10dB
  efficiency: number; // Percentage
  inputImpedance: ComplexNumber;
  reflectionCoefficient: ComplexNumber;
}

export interface ComplexNumber {
  real: number;
  imag: number;
}

export interface RadiationPatternPoint {
  angle: number; // degrees
  gain: number; // dBi
}

export interface S11DataPoint {
  frequency: number;
  real: number;
  imag: number;
  magnitude: number; // dB
  phase: number; // degrees
}
