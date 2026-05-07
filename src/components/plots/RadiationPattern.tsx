import React, { useMemo } from 'react';
import { RadiationPatternPoint } from '../../types';

interface RadiationPatternProps {
  data: RadiationPatternPoint[];
  antennaType: string;
}

export const RadiationPattern: React.FC<RadiationPatternProps> = ({ data, antennaType }) => {
  const { maxGain, minGain, hpbw, frontBackRatio } = useMemo(() => {
    const gains = data.map(d => d.gain);
    const max = Math.max(...gains);
    const min = Math.min(...gains);

    // Find HPBW (Half Power Beamwidth)
    const halfPower = max - 3;
    let hpbwVal = 0;
    let inBeam = false;
    let beamStart = 0;

    for (let i = 0; i < data.length; i++) {
      if (data[i].gain >= halfPower && !inBeam) {
        inBeam = true;
        beamStart = data[i].angle;
      } else if (data[i].gain < halfPower && inBeam) {
        inBeam = false;
        hpbwVal = data[i].angle - beamStart;
        break;
      }
    }

    // Calculate front-to-back ratio
    const forwardGain = data.filter(d => d.angle >= 350 || d.angle <= 10).reduce((sum, d) => sum + d.gain, 0) / 20;
    const backwardGain = data.filter(d => d.angle >= 170 && d.angle <= 190).reduce((sum, d) => sum + d.gain, 0) / 10;
    const fbRatio = forwardGain - backwardGain;

    return { maxGain: max, minGain: min, hpbw: hpbwVal, frontBackRatio: fbRatio };
  }, [data]);

  const svgSize = 320;
  const centerX = svgSize / 2;
  const centerY = svgSize / 2;
  const maxRadius = 140;

  // Scale factor for gain (dBi) to radius
  const scaleGain = (gain: number): number => {
    const normalized = (gain - minGain) / (maxGain - minGain + 0.001);
    return normalized * maxRadius + 10;
  };

  const getPoint = (angle: number, gain: number) => {
    const rad = (angle - 90) * Math.PI / 180;
    const radius = scaleGain(gain);
    return {
      x: centerX + radius * Math.cos(rad),
      y: centerY + radius * Math.sin(rad)
    };
  };

  // Generate path for radiation pattern
  const patternPath = data.map((point, i) => {
    const { x, y } = getPoint(point.angle, point.gain);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ') + ' Z';

  // Generate grid circles
  const gridLevels = [0.25, 0.5, 0.75, 1.0];
  const gridCircles = gridLevels.map(level => (
    <circle
      key={level}
      cx={centerX}
      cy={centerY}
      r={maxRadius * level}
      fill="none"
      stroke="#30363d"
      strokeWidth="1"
      strokeDasharray={level === 1 ? "none" : "4 4"}
    />
  ));

  // Generate angle labels
  const angleLabels = [0, 45, 90, 135, 180, 225, 270, 315].map(angle => {
    const rad = (angle - 90) * Math.PI / 180;
    const labelRadius = maxRadius + 20;
    return {
      x: centerX + labelRadius * Math.cos(rad),
      y: centerY + labelRadius * Math.sin(rad),
      label: angle === 0 ? '0°' : angle === 90 ? '90°' : angle.toString()
    };
  });

  // Gradient fill for pattern
  const gradientId = `pattern-gradient-${antennaType}`;

  return (
    <div className="bg-bg-secondary rounded-lg border border-border-default p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-text-primary font-sans">Radiation Pattern</h3>
        <span className="text-xs text-text-secondary capitalize">{antennaType}</span>
      </div>

      <svg width={svgSize} height={svgSize} className="mx-auto">
        <defs>
          <radialGradient id={gradientId}>
            <stop offset="0%" stopColor="#58a6ff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#58a6ff" stopOpacity="0.1" />
          </radialGradient>
        </defs>

        {/* Grid circles */}
        {gridCircles}

        {/* Axis lines */}
        <line x1={centerX} y1={centerY - maxRadius - 5} x2={centerX} y2={centerY + maxRadius + 5} stroke="#30363d" strokeWidth="1" />
        <line x1={centerX - maxRadius - 5} y1={centerY} x2={centerX + maxRadius + 5} y2={centerY} stroke="#30363d" strokeWidth="1" />

        {/* Pattern fill */}
        <path d={patternPath} fill={`url(#${gradientId})`} />

        {/* Pattern outline */}
        <path
          d={patternPath}
          fill="none"
          stroke="#58a6ff"
          strokeWidth="2"
          className="drop-shadow-[0_0_4px_rgba(88,166,255,0.5)]"
        />

        {/* Main lobe indicator */}
        {data.map((point, i) => {
          if (point.gain === maxGain) {
            const { x, y } = getPoint(point.angle, point.gain);
            return (
              <g key="main-lobe">
                <circle cx={x} cy={y} r="6" fill="#3fb950" className="animate-pulse" />
                <circle cx={x} cy={y} r="10" fill="none" stroke="#3fb950" strokeWidth="2" opacity="0.5" className="animate-ping" />
              </g>
            );
          }
          return null;
        })}

        {/* Angle labels */}
        {angleLabels.map((item, i) => (
          <text
            key={i}
            x={item.x}
            y={item.y}
            fill="#8b949e"
            fontSize="11"
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="JetBrains Mono"
          >
            {item.label}
          </text>
        ))}

        {/* Center point */}
        <circle cx={centerX} cy={centerY} r="4" fill="#21262d" stroke="#58a6ff" strokeWidth="2" />

        {/* Gain ring labels */}
        <text x={centerX + 2} y={centerY - 5} fill="#58a6ff" fontSize="9" fontFamily="JetBrains Mono">
          {maxGain.toFixed(1)} dBi
        </text>
      </svg>

      <div className="grid grid-cols-2 gap-3 mt-4 text-center">
        <div className="bg-bg-tertiary rounded p-2">
          <div className="text-text-secondary text-xs mb-1">Max Gain</div>
          <div className="text-accent-green font-mono font-semibold">{maxGain.toFixed(1)} dBi</div>
        </div>
        <div className="bg-bg-tertiary rounded p-2">
          <div className="text-text-secondary text-xs mb-1">HPBW</div>
          <div className="text-accent-cyan font-mono font-semibold">{hpbw.toFixed(0)}°</div>
        </div>
        <div className="bg-bg-tertiary rounded p-2">
          <div className="text-text-secondary text-xs mb-1">Min Gain</div>
          <div className="text-accent-red font-mono font-semibold">{minGain.toFixed(1)} dBi</div>
        </div>
        <div className="bg-bg-tertiary rounded p-2">
          <div className="text-text-secondary text-xs mb-1">F/B Ratio</div>
          <div className="text-accent-orange font-mono font-semibold">{frontBackRatio.toFixed(1)} dB</div>
        </div>
      </div>
    </div>
  );
};
