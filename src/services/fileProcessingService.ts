import mammoth from 'mammoth';
import { ParsedMaterial } from '../types';

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Fallback parser for extracting printable text from PDF ArrayBuffer
 * when Web Worker is unavailable.
 */
function extractTextFromPdfBuffer(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let text = '';
  const textDecoder = new TextDecoder('utf-8', { fatal: false });
  const rawString = textDecoder.decode(bytes);

  // Match text objects BT ... ET or stream content in PDF
  const textBlocks: string[] = [];
  const btRegex = /BT[\s\S]*?ET/g;
  let match: RegExpExecArray | null;

  while ((match = btRegex.exec(rawString)) !== null) {
    const block = match[0];
    // Extract strings inside parentheses (Text)
    const parenStrings = block.match(/\((.*?)\)/g);
    if (parenStrings) {
      const line = parenStrings
        .map((s) => s.slice(1, -1).replace(/\\([()\\])/g, '$1'))
        .filter((s) => s.length > 1 && !/^[\x00-\x1F]+$/.test(s))
        .join(' ');
      if (line.trim()) textBlocks.push(line.trim());
    }
  }

  if (textBlocks.length > 5) {
    text = textBlocks.join('\n');
  } else {
    // General printable ASCII heuristic
    const clean = rawString.replace(/[^\x20-\x7E\n\r\t]/g, ' ');
    const lines = clean
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 20 && !l.startsWith('%') && !l.includes('endobj'));
    text = lines.slice(0, 100).join('\n');
  }

  return text.trim();
}

/**
 * Extract raw text from various file formats
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';

  // 1. Plain text / Markdown / CSV / JSON
  if (['txt', 'text', 'md', 'markdown', 'csv', 'json', 'log'].includes(ext)) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          resolve(result.trim());
        } else {
          reject(new Error('Failed to read text file.'));
        }
      };
      reader.onerror = () => reject(new Error('Could not open file for reading.'));
      reader.readAsText(file);
    });
  }

  // 2. DOCX documents (via mammoth)
  if (ext === 'docx') {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = result.value.trim();
      if (text.length > 0) return text;
      throw new Error('DOCX document contains no readable text.');
    } catch (err: any) {
      throw new Error(err.message || 'Failed to parse DOCX file.');
    }
  }

  // 3. PDF documents (using pdfjs-dist with stream fallback)
  if (ext === 'pdf') {
    try {
      const pdfjsLib = await import('pdfjs-dist');
      if (pdfjsLib.GlobalWorkerOptions && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
      }
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdf = await loadingTask.promise;

      let extractedPages: string[] = [];
      const totalPages = Math.min(pdf.numPages, 25); // Read up to 25 pages safely

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => (item as any).str || '')
          .join(' ')
          .trim();
        if (pageText) {
          extractedPages.push(`[Section / Page ${pageNum}]\n${pageText}`);
        }
      }

      const fullText = extractedPages.join('\n\n').trim();
      if (fullText.length > 30) {
        return fullText;
      }
    } catch (pdfErr) {
      console.warn('PDF.js worker or canvas issue, falling back to buffer scanner:', pdfErr);
    }

    // Fallback scanner
    try {
      const arrayBuffer = await file.arrayBuffer();
      const fallbackText = extractTextFromPdfBuffer(arrayBuffer);
      if (fallbackText.length > 30) {
        return fallbackText;
      }
    } catch (fbErr) {
      console.error('PDF buffer fallback error:', fbErr);
    }

    throw new Error('Could not extract readable text from this PDF. Please ensure it is not an image-only scan.');
  }

  // 4. Default generic text reader fallback
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        resolve(result.trim());
      } else {
        reject(new Error(`Unsupported file format: .${ext}`));
      }
    };
    reader.onerror = () => reject(new Error('Could not read file.'));
    reader.readAsText(file);
  });
}

/**
 * Intelligently analyzes extracted document text to dynamically extract
 * topics, sub-concepts, and a readable executive summary.
 */
export function extractTopicsFromText(
  text: string,
  fileName: string
): {
  summaryPreview: string;
  wordCount: number;
  topics: { title: string; concepts: string }[];
} {
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Split into paragraphs / lines
  const rawLines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  // Look for potential headers/topics
  const potentialTopics: { title: string; concepts: string }[] = [];

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    const isHeading =
      line.startsWith('#') ||
      line.startsWith('Chapter') ||
      line.startsWith('Section') ||
      line.startsWith('Unit') ||
      /^\d+[\.\)]\s+[A-Z]/.test(line) ||
      (line.length < 65 && line.endsWith(':')) ||
      (line.length < 50 && line === line.toUpperCase() && !line.includes('.'));

    if (isHeading) {
      const cleanTitle = line.replace(/^[#\d\.\)\s]+/, '').replace(/:$/, '').trim();
      // Grab next 1-3 lines as sub-concepts
      const conceptLines = rawLines
        .slice(i + 1, i + 4)
        .filter((l) => !l.startsWith('#') && l.length > 10)
        .join(' ');

      if (cleanTitle.length > 3 && cleanTitle.length < 80) {
        potentialTopics.push({
          title: cleanTitle,
          concepts: conceptLines.slice(0, 140) || 'Key principles, definitions, and foundational explanations.'
        });
      }
    }
  }

  // If no explicit headings found, segment by paragraph blocks
  if (potentialTopics.length < 2) {
    const paragraphs = text
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 40);

    paragraphs.slice(0, 5).forEach((p, idx) => {
      const firstSentence = p.split(/[.?!]/)[0] || `Section ${idx + 1}`;
      const title = firstSentence.length > 55 ? firstSentence.slice(0, 52) + '...' : firstSentence;
      potentialTopics.push({
        title: title || `Topic Area ${idx + 1}`,
        concepts: p.slice(0, 140) + '...'
      });
    });
  }

  // Ensure fallback topics exist if document is brief
  if (potentialTopics.length === 0) {
    potentialTopics.push({
      title: `${fileName.replace(/\.[^/.]+$/, '')} Overview`,
      concepts: text.slice(0, 160) || 'General conceptual discussion and core study topics.'
    });
  }

  // Limit to top 5 distinct topics
  const finalTopics = potentialTopics.slice(0, 5);

  // Create preview summary
  const cleanFirstLines = rawLines.slice(0, 4).join(' ');
  const summaryPreview =
    cleanFirstLines.length > 220
      ? cleanFirstLines.slice(0, 217) + '...'
      : cleanFirstLines || `Material extracted from ${fileName}. Ready for AI-assisted tutoring and adaptive study.`;

  return {
    summaryPreview,
    wordCount,
    topics: finalTopics
  };
}

/**
 * End-to-end pipeline: takes a File, reads its text, extracts topics and metadata
 */
export async function processUploadedFile(file: File): Promise<ParsedMaterial> {
  const text = await extractTextFromFile(file);
  const analysis = extractTopicsFromText(text, file.name);

  return {
    id: `mat-${Date.now()}`,
    fileName: file.name,
    fileType: file.name.split('.').pop()?.toUpperCase() || 'DOCUMENT',
    fileSize: file.size,
    fileSizeFormatted: formatBytes(file.size),
    extractedText: text,
    summaryPreview: analysis.summaryPreview,
    wordCount: analysis.wordCount,
    topics: analysis.topics,
    uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}
