
import React, { useState, useRef } from 'react';
import { CloudUpload, Play, Sparkles } from 'lucide-react';

interface SermonUploadProps {
  onAnalyze: (text: string) => void;
}

const SermonUpload: React.FC<SermonUploadProps> = ({ onAnalyze }) => {
  const [isReading, setIsReading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    // @ts-ignore
    const pdfjsLib = window.pdfjsLib;
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      fullText += content.items.map((item: any) => item.str).join(' ') + '\n';
    }
    return fullText;
  };

  const handleFile = async (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension !== 'pdf') {
      alert("PDF 파일만 업로드 가능합니다.");
      return;
    }

    setIsReading(true);
    try {
      const extractedText = await extractTextFromPDF(file);
      if (extractedText.trim().length < 10) throw new Error("PDF에서 텍스트를 추출할 수 없습니다. 내용이 있는 PDF 파일인지 확인해주세요.");
      onAnalyze(extractedText);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsReading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="relative w-full h-screen bg-nature-bokeh flex flex-col items-center justify-center px-4 overflow-hidden">
      <div className="mb-6 animate-in fade-in duration-1000 animate-float">
         <div className="px-10 py-3 rounded-full bg-white/40 backdrop-blur-xl border border-white/60 shadow-lg shadow-white/20 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span className="font-serif-sophisticated italic text-indigo-700 text-xl md:text-2xl font-black tracking-wide">Heavenly Paradise</span>
            <Sparkles className="w-4 h-4 text-indigo-500" />
         </div>
      </div>

      <div className="text-center mb-10 max-w-4xl animate-in fade-in slide-in-from-top-4 duration-1000 delay-200">
        <h2 className="text-5xl md:text-[84px] font-black mb-6 text-gray-900 tracking-tighter leading-[1.1]">
          말씀에 <span className="text-gradient-purple">영감</span>을 더하다
        </h2>
        <div className="space-y-2">
          <p className="text-lg md:text-2xl text-gray-700 font-bold leading-relaxed">
            업로드한 말씀이 <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">AI 디자인</span>을 만나
          </p>
          <p className="text-lg md:text-2xl text-gray-700 font-bold leading-relaxed">
            가장 아름다운 전도용 카드로 태어납니다.
          </p>
        </div>
      </div>

      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`w-full max-w-xl aspect-[1.8/1] rounded-[3rem] upload-dashed-box flex flex-col items-center justify-center cursor-pointer transition-all duration-500 group relative overflow-hidden ${isDragging ? 'scale-105 border-indigo-400 bg-white/50' : 'hover:scale-[1.02]'}`}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
        <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            accept=".pdf"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} 
        />
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] flex items-center justify-center mb-5 shadow-2xl shadow-indigo-200 group-hover:rotate-6 transition-transform">
           <CloudUpload className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-1">말씀 PDF 업로드</h3>
        <p className="text-gray-500 text-base font-bold">PDF 파일만 업로드 가능합니다</p>
        
        {isReading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
             <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
             <p className="text-indigo-600 font-black">말씀을 읽고 있습니다...</p>
          </div>
        )}
      </div>

      <div className="absolute bottom-12 w-full max-w-3xl px-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
        <div className="bg-white/90 backdrop-blur-xl py-6 px-10 rounded-[3rem] step-bar-shadow flex items-center justify-between border border-white/80">
           <div className="flex flex-col items-center group">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center mb-2 group-hover:bg-indigo-100 transition-colors">
                 <span className="text-indigo-600 text-sm font-black tracking-tighter">01</span>
              </div>
              <span className="text-gray-900 font-black text-base">PDF 업로드</span>
           </div>
           
           <div className="flex-1 px-8 flex justify-center">
              <Play className="w-6 h-6 text-indigo-100 fill-indigo-100" />
           </div>

           <div className="flex flex-col items-center group">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center mb-2 group-hover:bg-indigo-100 transition-colors">
                 <span className="text-indigo-600 text-sm font-black tracking-tighter">02</span>
              </div>
              <span className="text-gray-900 font-black text-base">AI 말씀 분석</span>
           </div>

           <div className="flex-1 px-8 flex justify-center">
              <Play className="w-6 h-6 text-indigo-100 fill-indigo-100" />
           </div>

           <div className="flex flex-col items-center group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-2 shadow-lg shadow-indigo-100 transition-transform hover:scale-110">
                 <span className="text-white text-sm font-black tracking-tighter">03</span>
              </div>
              <span className="text-indigo-600 font-black text-base">요약카드 생성</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SermonUpload;
