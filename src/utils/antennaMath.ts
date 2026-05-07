import { ComplexNumber, AntennaConfig, MatchingConfig, CalculatedResults, RadiationPatternPoint, S11DataPoint } from '../types';

// Physical constants
const C = 299792458; // Speed of light in m/s
const Z0 = 50; // Reference impedance

// Complex number operations
export function complexAdd(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
  return { real: a.real + b.real, imag: a.imag + b.imag };
}

export function complexSubtract(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
  return { real: a.real - b.real, imag: a.imag - b.imag };
}

export function complexMultiply(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
  return {
    real: a.real * b.real - a.imag * b.imag,
    imag: a.real * b.imag + a.imag * b.real
  };
}

export function complexDivide(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
  const denom = b.real * b.real + b.imag * b.imag;
  if (denom === 0) return { real: 0, imag: 0 };
  return {
    real: (a.real * b.real + a.imag * b.imag) / denom,
    imag: (a.imag * b.real - a.real * b.imag) / denom
  };
}

export function complexMagnitude(c: ComplexNumber): number {
  return Math.sqrt(c.real * c.real + c.imag * c.imag);
}

export function complexPhase(c: ComplexNumber): number {
  return Math.atan2(c.imag, c.real) * 180 / Math.PI;
}

export function complexConjugate(c: ComplexNumber): ComplexNumber {
  return { real: c.real, imag: -c.imag };
}

// Calculate reflection coefficient
export function calculateGamma(z: ComplexNumber, z0: number = 50): ComplexNumber {
  const z0Complex: ComplexNumber = { real: z0, imag: 0 };
  const numerator = complexSubtract(z, z0Complex);
  const denominator = complexAdd(z, z0Complex);
  return complexDivide(numerator, denominator);
}

// Calculate VSWR from reflection coefficient
export function calculateVSWR(gammaMag: number): number {
  if (gammaMag >= 1) return Infinity;
  return (1 + gammaMag) / (1 - gammaMag);
}

// Calculate return loss in dB
export function calculateReturnLoss(gammaMag: number): number {
  if (gammaMag <= 0) return -Infinity;
  return -20 * Math.log10(gammaMag);
}

// Calculate stub length and position for single stub matching
export function calculateSingleStubMatching(
  feedZ: ComplexNumber,
  lineZ: number,
  frequency: number,
  stubType: 'open' | 'short',
  velocityFactor: number = 0.66
): { mloc: number; mtsep: number } {
  const wavelength = (C / (frequency * 1e6)) * velocityFactor * 1000; // mm

  // Normalize impedance
  const zNorm = complexDivide(feedZ, { real: lineZ, imag: 0 });

  // Convert to admittance
  const yNorm = complexDivide({ real: 1, imag: 0 }, zNorm);

  // Calculate reflection coefficient
  const gamma = calculateGamma(feedZ, lineZ);
  const gammaMag = complexMagnitude(gamma);
  const gammaPhase = complexPhase(gamma);

  // Simplified mloc calculation based on admittance circle intersection
  const b = yNorm.imag;
  const g = yNorm.real;

  // Stub length calculation
  let mtsep: number;
  const yStub: number = -b; // Susceptance to cancel

  if (stubType === 'short') {
    mtsep = (Math.atan(yStub) / (2 * Math.PI)) * wavelength;
  } else {
    mtsep = (Math.atan(-1 / yStub) / (2 * Math.PI)) * wavelength;
  }

  // Position calculation
  if (g <= 1) {
    const b1 = Math.sqrt(1 - g);
    const d1 = Math.atan2(-b1, 1 - g) / (2 * Math.PI);
    const d2 = Math.atan2(b1, 1 - g) / (2 * Math.PI);
    const mloc = Math.min(d1, d2) * wavelength;
    return { mloc: Math.abs(mloc), mtsep: Math.abs(mtsep) };
  } else {
    const mloc = (Math.atan(b / (g - 1))) / (2 * Math.PI) * wavelength;
    return { mloc: Math.abs(mloc), mtsep: Math.abs(mtsep) };
  }
}

// Calculate all antenna parameters
export function calculateAntennaParameters(
  antennaConfig: AntennaConfig,
  matchingConfig: MatchingConfig
): CalculatedResults {
  // Reference frequency (resonant frequency)
  const refFrequency = 2450; // MHz
  const frequencyRatio = antennaConfig.frequency / refFrequency;
  
  // Calculate frequency-dependent impedance
  // At resonance (2450 MHz), use the specified impedance
  // At other frequencies, the impedance changes based on frequency deviation
  
  // Simplified model: impedance varies with frequency due to antenna's frequency response
  // Real part increases with frequency deviation, imaginary part becomes more reactive
  let feedZ: ComplexNumber;
  
  if (Math.abs(frequencyRatio - 1) < 0.01) {
    // At or very close to resonance, use specified impedance
    feedZ = { real: antennaConfig.feedReal, imag: antennaConfig.feedImag };
  } else {
    // Off-resonance: model frequency-dependent impedance
    const freqDeviation = (frequencyRatio - 1);
    const qFactor = 10; // Quality factor (typical for antenna)
    
    // Real part increases slightly with frequency deviation (bandwidth effect)
    const realPart = antennaConfig.feedReal * (1 + Math.abs(freqDeviation) * 0.5);
    
    // Imaginary part becomes more reactive off-resonance
    // Positive for above resonance, negative for below
    const reactivePart = antennaConfig.feedImag + (freqDeviation * qFactor * antennaConfig.feedReal);
    
    feedZ = { real: realPart, imag: reactivePart };
  }
  
  const loadZ: ComplexNumber = { real: antennaConfig.loadReal, imag: antennaConfig.loadImag };

  // Calculate reflection coefficient
  const gamma = calculateGamma(feedZ, matchingConfig.lineImpedance);
  const gammaMag = complexMagnitude(gamma);

  // Calculate VSWR and return loss
  const vswr = calculateVSWR(gammaMag);
  const returnLoss = calculateReturnLoss(gammaMag);

  // Calculate mloc and mtsep
  const { mloc, mtsep } = calculateSingleStubMatching(
    feedZ,
    matchingConfig.lineImpedance,
    antennaConfig.frequency,
    matchingConfig.stubType,
    matchingConfig.velocityFactor
  );

  // Calculate bandwidth (simplified - based on Q factor)
  const qFactor = 1 / (2 * (1 - gammaMag));
  const bandwidth = antennaConfig.frequency / qFactor;

  // Calculate efficiency (simplified)
  const efficiency = (1 - gammaMag * gammaMag) * 100;

  // Calculate input impedance after matching
  const matchedGamma: ComplexNumber = { real: 0, imag: 0 }; // Perfect match
  const inputZ = complexMultiply(
    complexDivide(
      complexAdd({ real: 1, imag: 0 }, matchedGamma),
      complexSubtract({ real: 1, imag: 0 }, matchedGamma)
    ),
    { real: matchingConfig.lineImpedance, imag: 0 }
  );

  return {
    mloc,
    mtsep,
    vswr: isFinite(vswr) ? vswr : 999,
    returnLoss: isFinite(returnLoss) ? returnLoss : -100,
    bandwidth: Math.abs(bandwidth),
    efficiency: Math.min(100, Math.max(0, efficiency)),
    inputImpedance: inputZ,
    reflectionCoefficient: gamma
  };
}

// Generate radiation pattern based on antenna type
export function generateRadiationPattern(
  antennaType: AntennaConfig['type'],
  frequency: number
): RadiationPatternPoint[] {
  const points: RadiationPatternPoint[] = [];

  // Reference frequency for pattern scaling (2450 MHz - default antenna frequency)
  const refFrequency = 2450;
  const frequencyRatio = frequency / refFrequency;
  
  // Calculate wavelength (mm)
  const wavelength = (C / (frequency * 1e6)) * 1000;
  
  // Frequency-dependent beamwidth narrowing factor
  // Higher frequency = narrower beamwidth (more directive)
  const beamwidthFactor = 1 / Math.sqrt(frequencyRatio);
  
  // Frequency-dependent gain scaling (assumes fixed antenna size)
  // Gain increases approximately proportional to (frequency ratio)^2 for fixed aperture
  const gainScaling = 10 * Math.log10(Math.max(0.1, frequencyRatio * frequencyRatio));

  for (let angle = 0; angle < 360; angle += 2) {
    let gain: number;

    switch (antennaType) {
      case 'dipole':
        // Figure-8 pattern for half-wave dipole
        // Frequency affects the effective electrical length
        const dipoleAngle = Math.abs(angle - 180);
        const dipolerad = dipoleAngle * Math.PI / 180;
        
        // Apply beamwidth narrowing at higher frequencies
        const effectiveDipoleAngle = dipolerad * beamwidthFactor;
        gain = 1.76 * Math.cos(effectiveDipoleAngle / 2) * Math.cos(effectiveDipoleAngle / 2);
        gain = 10 * Math.log10(Math.max(0.001, gain)) + gainScaling;
        break;

      case 'monopole':
        // Similar to dipole but only upper hemisphere
        if (angle >= 270 || angle <= 90) {
          const monoAngle = Math.abs(angle - 90);
          const monorad = monoAngle * Math.PI / 180;
          
          // Apply beamwidth narrowing
          const effectiveMonoAngle = monorad * beamwidthFactor;
          gain = 1.76 * Math.cos(effectiveMonoAngle / 2) * Math.cos(effectiveMonoAngle / 2);
          gain = 10 * Math.log10(Math.max(0.001, gain)) + gainScaling;
        } else {
          gain = -20; // Ground plane null
        }
        break;

      case 'patch':
        // Broadside pattern for microstrip patch
        // Patch antenna frequency response is more complex - varies with frequency
        const patchAngle = Math.abs(angle - 90);
        const patchrad = patchAngle * Math.PI / 180;
        
        // Apply frequency-dependent beamwidth narrowing
        const effectivePatchAngle = patchrad * beamwidthFactor;
        const hp = Math.cos(0.886 * Math.sin(effectivePatchAngle));
        gain = 5 * hp * hp;
        gain = 10 * Math.log10(Math.max(0.001, gain)) + gainScaling * 0.8;
        break;

      case 'yagi':
        // Highly directional pattern - very frequency sensitive
        const yagiAngle = Math.abs(angle);
        const yagirad = yagiAngle * Math.PI / 180;
        
        // Yagi beamwidth is highly frequency dependent
        const effectiveYagiAngle = yagirad * beamwidthFactor * 0.7; // Yagi narrows more
        const yagiBeam = Math.cos(2.68 * Math.sin(effectiveYagiAngle));
        gain = 10 * yagiBeam * yagiBeam;
        gain = 10 * Math.log10(Math.max(0.001, gain)) + gainScaling * 1.2; // Yagi gains more with frequency
        break;

      case 'helix':
        // End-fire pattern for axial mode helix
        // Helix pattern is also frequency dependent
        const helixAngle = Math.abs(angle);
        const helixrad = helixAngle * Math.PI / 180;
        
        // Helix narrowing at higher frequencies
        const effectiveHelixAngle = helixrad * beamwidthFactor;
        const helixBeam = Math.cos(1.84 * Math.sin(effectiveHelixAngle / 2));
        gain = 10 * helixBeam * helixBeam * Math.cos(effectiveHelixAngle / 2);
        gain = 10 * Math.log10(Math.max(0.001, gain)) + gainScaling;
        break;

      default:
        gain = 0;
    }

    points.push({ angle, gain: Math.max(-30, gain + 2.15) }); // Normalize to dBi
  }

  return points;
}

// Generate S11 data over frequency range
export function generateS11Data(
  antennaConfig: AntennaConfig,
  startFreq: number,
  endFreq: number,
  points: number = 101
): S11DataPoint[] {
  const data: S11DataPoint[] = [];
  const centerFreq = antennaConfig.frequency;
  const bandwidth = (endFreq - startFreq) * 0.1;

  for (let i = 0; i < points; i++) {
    const freq = startFreq + (endFreq - startFreq) * (i / (points - 1));

    // Simplified resonance model
    const f0 = centerFreq;
    const Q = 10;
    const detuning = (freq - f0) / f0;
    const gammaMag = 0.1 + Math.exp(-detuning * detuning * Q * Q) * 0.9;

    // Phase calculation
    const phase = -180 * (freq - f0) / bandwidth;

    const real = gammaMag * Math.cos(phase * Math.PI / 180);
    const imag = gammaMag * Math.sin(phase * Math.PI / 180);

    data.push({
      frequency: freq,
      real,
      imag,
      magnitude: 20 * Math.log10(gammaMag),
      phase: complexPhase({ real, imag })
    });
  }

  return data;
}

// Calculate normalized impedance for Smith chart
export function calculateSmithChartImpedance(
  gammaReal: number,
  gammaImag: number
): ComplexNumber {
  const gammaMag2 = gammaReal * gammaReal + gammaImag * gammaImag;
  if (gammaMag2 === 1) return { real: Infinity, imag: Infinity };

  const denom = (1 - gammaReal) * (1 - gammaReal) + gammaImag * gammaImag;

  return {
    real: (1 - gammaMag2) / denom,
    imag: (2 * gammaImag) / denom
  };
}

// Calculate admittance from impedance
export function impedanceToAdmittance(z: ComplexNumber): ComplexNumber {
  const mag2 = z.real * z.real + z.imag * z.imag;
  if (mag2 === 0) return { real: Infinity, imag: 0 };

  return {
    real: z.real / mag2,
    imag: -z.imag / mag2
  };
}

// Calculate reflection coefficient from impedance
export function impedanceToGamma(z: ComplexNumber, z0: number = 50): ComplexNumber {
  return calculateGamma(z, z0);
}
