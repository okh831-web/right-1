
import { GoogleGenAI, Type } from "@google/genai";
import { SermonAnalysis } from "./types";

export const analyzeSermon = async (text: string): Promise<SermonAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `다음은 주일 설교 원문입니다. 이를 바탕으로 '전도용 요약 카드'와 '인포그래픽'을 위한 내용을 생성하세요.

      [내용 분석 및 요약 지침 - 최우선 준수]
      1. 원문 존중: 입력된 설교의 핵심 주제, 신학적 방향성, 강조점을 임의로 변경하거나 왜곡하지 마세요.
      2. 대지 추출: 원문에서 설교자가 직접 제시한 3가지 핵심 포인트(대지)가 있다면 이를 그대로 사용하고, 없다면 본문의 흐름을 가장 잘 나타내는 문장을 그대로 인용하여 3가지 포인트로 요약하세요.
      3. 제목 유지: 설교 제목이 본문에 명시되어 있다면 반드시 그 제목을 사용하세요.
      4. 자의적 해석 금지: 본문에 없는 내용을 덧붙이거나, 설교자의 의도와 다른 방향으로 결론을 내리지 마세요.

      [이미지 생성 프롬프트 지침]
      - imagePrompts 배열에는 서로 완전히 다른 3개의 시각적 테마를 담으세요.
      - 1번(서론/배경): 광활한 자연이나 야외 공간.
      - 2번(핵심/교훈): 구체적인 상징물이나 사물.
      - 3번(결론/적용): 따뜻한 빛이 비치는 실내나 인물의 실루엣.
      - 모든 프롬프트는 "High quality Christian art, warm sun rays, ethereal, peaceful" 스타일을 유지하되, 소재는 겹치지 않게 영어로 작성하세요.

      원문:
      ${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            scripture: { type: Type.STRING },
            coreTheme: { type: Type.STRING },
            summaryPoints: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["title", "description"]
              }
            },
            imagePrompts: { type: Type.ARRAY, items: { type: Type.STRING } },
            evangelismMessage: { type: Type.STRING },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "scripture", "coreTheme", "summaryPoints", "imagePrompts", "evangelismMessage", "keywords"]
        },
        systemInstruction: "당신은 성경 말씀과 설교 원문을 한 글자 한 글자 소중히 다루는 신중한 요약가이자 예술 감독입니다. 원문의 주제를 절대 임의로 변경하지 말고 본래의 의미를 충실히 전달하며, 시각적으로는 풍경, 사물, 빛의 테마를 교차시켜 다채로운 인포그래픽을 완성하세요."
      }
    });

    return JSON.parse(response.text.trim()) as SermonAnalysis;
  } catch (error) {
    console.error("Analysis error:", error);
    throw new Error("AI 분석 중 오류가 발생했습니다. 본문 내용이 충분한지 확인 후 다시 시도해주세요.");
  }
};

export const generateSermonImage = async (prompt: string, index: number): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const variations = [
    "Wide angle cinematic wide shot, grand scale, outdoor environment",
    "Extreme close-up macro photography focusing on texture and detail of an object",
    "Soft focus, dreamy portrait style with heavy bokeh and golden hour lighting"
  ];
  
  const selectedVariation = variations[index % 3];
  const randomTag = `VariationID-${Date.now() % 1000}-${index}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `[Art Style: Ethereal Christian Digital Art]. [Scene: ${prompt}]. [Composition: ${selectedVariation}]. [Lighting: Warm sunbeams, radiant]. [Note: No text, no letters, highly distinct from other images, ${randomTag}]`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (part?.inlineData?.data) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("이미지 데이터를 찾을 수 없습니다.");
  } catch (error) {
    console.error("Image generation error:", error);
    const fallbacks = [
      'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?q=80&w=1000',
      'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1000',
      'https://images.unsplash.com/photo-1444491741275-3747c53c99b4?q=80&w=1000'
    ];
    return fallbacks[index % 3];
  }
};
