import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import { S11DataPoint } from '../../types';

interface S11PlotsProps {
  data: S11DataPoint[];
  centerFrequency: number;
}

export const S11Plots: React.FC<S11PlotsProps> = ({ data, centerFrequency }) => {
  const chartData = useMemo(() => {
    return data.map(point => ({
      freq: point.frequency,
      real: parseFloat(point.real.toFixed(4)),
      imag: parseFloat(point.imag.toFixed(4)),
      mag: parseFloat(point.magnitude.toFixed(2)),
      phase: parseFloat(point.phase.toFixed(1))
    }));
  }, [data]);

  const minDB = useMemo(() => {
    const mags = data.map(d => d.magnitude);
    return Math.min(...mags);
  }, [data]);

  const bandwidth10dB = useMemo(() => {
    const threshold = minDB + 10;
    let startFreq = data[0].frequency;
    let endFreq = data[data.length - 1].frequency;

    for (let i = 0; i < data.length; i++) {
      if (data[i].magnitude <= threshold && i > 0) {
        startFreq = data[i].frequency;
        break;
      }
    }

    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].magnitude <= threshold && i < data.length - 1) {
        endFreq = data[i].frequency;
        break;
      }
    }

    return { start: startFreq, end: endFreq, bw: endFreq - startFreq };
  }, [data, minDB]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-bg-tertiary border border-border-default rounded p-3 shadow-lg">
          <p className="text-text-primary font-mono text-sm mb-2">
            {data.freq.toFixed(1)} MHz
          </p>
          <div className="space-y-1 text-xs">
            <p className="text-text-secondary">
              Real(Γ): <span className="text-accent-cyan font-mono">{data.real}</span>
            </p>
            <p className="text-text-secondary">
              Imag(Γ): <span className="text-accent-orange font-mono">{data.imag}</span>
            </p>
            <p className="text-text-secondary">
              |S11|: <span className="text-accent-green font-mono">{data.mag.toFixed(2)} dB</span>
            </p>
            <p className="text-text-secondary">
              Phase: <span className="text-accent-red font-mono">{data.phase.toFixed(1)}°</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Real and Imaginary Parts */}
      <div className="bg-bg-secondary rounded-lg border border-border-default p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-text-primary font-sans">Reflection Coefficient</h3>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-accent-cyan"></div>
              <span className="text-text-secondary">Re(Γ)</span>
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-accent-orange"></div>
              <span className="text-text-secondary">Im(Γ)</span>
            </span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
            <XAxis
              dataKey="freq"
              stroke="#8b949e"
              tick={{ fill: '#8b949e', fontSize: 10 }}
              tickFormatter={(value) => `${value}`}
            />
            <YAxis
              stroke="#8b949e"
              tick={{ fill: '#8b949e', fontSize: 10 }}
              domain={[-1, 1]}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x={centerFrequency} stroke="#58a6ff" strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="real"
              stroke="#58a6ff"
              strokeWidth={2}
              dot={false}
              name="Re(Γ)"
            />
            <Line
              type="monotone"
              dataKey="imag"
              stroke="#d29922"
              strokeWidth={2}
              dot={false}
              name="Im(Γ)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Magnitude (dB) */}
      <div className="bg-bg-secondary rounded-lg border border-border-default p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-text-primary font-sans">S11 Magnitude</h3>
          <span className="text-xs text-text-secondary">dB scale</span>
        </div>

        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
            <XAxis
              dataKey="freq"
              stroke="#8b949e"
              tick={{ fill: '#8b949e', fontSize: 10 }}
              tickFormatter={(value) => `${value}`}
            />
            <YAxis
              stroke="#8b949e"
              tick={{ fill: '#8b949e', fontSize: 10 }}
              domain={[-40, 0]}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x={centerFrequency} stroke="#58a6ff" strokeDasharray="3 3" />
            <ReferenceLine y={-10} stroke="#f85149" strokeDasharray="3 3" strokeWidth={1} />
            <ReferenceLine y={minDB} stroke="#3fb950" strokeDasharray="3 3" strokeWidth={1} label={{ value: `${minDB.toFixed(1)} dB`, fill: '#3fb950', fontSize: 10 }} />
            <Line
              type="monotone"
              dataKey="mag"
              stroke="#3fb950"
              strokeWidth={2}
              dot={false}
              name="|S11| dB"
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="flex justify-between text-xs text-text-secondary mt-2 px-2">
          <span>-40 dB</span>
          <span>-20 dB</span>
          <span>-10 dB threshold</span>
          <span>0 dB</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-bg-secondary rounded-lg border border-border-default p-4">
        <h3 className="text-sm font-medium text-text-primary font-sans mb-3">S11 Summary</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-bg-tertiary rounded p-2">
            <div className="text-text-secondary text-xs mb-1">Min Return Loss</div>
            <div className="text-accent-green font-mono font-semibold">{minDB.toFixed(2)} dB</div>
          </div>
          <div className="bg-bg-tertiary rounded p-2">
            <div className="text-text-secondary text-xs mb-1">Bandwidth (-10dB)</div>
            <div className="text-accent-cyan font-mono font-semibold">{bandwidth10dB.bw.toFixed(1)} MHz</div>
          </div>
          <div className="bg-bg-tertiary rounded p-2">
            <div className="text-text-secondary text-xs mb-1">Start Freq</div>
            <div className="text-accent-orange font-mono font-semibold">{bandwidth10dB.start.toFixed(1)} MHz</div>
          </div>
          <div className="bg-bg-tertiary rounded p-2">
            <div className="text-text-secondary text-xs mb-1">End Freq</div>
            <div className="text-accent-orange font-mono font-semibold">{bandwidth10dB.end.toFixed(1)} MHz</div>
          </div>
        </div>
      </div>
    </div>
  );
};
