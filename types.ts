
export interface SummaryPoint {
  title: string;
  description: string;
}

export interface SermonAnalysis {
  title: string;
  scripture: string;
  coreTheme: string;
  summaryPoints: SummaryPoint[];
  imagePrompts: string[];
  evangelismMessage: string;
  keywords: string[];
  generatedImages?: string[];
}

export enum AppStep {
  IDLE = 'idle',
  UPLOADING = 'uploading',
  ANALYZING = 'analyzing',
  GENERATING_IMAGES = 'generating_images',
  RESULT = 'result'
}

export enum ViewType {
  SUMMARY_CARD = 'summary_card',
  INFOGRAPHIC = 'infographic'
}
