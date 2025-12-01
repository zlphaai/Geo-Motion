import React from 'react';
import { TrigFunction } from '../types';

interface WaveGraphProps {
  angle: number;
  func: TrigFunction;
}

const WaveGraph: React.FC<WaveGraphProps> = ({ angle, func }) => {
  // SVG Config
  const width = 300;
  const height = 200;
  const padding = 20;
  const plotWidth = width - padding * 2;
  const plotHeight = height - padding * 2;
  const midY = height / 2;
  
  // X-axis: 0 to 4PI
  const maxX = 4 * Math.PI;
  const scaleX = plotWidth / maxX;
  const scaleY = (plotHeight / 2) * 0.8; // Leave some headroom

  // Generate Path
  let d = `M ${padding} ${midY}`;
  const points = [];
  
  for (let i = 0; i <= 100; i++) {
    const t = (i / 100) * maxX;
    let val = 0;
    
    if (func === TrigFunction.SIN) val = Math.sin(t);
    else if (func === TrigFunction.COS) val = Math.cos(t);
    else if (func === TrigFunction.TAN) {
      val = Math.tan(t);
      // Clamp tan for visual sanity
      val = Math.max(-3, Math.min(3, val)); 
    }

    const px = padding + t * scaleX;
    const py = midY - val * scaleY;
    
    if (i === 0) d = `M ${px} ${py}`;
    else {
      // Handle Tangent jumps
      if (func === TrigFunction.TAN && Math.abs(val) >= 3) {
         d += ` M ${px} ${py}`; 
      } else {
         d += ` L ${px} ${py}`;
      }
    }
    points.push({x: px, y: py});
  }

  // Current Position
  let currentVal = 0;
  if (func === TrigFunction.SIN) currentVal = Math.sin(angle);
  else if (func === TrigFunction.COS) currentVal = Math.cos(angle);
  else currentVal = Math.tan(angle);

  // Clamp currentVal for visualization if Tan
  const displayVal = func === TrigFunction.TAN ? Math.max(-3, Math.min(3, currentVal)) : currentVal;

  const cx = padding + angle * scaleX;
  const cy = midY - displayVal * scaleY;
  
  // Wrap around logic for the "current point" visual if angle > max
  const wrappedAngle = angle % maxX;
  const wrappedCx = padding + wrappedAngle * scaleX;
  const wrappedCy = midY - displayVal * scaleY;

  const mainColor = func === TrigFunction.SIN ? '#ef4444' : func === TrigFunction.COS ? '#3b82f6' : '#10b981';

  return (
    <div className="relative w-full aspect-[3/2] max-w-[400px] mx-auto bg-white rounded-xl shadow-inner border border-slate-200 overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        {/* Grid */}
        <line x1={padding} y1={midY} x2={width-padding} y2={midY} stroke="#cbd5e1" strokeWidth="1" />
        <line x1={padding} y1={padding} x2={padding} y2={height-padding} stroke="#cbd5e1" strokeWidth="1" />

        {/* Labels */}
        <text x={padding + (Math.PI * scaleX)} y={midY + 15} fontSize="8" fill="#94a3b8" textAnchor="middle">π</text>
        <text x={padding + (2 * Math.PI * scaleX)} y={midY + 15} fontSize="8" fill="#94a3b8" textAnchor="middle">2π</text>
        <text x={padding + (3 * Math.PI * scaleX)} y={midY + 15} fontSize="8" fill="#94a3b8" textAnchor="middle">3π</text>

        {/* The Wave */}
        <path d={d} fill="none" stroke={mainColor} strokeWidth="2" />

        {/* Current Value Marker */}
        <circle cx={wrappedCx} cy={wrappedCy} r="5" fill={mainColor} stroke="white" strokeWidth="2" />
        
        {/* Connection Line (visual aid) */}
        <line 
          x1={wrappedCx} 
          y1={wrappedCy} 
          x2={wrappedCx} 
          y2={midY} 
          stroke={mainColor} 
          strokeWidth="1" 
          strokeDasharray="2" 
        />
        
      </svg>
      <div className="absolute bottom-2 right-2 text-xs text-slate-500 font-mono">
        y = {func.toLowerCase()}(x)
      </div>
    </div>
  );
};

export default WaveGraph;
