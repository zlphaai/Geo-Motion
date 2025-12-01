
import React, { useState, useEffect, useRef } from 'react';
import UnitCircle from './components/UnitCircle';
import WaveGraph from './components/WaveGraph';
import Controls from './components/Controls';
import { TrigFunction, QuizState } from './types';
import { Brain, Sigma, Trophy, CheckCircle, XCircle, ArrowRight, Target } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [angle, setAngle] = useState<number>(0.785); // Start at 45 degrees
  const [func, setFunc] = useState<TrigFunction>(TrigFunction.SIN);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1.0);
  
  // Quiz State
  const [quiz, setQuiz] = useState<QuizState>({
    isActive: false,
    options: [],
    correctOptionIndex: 0,
    selectedOptionIndex: null,
    score: 0,
    total: 0
  });

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

  // Quiz Logic
  const startChallenge = () => {
    setIsPlaying(false);
    
    // 1. Random Angle
    const randomAngle = Math.random() * 4 * Math.PI;
    setAngle(randomAngle);

    // 2. Calculate Value
    let val = 0;
    if (func === TrigFunction.SIN) val = Math.sin(randomAngle);
    else if (func === TrigFunction.COS) val = Math.cos(randomAngle);
    else val = Math.tan(randomAngle);

    // 3. Generate Options
    const correctVal = val.toFixed(2);
    const optionsSet = new Set<string>();
    optionsSet.add(correctVal);

    // Add reasonable distractors
    optionsSet.add((-val).toFixed(2)); // Sign error
    if (Math.abs(val) < 0.9) optionsSet.add((val > 0 ? 1 - val : -1 - val).toFixed(2)); // Complement errorish
    optionsSet.add((val + (Math.random() * 0.4 + 0.1)).toFixed(2));
    optionsSet.add((val - (Math.random() * 0.4 + 0.1)).toFixed(2));

    // Fallback fill
    while (optionsSet.size < 4) {
        optionsSet.add(((Math.random() * 2 - 1) * (func === TrigFunction.TAN ? 3 : 1)).toFixed(2));
    }

    const options = Array.from(optionsSet).slice(0, 4).sort(() => Math.random() - 0.5);
    const correctIndex = options.indexOf(correctVal);

    setQuiz(prev => ({
        ...prev,
        isActive: true,
        options,
        correctOptionIndex: correctIndex,
        selectedOptionIndex: null,
    }));
  };

  const handleAnswer = (index: number) => {
    if (quiz.selectedOptionIndex !== null) return; // Prevent multi-click

    const isCorrect = index === quiz.correctOptionIndex;
    setQuiz(prev => ({
        ...prev,
        selectedOptionIndex: index,
        score: isCorrect ? prev.score + 1 : prev.score,
        total: prev.total + 1
    }));
  };

  const nextQuestion = () => {
      startChallenge();
  };

  const endQuiz = () => {
      setQuiz(prev => ({ ...prev, isActive: false, selectedOptionIndex: null }));
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
          <div className="flex items-center space-x-4">
             {quiz.total > 0 && (
                 <div className="hidden sm:flex items-center text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    <Trophy size={14} className="mr-2 text-amber-500" />
                    得分: {quiz.score} / {quiz.total}
                 </div>
             )}
             <div className="text-xs font-medium text-slate-400 border border-slate-200 px-3 py-1 rounded-full">
                React Visuals
             </div>
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
                           {func === TrigFunction.SIN ? 'y' : func === TrigFunction.COS ? 'x' : '斜率'} = 
                           <span className={
                                quiz.isActive && quiz.selectedOptionIndex === null
                                ? 'bg-slate-200 text-transparent rounded ml-2 select-none blur-sm' // Hide value during quiz
                                : (func === TrigFunction.SIN ? 'text-red-500 ml-2' : func === TrigFunction.COS ? 'text-blue-500 ml-2' : 'text-emerald-500 ml-2')
                           }>
                            {func === TrigFunction.SIN ? Math.sin(angle).toFixed(3) : func === TrigFunction.COS ? Math.cos(angle).toFixed(3) : Math.tan(angle).toFixed(3)}
                           </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Quiz / Info Panel */}
            {quiz.isActive ? (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 p-6 rounded-2xl animate-in fade-in zoom-in duration-300">
                    <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-amber-900 mb-2">
                            视觉估算挑战
                        </h3>
                        <p className="text-amber-800">
                            根据上方图表，估算 <strong>{func}({((angle % (2 * Math.PI)) * 180 / Math.PI).toFixed(0)}°)</strong> 的值是多少？
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {quiz.options.map((opt, idx) => {
                            let btnClass = "py-4 text-lg font-mono font-bold rounded-xl border-2 transition-all ";
                            if (quiz.selectedOptionIndex === null) {
                                btnClass += "bg-white border-amber-200 text-amber-900 hover:border-amber-400 hover:shadow-md hover:-translate-y-1";
                            } else {
                                if (idx === quiz.correctOptionIndex) {
                                    btnClass += "bg-green-500 border-green-600 text-white shadow-lg scale-105";
                                } else if (idx === quiz.selectedOptionIndex) {
                                    btnClass += "bg-red-400 border-red-500 text-white opacity-50";
                                } else {
                                    btnClass += "bg-slate-100 border-slate-200 text-slate-400 opacity-50";
                                }
                            }

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(idx)}
                                    disabled={quiz.selectedOptionIndex !== null}
                                    className={btnClass}
                                >
                                    {opt}
                                </button>
                            );
                        })}
                    </div>

                    {quiz.selectedOptionIndex !== null && (
                        <div className="flex items-center justify-between bg-white/50 p-4 rounded-xl border border-amber-100">
                            <div className="flex items-center space-x-2">
                                {quiz.selectedOptionIndex === quiz.correctOptionIndex ? (
                                    <>
                                        <CheckCircle className="text-green-600" />
                                        <span className="font-bold text-green-700">回答正确！观察力很敏锐！</span>
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="text-red-500" />
                                        <span className="font-bold text-red-600">
                                            差点就对了！正确答案是 {quiz.options[quiz.correctOptionIndex]}
                                        </span>
                                    </>
                                )}
                            </div>
                            <div className="flex space-x-2">
                                <button 
                                    onClick={endQuiz}
                                    className="px-4 py-2 text-slate-500 hover:text-slate-700 text-sm font-bold"
                                >
                                    结束
                                </button>
                                <button 
                                    onClick={nextQuestion}
                                    className="flex items-center space-x-1 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold shadow-md transition-transform active:scale-95"
                                >
                                    <span>下一题</span>
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200">
                    <h3 className="font-bold text-slate-700 mb-2">数学之美</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        图中高亮的三角形直观地展示了<strong>勾股恒等式 (Pythagorean Identity)</strong>。无论旋转角度如何变化，余弦(x)的平方加上正弦(y)的平方总是等于圆的半径平方(1)。
                    </p>
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
                    setQuiz(prev => ({ ...prev, isActive: false, selectedOptionIndex: null }));
                }}
                onStartQuiz={startChallenge}
                quizActive={quiz.isActive}
            />

            {/* Instruction Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-3 flex items-center">
                    <Target size={18} className="mr-2 text-indigo-500"/>
                    玩法说明
                </h3>
                <ul className="text-sm text-slate-600 space-y-2 list-disc pl-4">
                    <li>拖动上方滑块或点击播放按钮观察函数变化。</li>
                    <li>点击<strong>“开始视觉估算挑战”</strong>进入测验模式。</li>
                    <li>根据单位圆线段长度或波形高度，目测并选出正确的数值。</li>
                    <li>挑战自己，看看能连续答对多少题！</li>
                </ul>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
};

export default App;
