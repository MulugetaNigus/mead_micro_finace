'use client';

import { useEffect, useRef } from 'react';

export default function AnimatedLineChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Chart data
    const dataPoints = [10, 25, 35, 48, 62, 75, 85, 92, 98, 105, 110, 118];
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const maxValue = 120;

    let animationProgress = 0;
    let isAnimating = true;

    const drawChart = () => {
      // Clear canvas
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines
      ctx.strokeStyle = 'rgba(10, 46, 92, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = padding + (chartHeight / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
      }

      // Draw axes
      ctx.strokeStyle = '#6B7280';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(padding, canvas.height - padding);
      ctx.lineTo(canvas.width - padding, canvas.height - padding);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(padding, padding);
      ctx.lineTo(padding, canvas.height - padding);
      ctx.stroke();

      // Draw axis labels
      ctx.fillStyle = '#6B7280';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'right';
      for (let i = 0; i <= 4; i++) {
        const value = Math.round((maxValue / 4) * i);
        const y = canvas.height - padding + (chartHeight / 4) * i;
        ctx.fillText(value.toString(), padding - 10, y + 5);
      }

      // Draw line chart with animation
      const animatedPoints = dataPoints.map((val, idx) => {
        const progress = Math.max(0, Math.min(1, animationProgress - (idx / dataPoints.length) * 0.3));
        return val * progress;
      });

      // Draw animated line
      ctx.strokeStyle = '#0A2E5C';
      ctx.lineWidth = 3;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.beginPath();

      animatedPoints.forEach((val, idx) => {
        const x = padding + (chartWidth / (dataPoints.length - 1)) * idx;
        const y = canvas.height - padding - (val / maxValue) * chartHeight;

        if (idx === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();

      // Draw data points
      ctx.fillStyle = '#0A2E5C';
      animatedPoints.forEach((val, idx) => {
        if (val > 0) {
          const x = padding + (chartWidth / (dataPoints.length - 1)) * idx;
          const y = canvas.height - padding - (val / maxValue) * chartHeight;
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fill();

          // Draw point glow on last point
          if (idx === animatedPoints.length - 1 && val > 0) {
            ctx.strokeStyle = 'rgba(0, 154, 68, 0.3)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x, y, 10, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      });

      // Draw filled area under curve
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = '#0A2E5C';
      ctx.beginPath();
      ctx.moveTo(padding, canvas.height - padding);

      animatedPoints.forEach((val, idx) => {
        const x = padding + (chartWidth / (dataPoints.length - 1)) * idx;
        const y = canvas.height - padding - (val / maxValue) * chartHeight;
        ctx.lineTo(x, y);
      });

      ctx.lineTo(canvas.width - padding, canvas.height - padding);
      ctx.fill();
      ctx.globalAlpha = 1;

      // Update animation progress
      if (isAnimating) {
        animationProgress += 0.015;
        if (animationProgress > 1.3) {
          animationProgress = 0;
        }
      }

      requestAnimationFrame(drawChart);
    };

    drawChart();

    return () => {
      isAnimating = false;
    };
  }, []);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl" style={{
      boxShadow: '0 25px 60px rgba(10, 46, 92, 0.15)',
      borderRadius: '16px',
      backgroundColor: '#FFFFFF',
      border: '1px solid #E5E7EB'
    }}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{
          minHeight: '400px'
        }}
      />
      
      {/* Chart Title */}
      <div className="absolute top-6 left-6 z-10">
        <p className="text-sm font-semibold text-gray-900">Savings Growth</p>
        <p className="text-xs text-gray-600 mt-1">Monthly progression in ETB</p>
      </div>

      {/* Chart Legend */}
      <div className="absolute bottom-6 right-6 z-10 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#0A2E5C' }} />
          <span className="text-xs font-medium text-gray-700">Member Savings</span>
        </div>
      </div>
    </div>
  );
}
