import React from 'react';
import { TrigFunction } from '../types';

interface UnitCircleProps {
  angle: number;
  func: TrigFunction;
}

const UnitCircle: React.FC<UnitCircleProps> = ({ angle, func }) => {
  // SVG Coordinate system: Center is (0,0), Radius is 100
  const R = 100;
  
  // Calculate tip position (flipped Y for SVG coords)
  const x = R * Math.cos(angle);
  const y = R * Math.sin(angle);
  const svgY = -y; // SVG y-axis is down, cartesian is up

  // Colors
  const mainColor = func === TrigFunction.SIN ? '#ef4444' : func === TrigFunction.COS ? '#3b82f6' : '#10b981';

  // Triangle path for Pythagorean visualization
  const trianglePath = `M 0 0 L ${x} 0 L ${x} ${svgY} Z`;

  return (
    <div className="relative w-full aspect-square max-w-[400px] mx-auto bg-white rounded-xl shadow-inner border border-slate-200 overflow-hidden">
      <svg 
        viewBox="-140 -140 280 280" 
        className="w-full h-full"
      >
        {/* Grid & Axes */}
        <line x1="-130" y1="0" x2="130" y2="0" stroke="#cbd5e1" strokeWidth="1" />
        <line x1="0" y1="-130" x2="0" y2="130" stroke="#cbd5e1" strokeWidth="1" />
        <circle cx="0" cy="0" r={R} fill="none" stroke="#e2e8f0" strokeWidth="2" />

        {/* Pythagorean Triangle Highlight */}
        <path d={trianglePath} fill={mainColor} fillOpacity="0.1" stroke="none" />

        {/* The Radius Line (Hypotenuse) */}
        <line x1="0" y1="0" x2={x} y2={svgY} stroke="#64748b" strokeWidth="2" />

        {/* Projection Lines based on function */}
        {func === TrigFunction.SIN && (
          <>
            {/* Project to Y axis */}
            <line x1={x} y1={svgY} x2={x} y2={0} stroke={mainColor} strokeWidth="2" strokeDasharray="4" opacity="0.5" />
            <line x1={x} y1={svgY} x2={0} y2={svgY} stroke={mainColor} strokeWidth="3" />
            <circle cx={0} cy={svgY} r="4" fill={mainColor} />
            <text x="5" y={svgY - 5} fontSize="10" fill={mainColor} fontWeight="bold">sin(θ)</text>
          </>
        )}

        {func === TrigFunction.COS && (
          <>
            {/* Project to X axis */}
            <line x1={x} y1={svgY} x2={0} y2={svgY} stroke={mainColor} strokeWidth="2" strokeDasharray="4" opacity="0.5" />
            <line x1={x} y1={svgY} x2={x} y2={0} stroke={mainColor} strokeWidth="3" />
            <circle cx={x} cy={0} r="4" fill={mainColor} />
            <text x={x + 5} y="-5" fontSize="10" fill={mainColor} fontWeight="bold">cos(θ)</text>
          </>
        )}

        {func === TrigFunction.TAN && (
          <>
            {/* Tangent line at x=1 (R) */}
            <line x1={R} y1={-200} x2={R} y2={200} stroke="#cbd5e1" strokeDasharray="2" />
            {/* Extend radius to hit tangent line */}
            {Math.abs(Math.cos(angle)) > 0.01 && (
               <line 
                 x1="0" 
                 y1="0" 
                 x2={R} 
                 y2={-R * Math.tan(angle)} 
                 stroke={mainColor} 
                 strokeWidth="1" 
                 opacity="0.5"
               />
            )}
            <line x1={R} y1="0" x2={R} y2={-R * Math.tan(angle)} stroke={mainColor} strokeWidth="3" />
            <circle cx={R} cy={-R * Math.tan(angle)} r="4" fill={mainColor} />
          </>
        )}

        {/* The Point on Circle */}
        <circle cx={x} cy={svgY} r="6" fill="#1e293b" />
        
        {/* Angle Arc */}
        <path 
          d={`M 30 0 A 30 30 0 ${angle > Math.PI ? 1 : 0} 0 ${30 * Math.cos(angle)} ${-30 * Math.sin(angle)}`}
          fill="none" 
          stroke="#94a3b8" 
          strokeWidth="2" 
        />
        <text x="10" y="-10" fontSize="10" fill="#64748b">θ</text>

      </svg>
      <div className="absolute bottom-2 left-2 text-xs text-slate-500 font-mono bg-white/80 px-1 rounded">
        r = 1
      </div>
    </div>
  );
};

export default UnitCircle;