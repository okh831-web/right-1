
import React, { useState, useCallback } from 'react';
import { analyzeSermon, generateSermonImage } from './geminiService';
import { SermonAnalysis, AppStep, ViewType } from './types';
import Layout from './components/Layout';
import SermonUpload from './components/SermonUpload';
import ResultView from './components/ResultView';
import { Loader2, Sparkles, X, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.IDLE);
  const [activeView, setActiveView] = useState<ViewType>(ViewType.SUMMARY_CARD);
  const [analysisResult, setAnalysisResult] = useState<SermonAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (text: string) => {
    if (!text.trim() || text.length < 10) {
      setError("설교 내용이 너무 짧습니다. 풍성한 분석을 위해 내용을 조금 더 채워주세요.");
      return;
    }
    
    setStep(AppStep.ANALYZING);
    setError(null);
    
    try {
      // 1. 텍스트 분석 진행 (3개의 고유 프롬프트 추출)
      const result = await analyzeSermon(text);
      
      setStep(AppStep.GENERATING_IMAGES);
      
      // 2. 3개의 프롬프트 각각에 대해 고유 이미지 생성
      const generatedImages: string[] = [];
      const imagePrompts = result.imagePrompts.slice(0, 3);
      
      // 각 프롬프트별로 개별 호출하며 인덱스를 전달하여 다양성 확보
      for (let i = 0; i < imagePrompts.length; i++) {
        try {
          const img = await generateSermonImage(imagePrompts[i], i);
          generatedImages.push(img);
        } catch (imgErr) {
          console.warn(`Image ${i+1} failed, using fallback.`);
          generatedImages.push('https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?q=80&w=1000');
        }
      }
      
      setAnalysisResult({
        ...result,
        generatedImages
      });
      setStep(AppStep.RESULT);
    } catch (err: any) {
      console.error(err);
      setError(err.message || '분석 중 오류가 발생했습니다.');
      setStep(AppStep.IDLE);
    }
  };

  const handleGoHome = useCallback(() => {
    setStep(AppStep.IDLE);
    setAnalysisResult(null);
    setError(null);
  }, []);

  const handleViewChange = (view: ViewType) => {
    setActiveView(view);
  };

  return (
    <Layout 
      activeView={activeView} 
      onViewChange={handleViewChange} 
      onGoHome={handleGoHome}
    >
      {step === AppStep.IDLE && (
        <SermonUpload onAnalyze={handleAnalyze} />
      )}

      {(step === AppStep.ANALYZING || step === AppStep.GENERATING_IMAGES) && (
        <div className="min-h-screen flex flex-col items-center justify-center bg-nature-bokeh p-6">
          <div className="bg-white/60 backdrop-blur-3xl p-10 md:p-20 rounded-[4rem] shadow-2xl flex flex-col items-center max-w-2xl text-center border border-white/80 animate-in zoom-in duration-500">
            <div className="relative mb-10">
               {step === AppStep.ANALYZING ? (
                 <div className="w-24 h-24 border-8 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
               ) : (
                 <div className="relative">
                   <Sparkles className="w-24 h-24 text-pink-500 animate-pulse" />
                   <div className="absolute -top-2 -right-2 bg-yellow-400 w-6 h-6 rounded-full animate-ping"></div>
                 </div>
               )}
            </div>
            
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">
              {step === AppStep.ANALYZING ? "말씀의 은혜를 깊게 분석 중입니다" : "말씀을 3가지 서로 다른 화폭에 담고 있습니다"}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 font-medium leading-relaxed">
              {step === AppStep.ANALYZING 
                ? "AI가 설교의 핵심 포인트를 정교하게 정리하고 있습니다." 
                : "각 대지에 어울리는 3가지 고유한 이미지를 AI가 정성껏 그리고 있습니다."}
            </p>
            
            <div className="mt-10 w-full bg-gray-100 h-2 rounded-full overflow-hidden">
               <div className={`h-full bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-500 transition-all duration-[15s] ${step === AppStep.ANALYZING ? 'w-1/3' : 'w-[95%]'}`}></div>
            </div>
          </div>
        </div>
      )}

      {step === AppStep.RESULT && analysisResult && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 pt-24 pb-20">
           <ResultView data={analysisResult} view={activeView} />
        </div>
      )}

      {error && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4">
          <div className="bg-white/90 backdrop-blur-xl border border-red-100 text-red-600 px-8 py-4 rounded-3xl shadow-2xl font-bold flex items-center space-x-3">
            <AlertCircle className="w-6 h-6" />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-4 p-1 hover:bg-red-50 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
