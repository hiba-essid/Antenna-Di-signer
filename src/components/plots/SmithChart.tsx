import React, { useRef, useEffect } from 'react';
import { ComplexNumber } from '../../types';

interface SmithChartProps {
  impedance: ComplexNumber;
  loadImpedance: ComplexNumber;
  matchedPoint?: ComplexNumber;
  stubPosition?: { mloc: number; mtsep: number };
}

export const SmithChart: React.FC<SmithChartProps> = ({
  impedance,
  loadImpedance,
  matchedPoint,
  stubPosition
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw Smith chart background
    ctx.strokeStyle = '#30363d';
    ctx.lineWidth = 1;

    // Draw outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw constant resistance circles (real part)
    const rValues = [0, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100];
    rValues.forEach(r => {
      const center = r / (r + 1);
      const rCircle = 1 / (r + 1);

      ctx.beginPath();
      ctx.arc(
        centerX + center * radius,
        centerY,
        rCircle * radius,
        0,
        2 * Math.PI
      );
      ctx.stroke();
    });

    // Draw constant reactance arcs (imaginary part)
    const xValues = [0.2, 0.5, 1, 2, 5, 10, 20, 50];
    xValues.forEach(x => {
      // Positive reactance
      ctx.beginPath();
      ctx.arc(
        centerX + radius,
        centerY - radius / x,
        radius / x,
        -Math.PI / 2,
        Math.PI / 2
      );
      ctx.stroke();

      // Negative reactance
      ctx.beginPath();
      ctx.arc(
        centerX + radius,
        centerY + radius / x,
        radius / x,
        Math.PI / 2,
        3 * Math.PI / 2
      );
      ctx.stroke();
    });

    // Draw x = 0 line (real axis)
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Draw labels
    ctx.fillStyle = '#8b949e';
    ctx.font = '11px JetBrains Mono';
    ctx.textAlign = 'center';

    // Resistance labels
    [0, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100].forEach(r => {
      const labelX = centerX + (r / (r + 1)) * radius + (1 / (r + 1)) * radius * 0.3;
      if (labelX < centerX + radius - 10) {
        ctx.fillText(r.toString(), labelX, centerY + 15);
      }
    });

    // Reactance labels
    [0.5, 1, 2, 5, 10].forEach(x => {
      ctx.fillText(x.toString(), centerX + radius + 10, centerY - radius / x + 4);
      ctx.fillText((-x).toString(), centerX + radius + 10, centerY + radius / x + 4);
    });

    // Draw infinity point
    ctx.fillText('∞', centerX + radius - 5, centerY + 15);

    // Normalize impedance for Smith chart
    const normalizeImpedance = (z: ComplexNumber, z0: number = 50): ComplexNumber => {
      return { real: z.real / z0, imag: z.imag / z0 };
    };

    const normalizedImpedance = normalizeImpedance(impedance);
    const normalizedLoad = normalizeImpedance(loadImpedance);

    // Calculate reflection coefficient for a point
    const gammaFromZ = (z: ComplexNumber) => {
      const zr = z.real;
      const zi = z.imag;
      const gammaReal = (zr * zr + zi * zi - 1) / (zr * zr + zi * zi + 2 * zr + 1);
      const gammaImag = (2 * zi) / (zr * zr + zi * zi + 2 * zr + 1);
      return { real: gammaReal, imag: gammaImag };
    };

    // Convert gamma to canvas coordinates
    const gammaToCanvas = (gamma: { real: number; imag: number }) => {
      const gMag = Math.sqrt(gamma.real * gamma.real + gamma.imag * gamma.imag);
      if (gMag > 1) {
        // Point outside unit circle - normalize
        return {
          x: centerX + (gamma.real / gMag) * radius * 0.9,
          y: centerY - (gamma.imag / gMag) * radius * 0.9
        };
      }
      return {
        x: centerX + gamma.real * radius,
        y: centerY - gamma.imag * radius
      };
    };

    // Draw load impedance point
    const loadGamma = gammaFromZ(normalizedLoad);
    const loadPos = gammaToCanvas(loadGamma);

    ctx.beginPath();
    ctx.arc(loadPos.x, loadPos.y, 6, 0, 2 * Math.PI);
    ctx.fillStyle = '#f85149';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#f85149';
    ctx.font = 'bold 10px IBM Plex Sans';
    ctx.textAlign = 'left';
    ctx.fillText('Load', loadPos.x + 10, loadPos.y - 5);

    // Draw current impedance point
    const impGamma = gammaFromZ(normalizedImpedance);
    const impPos = gammaToCanvas(impGamma);

    ctx.beginPath();
    ctx.arc(impPos.x, impPos.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#58a6ff';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#58a6ff';
    ctx.fillText('Z', impPos.x + 8, impPos.y + 4);

    // Draw matching path if matched point exists
    if (matchedPoint) {
      const matchedNormalized = normalizeImpedance(matchedPoint);
      const matchedGamma = gammaFromZ(matchedNormalized);
      const matchedPos = gammaToCanvas(matchedGamma);

      // Draw path from load to matched
      ctx.beginPath();
      ctx.moveTo(loadPos.x, loadPos.y);

      // Arc toward matched point (simplified - straight line)
      const midX = (loadPos.x + matchedPos.x) / 2;
      const midY = (loadPos.y + matchedPos.y) / 2;
      ctx.quadraticCurveTo(midX + 30, midY - 30, matchedPos.x, matchedPos.y);

      ctx.strokeStyle = '#3fb950';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw matched point
      ctx.beginPath();
      ctx.arc(matchedPos.x, matchedPos.y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#3fb950';
      ctx.fill();

      // Draw stub indicator
      if (stubPosition) {
        ctx.fillStyle = '#d29922';
        ctx.textAlign = 'right';
        ctx.fillText(`mloc: ${stubPosition.mloc.toFixed(1)}mm`, width - 10, 25);
        ctx.fillText(`mtsep: ${stubPosition.mtsep.toFixed(1)}mm`, width - 10, 40);
      }
    }

    // Draw VSWR circle if impedance is off-center
    if (Math.abs(normalizedImpedance.real - 1) > 0.1 || Math.abs(normalizedImpedance.imag) > 0.1) {
      const impGamma = gammaFromZ(normalizedImpedance);
      const gMag = Math.sqrt(impGamma.real * impGamma.real + impGamma.imag * impGamma.imag);

      if (gMag < 1 && gMag > 0.01) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, gMag * radius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#d29922';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

  }, [impedance, loadImpedance, matchedPoint, stubPosition]);

  return (
    <div className="bg-bg-secondary rounded-lg border border-border-default p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-text-primary font-sans">Smith Chart</h3>
        <span className="text-xs text-text-secondary">Normalized Z₀ = 1</span>
      </div>

      <canvas
        ref={canvasRef}
        width={340}
        height={340}
        className="mx-auto block"
      />

      <div className="flex justify-center gap-6 mt-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent-cyan"></div>
          <span className="text-text-secondary">Feed Point</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent-red"></div>
          <span className="text-text-secondary">Load</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent-green"></div>
          <span className="text-text-secondary">Matched</span>
        </div>
      </div>
    </div>
  );
};
