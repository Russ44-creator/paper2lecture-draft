import * as pdfjsLib from 'pdfjs-dist';
import type { PDFData, PageData } from '@/types';

// Configure PDF.js worker - use local worker from node_modules
// This avoids CDN issues and works offline
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

/**
 * Extract text content from a PDF file
 * @param file - The PDF file to extract text from
 * @returns Promise with extracted PDF data
 */
export async function extractTextFromPDF(file: File): Promise<PDFData> {
  try {
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Load PDF document
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    console.log('PDF loaded successfully');
    console.log('Total pages:', pdf.numPages);

    // Extract metadata
    const metadata = await pdf.getMetadata();
    const info = metadata.info as any;
    const title = info?.Title || file.name;
    const author = info?.Author || undefined;

    console.log('PDF Metadata:', { title, author });

    // Extract text from all pages
    const pages: PageData[] = [];
    let fullText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Combine all text items from the page
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');

      pages.push({
        pageNumber: pageNum,
        text: pageText,
      });

      fullText += pageText + '\n\n';

      console.log(`Extracted page ${pageNum}/${pdf.numPages}`);
    }

    const pdfData: PDFData = {
      text: fullText.trim(),
      pageCount: pdf.numPages,
      title,
      author,
      pages,
    };

    console.log('PDF extraction complete!');
    console.log('Total characters extracted:', fullText.length);

    return pdfData;
  } catch (error) {
    console.error('Error extracting PDF:', error);
    throw new Error(`Failed to extract PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validate if a file is a PDF
 * @param file - File to validate
 * @returns true if file is a PDF
 */
export function isPDF(file: File): boolean {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
}

/**
 * Get a preview of the extracted text (first N characters)
 * @param text - Full text content
 * @param length - Number of characters to include in preview
 * @returns Preview text
 */
export function getTextPreview(text: string, length: number = 500): string {
  if (text.length <= length) {
    return text;
  }
  return text.substring(0, length) + '...';
}
