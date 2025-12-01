import React, { useState, useEffect, useRef } from 'react';
import UnitCircle from './components/UnitCircle';
import WaveGraph from './components/WaveGraph';
import Controls from './components/Controls';
import { TrigFunction } from './types';
import { getMathExplanation } from './services/geminiService';
import { Sparkles, Brain, Sigma } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [angle, setAngle] = useState<number>(0.785); // Start at 45 degrees
  const [func, setFunc] = useState<TrigFunction>(TrigFunction.SIN);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1.0);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState<boolean>(false);

  // Animation Loop
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = (time - previousTimeRef.current) / 1000;
      setAngle((prevAngle) => (prevAngle + deltaTime * speed) % (4 * Math.PI));
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      previousTimeRef.current = undefined;
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, speed]);

  // Handle Gemini Request
  const handleExplain = async () => {
    setIsExplaining(true);
    setExplanation(null);
    const result = await getMathExplanation(func, angle);
    setExplanation(result);
    setIsExplaining(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-100">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <Brain size={20} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              GeoMotion 几何演示
            </h1>
          </div>
          <div className="text-xs font-medium text-slate-400 border border-slate-200 px-3 py-1 rounded-full">
            React + Gemini 2.5
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Visualizations Column */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Unit Circle Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center relative">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 w-full text-left">几何公式</h2>
                    <UnitCircle angle={angle} func={func} />
                    
                    {/* Live Formula Block */}
                    <div className="mt-4 w-full p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm">
                        <div className="font-mono text-center text-slate-600 flex items-center justify-center space-x-2">
                            <Sigma size={16} className="text-indigo-400" />
                            <span>
                                <span className="text-blue-500 font-bold">cos²θ</span> + 
                                <span className="text-red-500 font-bold"> sin²θ</span> = 
                                <span className="font-bold text-slate-800"> 1</span>
                            </span>
                        </div>
                        <div className="font-mono text-center text-xs text-slate-400 mt-2 border-t border-slate-200 pt-2">
                            ({Math.pow(Math.cos(angle), 2).toFixed(2)}) + ({Math.pow(Math.sin(angle), 2).toFixed(2)}) ≈ 1.00
                        </div>
                    </div>
                </div>

                {/* Wave Graph Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 w-full text-left">波形输出</h2>
                    <WaveGraph angle={angle} func={func} />
                    <div className="mt-4 text-center">
                         <p className="text-lg font-mono text-slate-500">
                            θ = {(angle * 180 / Math.PI).toFixed(1)}°
                         </p>
                         <p className="text-2xl font-mono font-bold text-slate-700 mt-2">
                           {func === TrigFunction.SIN ? 'y' : func === TrigFunction.COS ? 'x' : '斜率'} = <span className={
                               func === TrigFunction.SIN ? 'text-red-500' : func === TrigFunction.COS ? 'text-blue-500' : 'text-emerald-500'
                           }>
                            {func === TrigFunction.SIN ? Math.sin(angle).toFixed(3) : func === TrigFunction.COS ? Math.cos(angle).toFixed(3) : Math.tan(angle).toFixed(3)}
                           </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Explanation Panel */}
            {explanation && (
                <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 p-6 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-start space-x-3">
                        <Sparkles className="text-violet-500 mt-1 flex-shrink-0" size={20} />
                        <div>
                            <h3 className="font-bold text-violet-900 mb-2">AI 数学导师说：</h3>
                            <p className="text-violet-800 leading-relaxed whitespace-pre-wrap">{explanation}</p>
                        </div>
                    </div>
                </div>
            )}
          </div>

          {/* Controls Column */}
          <div className="lg:col-span-4 space-y-6">
            <Controls 
                angle={angle} 
                setAngle={setAngle}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                speed={speed}
                setSpeed={setSpeed}
                func={func}
                setFunc={(f) => {
                    setFunc(f);
                    setExplanation(null); // Clear old explanation on change
                }}
                onExplain={handleExplain}
                isExplaining={isExplaining}
            />

            {/* Static Info Card */}
            <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200">
                <h3 className="font-bold text-slate-700 mb-2">数学之美</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                    图中高亮的三角形直观地展示了<strong>勾股恒等式 (Pythagorean Identity)</strong>。无论旋转角度如何变化，余弦(x)的平方加上正弦(y)的平方总是等于圆的半径平方(1)。
                </p>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
};

export default App;