import type { PaperAnalysis } from '@/types';

// Extend Window interface to include Chrome AI APIs
declare global {
  interface Window {
    ai?: {
      languageModel: {
        capabilities: () => Promise<{ available: 'readily' | 'after-download' | 'no' }>;
        create: (options?: { systemPrompt?: string }) => Promise<AILanguageModel>;
      };
      summarizer?: {
        capabilities: () => Promise<{ available: 'readily' | 'after-download' | 'no' }>;
        create: (options?: any) => Promise<AISummarizer>;
      };
    };
  }

  interface AILanguageModel {
    prompt: (input: string) => Promise<string>;
    destroy: () => void;
  }

  interface AISummarizer {
    summarize: (text: string) => Promise<string>;
    destroy: () => void;
  }
}

/**
 * Check Gemini Nano availability status
 * Returns: 'unavailable' | 'downloadable' | 'downloading' | 'available' | null
 */
export async function checkGeminiNanoAvailability(): Promise<string | null> {
  try {
    if (!window.ai?.languageModel) {
      console.log('window.ai.languageModel not found - flags may not be enabled');
      return null;
    }

    const capabilities = await window.ai.languageModel.capabilities();
    console.log('Gemini Nano capabilities:', capabilities);

    return capabilities.available;
  } catch (error) {
    console.error('Error checking Gemini Nano availability:', error);
    return null;
  }
}

/**
 * Check if Gemini Nano is available (legacy function)
 */
export async function isGeminiNanoAvailable(): Promise<boolean> {
  const status = await checkGeminiNanoAvailability();
  return status === 'readily' || status === 'available';
}

/**
 * Trigger Gemini Nano model download if needed
 * This will prompt the user to download if the model is 'downloadable'
 */
export async function triggerModelDownload(): Promise<void> {
  try {
    const status = await checkGeminiNanoAvailability();

    if (status === 'downloadable') {
      console.log('Model is downloadable. Triggering download by creating a session...');
      // Creating a session will trigger the download prompt
      const session = await window.ai!.languageModel.create();
      console.log('Download triggered! Session created:', session);
      session.destroy();
    } else if (status === 'downloading') {
      console.log('Model is already downloading. Please wait...');
    } else if (status === 'available' || status === 'readily') {
      console.log('Model is already available!');
    } else {
      console.log('Model status:', status);
    }
  } catch (error) {
    console.error('Error triggering model download:', error);
    throw error;
  }
}

/**
 * Analyze paper structure using Gemini Nano
 * Extracts title, authors, abstract, sections, and key findings
 */
export async function analyzePaperStructure(pdfText: string): Promise<PaperAnalysis> {
  try {
    const available = await isGeminiNanoAvailable();
    if (!available) {
      throw new Error('Gemini Nano is not available. Please enable Chrome AI flags.');
    }

    console.log('Starting paper analysis with Gemini Nano...');

    const session = await window.ai!.languageModel.create({
      systemPrompt: `You are an expert research paper analyzer. Extract structured information from academic papers.
Your task is to analyze the paper and return ONLY valid JSON in this exact format:
{
  "title": "paper title",
  "authors": ["author1", "author2"],
  "abstract": "full abstract text",
  "sections": [
    {"heading": "Introduction", "content": "brief content summary"},
    {"heading": "Methods", "content": "brief content summary"}
  ],
  "keyFindings": ["finding 1", "finding 2", "finding 3"],
  "methodology": "brief methodology description",
  "conclusions": "main conclusions"
}

Be concise but accurate. Return ONLY the JSON, no other text.`,
    });

    // Limit text size for Gemini Nano (context window limitations)
    const maxChars = 15000; // Adjust based on Gemini Nano limits
    const truncatedText = pdfText.length > maxChars
      ? pdfText.substring(0, maxChars) + '\n\n[Text truncated due to length...]'
      : pdfText;

    const prompt = `Analyze this research paper and extract structured information:\n\n${truncatedText}`;

    console.log('Sending to Gemini Nano...');
    const response = await session.prompt(prompt);

    console.log('Gemini Nano response received:', response);

    // Clean up session
    session.destroy();

    // Parse JSON response
    try {
      // Remove markdown code blocks if present
      let jsonText = response.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\n?/g, '');
      }

      const analysis: PaperAnalysis = JSON.parse(jsonText);

      console.log('Successfully parsed paper analysis:', analysis);
      return analysis;
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', response);
      throw new Error('Failed to parse AI response. The model may need better prompting.');
    }

  } catch (error) {
    console.error('Error analyzing paper:', error);
    throw error;
  }
}

/**
 * Generate a summary of a text section using Gemini Nano
 */
export async function summarizeText(text: string, maxLength: 'short' | 'medium' | 'long' = 'medium'): Promise<string> {
  try {
    const available = await isGeminiNanoAvailable();
    if (!available) {
      throw new Error('Gemini Nano is not available');
    }

    const session = await window.ai!.languageModel.create({
      systemPrompt: 'You are a helpful assistant that creates clear, concise summaries of academic text.',
    });

    const lengthInstruction = {
      short: '2-3 sentences',
      medium: '1 paragraph (4-6 sentences)',
      long: '2-3 paragraphs',
    }[maxLength];

    const prompt = `Summarize the following text in ${lengthInstruction}:\n\n${text}`;
    const summary = await session.prompt(prompt);

    session.destroy();
    return summary;
  } catch (error) {
    console.error('Error summarizing text:', error);
    throw error;
  }
}

/**
 * Answer a question about the paper using Gemini Nano
 */
export async function answerQuestion(question: string, context: string): Promise<string> {
  try {
    const available = await isGeminiNanoAvailable();
    if (!available) {
      throw new Error('Gemini Nano is not available');
    }

    const session = await window.ai!.languageModel.create({
      systemPrompt: 'You are an expert research paper assistant. Answer questions clearly and concisely based on the provided context.',
    });

    const prompt = `Context:\n${context}\n\nQuestion: ${question}\n\nAnswer:`;
    const answer = await session.prompt(prompt);

    session.destroy();
    return answer;
  } catch (error) {
    console.error('Error answering question:', error);
    throw error;
  }
}
