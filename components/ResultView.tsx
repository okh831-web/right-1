
import React from 'react';
import { SermonAnalysis, ViewType } from '../types';
import { Quote, BookOpen, Star, Sparkles } from 'lucide-react';

interface ResultViewProps {
  data: SermonAnalysis;
  view: ViewType;
}

const ResultView: React.FC<ResultViewProps> = ({ data, view }) => {
  // 요약카드에서는 첫 번째 이미지를 대표 이미지로 사용
  const mainImage = data.generatedImages?.[0] || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000';

  if (view === ViewType.SUMMARY_CARD) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col items-center bg-nature-bokeh min-h-screen">
        <div className="relative w-full max-w-lg aspect-[4/6] rounded-[3rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.15)] border-[12px] border-white/80 bg-white group animate-in zoom-in duration-1000">
          <img src={mainImage} alt="Background" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[10s]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>
          
          <div className="absolute inset-0 p-10 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="bg-white/30 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/30 flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse"></div>
                <span className="text-white text-[10px] font-black tracking-[0.2em] uppercase">Sunday Grace</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                <Sparkles className="w-5 h-5 text-yellow-300" />
              </div>
            </div>
            
            <div className="flex flex-col">
              <h3 className="font-serif-sophisticated text-4xl md:text-5xl font-black text-white mb-2 leading-[1.15] drop-shadow-2xl">
                {data.title}
              </h3>
              <div className="flex items-center space-x-2 mb-6">
                <div className="h-px w-8 bg-blue-300"></div>
                <p className="text-blue-200 text-sm font-bold font-serif-sophisticated italic">
                  {data.scripture}
                </p>
              </div>
              
              <div className="space-y-4 mb-8">
                {data.summaryPoints.slice(0, 3).map((point, idx) => (
                  <div key={idx} className="group/item">
                    <h4 className="text-white text-base font-black mb-1 font-serif-sophisticated flex items-center">
                      <span className="w-5 h-5 rounded-full bg-indigo-500/50 flex items-center justify-center text-[10px] mr-2">0{idx+1}</span>
                      {point.title}
                    </h4>
                    <p className="text-white/80 text-xs leading-relaxed font-medium line-clamp-2 pl-7 border-l border-white/10">
                      {point.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-5 border-t border-white/20">
                <p className="text-white font-bold text-xs leading-relaxed font-serif-sophisticated italic opacity-90">
                  "{data.evangelismMessage.split('.')[0]}..."
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 w-full max-w-2xl flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
           <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-xl border border-white/50">
              <section className="mb-6">
                <h4 className="flex items-center text-indigo-400 font-black mb-3 uppercase tracking-[0.15em] text-[10px]">
                  <Quote className="w-4 h-4 mr-2 text-indigo-500" /> 설교의 핵심 울림
                </h4>
                <p className="text-xl text-gray-900 font-black leading-snug font-serif-sophisticated">
                  {data.coreTheme}
                </p>
              </section>
              <section>
                <h4 className="flex items-center text-pink-400 font-black mb-3 uppercase tracking-[0.15em] text-[10px]">
                  <Star className="w-4 h-4 mr-2 text-pink-500" /> 오늘의 이웃 초대
                </h4>
                <div className="p-6 rounded-3xl bg-pink-50/50 border border-pink-100/50 italic text-base text-gray-700 font-bold font-serif-sophisticated leading-relaxed">
                  "{data.evangelismMessage}"
                </div>
              </section>
           </div>
        </div>
      </div>
    );
  }

  // 인포그래픽 뷰
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 bg-white/30 backdrop-blur-sm rounded-[3rem] shadow-2xl border border-white/50 animate-in fade-in duration-1000">
      <div className="bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-gray-50">
        <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 p-12 md:p-16 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 blur-[100px] -mr-40 -mt-40"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-400/10 blur-[100px] -ml-40 -mb-40"></div>
          
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-black/20 relative z-10 border border-white/10">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <h2 className="font-serif-sophisticated text-3xl md:text-5xl font-black mb-3 tracking-tight relative z-10 leading-tight drop-shadow-lg">{data.title}</h2>
          <div className="inline-block px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 relative z-10">
            <p className="font-serif-sophisticated text-sm text-blue-100 font-bold italic tracking-wide">{data.scripture}</p>
          </div>
        </div>

        <div className="px-8 md:px-20 py-12 md:py-20 space-y-24 relative bg-white">
          <div className="absolute top-0 bottom-0 left-[3rem] md:left-1/2 w-px bg-gray-100 -z-0"></div>
          
          {data.summaryPoints.map((point, idx) => (
            <div key={idx} className={`relative flex flex-col md:flex-row items-center gap-12 ${idx % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
              <div className="w-12 h-12 bg-indigo-600 text-white border-[6px] border-white rounded-full flex items-center justify-center font-black text-base absolute left-0 md:left-1/2 md:-translate-x-1/2 top-0 md:top-1/2 md:-translate-y-1/2 z-20 shadow-xl shadow-indigo-100">
                {idx + 1}
              </div>

              <div className={`w-full md:w-1/2 ${idx % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                <div className="group text-center md:text-left">
                   <h5 className="text-indigo-600 font-black text-xs tracking-[0.2em] uppercase mb-2">Message 0{idx + 1}</h5>
                   <h4 className="text-gray-900 font-black text-2xl md:text-3xl mb-5 font-serif-sophisticated leading-tight">
                    {point.title}
                  </h4>
                  <p className="text-gray-600 text-base md:text-lg leading-relaxed font-medium font-serif-sophisticated text-justify md:text-left opacity-90">
                    {point.description}
                  </p>
                </div>
              </div>

              <div className={`w-full md:w-1/2 ${idx % 2 === 0 ? 'md:pl-12' : 'md:pr-12'}`}>
                <div className="relative aspect-square max-w-[320px] mx-auto rounded-[3.5rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.1)] border-[10px] border-gray-50/50 group hover:border-white transition-all duration-500">
                  <img 
                    src={data.generatedImages?.[idx] || 'https://via.placeholder.com/600'} 
                    alt={`Point ${idx + 1}`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[8s] ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
            </div>
          ))}

          <div className="relative pt-12 text-center">
            <div className="inline-block bg-gradient-to-br from-indigo-50/50 to-pink-50/50 px-12 py-10 rounded-[4rem] border border-white shadow-inner max-w-2xl">
              <h5 className="text-indigo-400 font-black mb-4 flex items-center justify-center uppercase tracking-[0.2em] text-[10px]">
                <Quote className="w-4 h-4 mr-2" /> 하나님의 말씀을 삶으로 <Sparkles className="w-4 h-4 ml-2" />
              </h5>
              <p className="text-gray-900 font-black text-2xl md:text-3xl leading-snug font-serif-sophisticated italic">
                "{data.coreTheme}"
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50/80 border-t border-gray-100 p-10 text-center">
            <div className="flex flex-wrap gap-3 justify-center">
                {data.keywords.map((kw, i) => (
                    <span key={i} className="px-5 py-2 bg-white border border-gray-200 rounded-full text-[11px] text-gray-500 font-black uppercase tracking-widest hover:border-indigo-300 hover:text-indigo-600 transition-all cursor-default shadow-sm">
                      #{kw}
                    </span>
                ))}
            </div>
            <p className="mt-8 text-[11px] text-gray-400 font-bold uppercase tracking-[0.4em] opacity-60">Heavenly Paradise • AI Design Studio</p>
        </div>
      </div>
    </div>
  );
};

export default ResultView;
