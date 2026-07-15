export interface SearchFilters {
  apc: string;
  language: string;
  quartiles: string[];
  indexing: string[];
  accessType: string;
  scopes: string[];
}

export interface AISettings {
  provider: string;
  apiKey?: string;
  model?: string;
}

export interface SearchPayload {
  title: string;
  abstract: string;
  keywords: string;
  filters: SearchFilters;
  aiSettings?: AISettings;
}

export interface AnalysisResponse {
  analysis: {
    mainDiscipline: string;
    subDiscipline: string;
    studyType: string;
    methodology: string;
    suggestedKeywords: string[];
  };
  journals: JournalMatch[];
}

export interface JournalMatch {
  name: string;
  publisher: string;
  url?: string;
  matchScore: number;
  metrics: {
    impactFactor: string;
    quartile: string;
    apc: string;
    reviewSpeed: string;
    acceptanceRate: string;
    indexing: string[];
  };
  breakdown: {
    topic: number;
    quality: number;
    acceptance: number;
    speed: number;
    apc: number;
    publisher: number;
    spread: number;
  };
  justification: string;
  advice: string;
  warnings?: string[];
}
