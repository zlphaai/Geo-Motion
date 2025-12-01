import React from 'react';
import { TrigFunction } from '../types';
import { Play, Pause, RotateCcw, Info } from 'lucide-react';

interface ControlsProps {
  angle: number;
  setAngle: (a: number) => void;
  isPlaying: boolean;
  setIsPlaying: (p: boolean) => void;
  speed: number;
  setSpeed: (s: number) => void;
  func: TrigFunction;
  setFunc: (f: TrigFunction) => void;
  onExplain: () => void;
  isExplaining: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  angle,
  setAngle,
  isPlaying,
  setIsPlaying,
  speed,
  setSpeed,
  func,
  setFunc,
  onExplain,
  isExplaining
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
      
      {/* Function Selection */}
      <div className="flex justify-center space-x-2">
        {(Object.keys(TrigFunction) as Array<keyof typeof TrigFunction>).map((f) => (
          <button
            key={f}
            onClick={() => setFunc(TrigFunction[f])}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              func === TrigFunction[f]
                ? func === 'SIN' ? 'bg-red-500 text-white shadow-md' : func === 'COS' ? 'bg-blue-500 text-white shadow-md' : 'bg-emerald-500 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Main Slider */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <span>角度 (θ)</span>
          <span>{((angle % (2 * Math.PI)) * 180 / Math.PI).toFixed(0)}°</span>
        </div>
        <input
          type="range"
          min="0"
          max={4 * Math.PI}
          step="0.01"
          value={angle}
          onChange={(e) => {
            setAngle(parseFloat(e.target.value));
            setIsPlaying(false);
          }}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm active:scale-95"
            title={isPlaying ? "暂停" : "播放"}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button
            onClick={() => {
              setAngle(0);
              setIsPlaying(false);
            }}
            className="p-3 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            title="重置"
          >
            <RotateCcw size={20} />
          </button>
        </div>

        <div className="flex items-center space-x-3">
            <span className="text-xs font-bold text-slate-400">速度</span>
            <input 
                type="range" 
                min="0.1" 
                max="2.0" 
                step="0.1" 
                value={speed} 
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-24 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
        </div>
      </div>

      {/* AI Tutor Button */}
      <div className="pt-2 border-t border-slate-100">
        <button
          onClick={onExplain}
          disabled={isExplaining}
          className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
        >
            <Info size={18} />
            <span>{isExplaining ? 'AI 正在思考...' : '解释当前状态'}</span>
        </button>
      </div>

    </div>
  );
};

export default Controls;