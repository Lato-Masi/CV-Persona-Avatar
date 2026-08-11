import init, { toMarkdownBytes, formatFromBytes, formatFromExtension, Format } from '@firecrawl/anydoc-wasm';

let isInitialized = false;
let initPromise: Promise<void> | null = null;

export async function ensureAnydocInitialized() {
  if (isInitialized) return;
  if (!initPromise) {
    initPromise = (async () => {
      try {
        await init();
        isInitialized = true;
      } catch (err) {
        console.warn('WASM init default failed:', err);
        isInitialized = true;
      }
    })();
  }
  await initPromise;
}

export interface AnydocConversionResult {
  markdown: string;
  detectedFormat?: string;
  conversionTimeMs: number;
  tokenCountSavedEstimate: number;
}

/**
 * Converts a document file (PDF, DOCX, PPTX, XLSX, ODT, RTF, EPUB, CSV, TXT, MD)
 * into GitHub-Flavored Markdown locally in the browser using Firecrawl Anydoc WebAssembly.
 * Consumes 0 LLM tokens!
 */
export async function convertDocumentWithAnydoc(file: File): Promise<AnydocConversionResult> {
  const startTime = performance.now();
  
  const ext = file.name.split('.').pop()?.toLowerCase() || '';

  // Handle plain text or markdown directly
  if (ext === 'txt' || ext === 'md' || (file.type && file.type.startsWith('text/plain'))) {
    const text = await file.text();
    const duration = performance.now() - startTime;
    return {
      markdown: text,
      detectedFormat: ext || 'txt',
      conversionTimeMs: Math.round(duration),
      tokenCountSavedEstimate: Math.round(text.length / 4),
    };
  }

  // Convert binary documents using @firecrawl/anydoc-wasm
  await ensureAnydocInitialized();

  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  // Format detection via byte markers or extension
  let fmt: Format | undefined = formatFromBytes(bytes);
  if (!fmt && ext) {
    fmt = formatFromExtension(ext);
  }

  try {
    const markdown = toMarkdownBytes(bytes, fmt || null);
    const duration = performance.now() - startTime;
    const finalMd = markdown && markdown.trim() ? markdown : `# Document: ${file.name}\n\n(Empty or image-based document content)`;
    
    return {
      markdown: finalMd,
      detectedFormat: fmt || ext || 'doc',
      conversionTimeMs: Math.round(duration),
      tokenCountSavedEstimate: Math.round(finalMd.length / 4),
    };
  } catch (err) {
    console.warn('Anydoc WASM conversion warning:', err);
    
    // Graceful fallback text recovery
    const textDecoder = new TextDecoder('utf-8', { fatal: false });
    const rawText = textDecoder.decode(bytes);
    const cleanedText = rawText.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
    const duration = performance.now() - startTime;

    return {
      markdown: cleanedText ? `# Document: ${file.name}\n\n${cleanedText}` : `# Document: ${file.name}\n\n(Could not parse file content)`,
      detectedFormat: ext || 'unknown',
      conversionTimeMs: Math.round(duration),
      tokenCountSavedEstimate: Math.round((cleanedText || '').length / 4),
    };
  }
}
