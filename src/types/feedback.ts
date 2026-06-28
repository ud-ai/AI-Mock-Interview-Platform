export interface DetailedFeedbackEntry {
  question: string;
  answer: string;
  feedback: string;
  score: number;
}

export interface FeedbackReport {
  overallScore: number;
  communicationScore: number;
  technicalScore: number | null;
  structureScore: number;
  confidenceScore: number;
  strengths: string[];
  improvements: string[];
  detailedFeedback: DetailedFeedbackEntry[];
  hiringRecommendation: 'strong yes' | 'yes' | 'maybe' | 'no';
  recommendationReason: string;
}
