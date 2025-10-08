// PDF Data Structure
export interface PDFData {
  text: string;           // Full extracted text
  pageCount: number;      // Number of pages
  title?: string;         // PDF metadata title
  author?: string;        // PDF metadata author
  pages: PageData[];      // Individual page data
}

export interface PageData {
  pageNumber: number;
  text: string;
}

// Structured Paper Analysis (from LLM)
export interface PaperAnalysis {
  title: string;
  authors: string[];
  abstract: string;
  sections: PaperSection[];
  keyFindings: string[];
  methodology?: string;
  conclusions?: string;
  references?: string[];
}

export interface PaperSection {
  heading: string;
  content: string;
  summary?: string;
}

// AI Response Types
export interface SummaryData {
  summary: string;
  keyPoints: string[];
}

export interface QAResponse {
  question: string;
  answer: string;
  context?: string;
}
