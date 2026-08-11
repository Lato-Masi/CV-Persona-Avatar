import React, { useState, useRef } from 'react';
import { Upload, FileText, Sparkles, AlertCircle, CheckCircle2, X, ChevronDown, ChevronUp, FileUp, Globe, Zap, Cpu, Code2, Eye, Copy, Download, Filter } from 'lucide-react';
import { AnalyzeRequest, FocusAreaLens, LENS_OPTIONS } from '../types';
import { convertDocumentWithAnydoc, AnydocConversionResult } from '../lib/anydoc';

interface CvUploadFormProps {
  onAnalyzeCv: (formData: FormData) => void;
  onAnalyzeRequest: (request: AnalyzeRequest) => void;
  isLoading: boolean;
  onOpenAnydocConverter?: () => void;
}

export const CvUploadForm: React.FC<CvUploadFormProps> = ({
  onAnalyzeCv,
  onAnalyzeRequest,
  isLoading,
  onOpenAnydocConverter,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [anydocResult, setAnydocResult] = useState<AnydocConversionResult | null>(null);
  const [isConvertingWasm, setIsConvertingWasm] = useState(false);
  const [showWasmPreview, setShowWasmPreview] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [pastedCvText, setPastedCvText] = useState('');
  const [focusArea, setFocusArea] = useState<FocusAreaLens>('general');
  const [showPastedInput, setShowPastedInput] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (file: File | null) => {
    if (!file) return;
    setErrorMsg('');
    const validTypes = ['pdf', 'txt', 'md', 'docx', 'doc', 'ppt', 'pptx', 'xls', 'xlsx', 'rtf', 'epub', 'csv'];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!validTypes.includes(ext) && !file.type.includes('pdf') && !file.type.includes('text')) {
      setErrorMsg('Please select a PDF, DOCX, PPTX, XLSX, RTF, EPUB, CSV, or TXT file.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setErrorMsg('File size exceeds 20MB limit.');
      return;
    }

    setSelectedFile(file);
    setIsConvertingWasm(true);
    setAnydocResult(null);

    try {
      // 0 LLM Tokens consumed: Client-side WASM document-to-markdown conversion via Firecrawl Anydoc
      const result = await convertDocumentWithAnydoc(file);
      setAnydocResult(result);
    } catch (err) {
      console.warn('WASM conversion notice:', err);
    } finally {
      setIsConvertingWasm(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (selectedFile) {
      const formData = new FormData();
      formData.append('cvFile', selectedFile);
      formData.append('focusArea', focusArea);
      if (anydocResult?.markdown) {
        formData.append('anydocMarkdown', anydocResult.markdown);
        formData.append('cvText', anydocResult.markdown);
      } else if (pastedCvText.trim()) {
        formData.append('cvText', pastedCvText.trim());
      }
      onAnalyzeCv(formData);
    } else if (pastedCvText.trim()) {
      onAnalyzeRequest({
        pastedText: pastedCvText.trim(),
        url: '',
        focusArea,
      });
    } else {
      setErrorMsg('Please upload a document file or paste candidate text to proceed.');
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 p-5 sm:p-7 space-y-5 shadow-2xl text-slate-100">
      {/* Title & Lens Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <FileUp className="w-4 h-4" />
            </div>
            Upload Executive CV & Web Search
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Upload candidate's PDF CV to convert it to Markdown, then perform verified web research to gather complete online background.
          </p>
        </div>

        {/* Lens Area Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 bg-white/5 p-1.5 rounded-xl border border-white/10 backdrop-blur-md">
          <div className="flex items-center space-x-1.5 px-2">
            <Filter className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-300">Lens Perspective:</span>
          </div>
          <select
            id="focus-area-select"
            value={focusArea}
            onChange={(e) => setFocusArea(e.target.value as FocusAreaLens)}
            className="text-xs font-semibold text-indigo-200 bg-slate-900/90 border border-indigo-500/30 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer max-w-xs"
          >
            {LENS_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id} className="bg-slate-900 text-slate-100 py-1">
                [{opt.category}] {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* PDF File Drag & Drop Target Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center space-y-3 ${
            isDragging
              ? 'border-indigo-400 bg-indigo-500/20 scale-[1.01]'
              : selectedFile
              ? 'border-emerald-500/50 bg-emerald-500/10'
              : 'border-indigo-500/30 bg-indigo-950/20 hover:border-indigo-400/60 hover:bg-indigo-900/20'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            id="cv-file-input"
            accept=".pdf,.txt,.md,.docx,application/pdf,text/plain"
            onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
            className="hidden"
            disabled={isLoading}
          />

          {selectedFile ? (
            <div className="flex flex-col space-y-2 w-full">
              <div className="flex items-center justify-between bg-white/10 px-4 py-3 rounded-xl border border-emerald-500/40 w-full">
                <div className="flex items-center space-x-3 text-left truncate">
                  <FileText className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div className="truncate">
                    <p className="text-sm font-semibold text-white truncate max-w-xs">{selectedFile.name}</p>
                    <p className="text-[11px] text-emerald-300 flex items-center gap-1.5 mt-0.5">
                      <span>{(selectedFile.size / 1024).toFixed(1)} KB</span>
                      <span>•</span>
                      {isConvertingWasm ? (
                        <span className="text-amber-300 animate-pulse flex items-center gap-1">
                          <Cpu className="w-3 h-3 animate-spin" /> Processing document...
                        </span>
                      ) : anydocResult ? (
                        <span className="text-emerald-300 font-medium flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-400 fill-amber-400" /> Parsed successfully ({anydocResult.conversionTimeMs}ms)
                        </span>
                      ) : (
                        <span>Document Ready</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {anydocResult?.markdown && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowWasmPreview(!showWasmPreview);
                      }}
                      className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg text-xs font-semibold border border-emerald-500/30 flex items-center gap-1 transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{showWasmPreview ? 'Hide' : 'View'} Parsed Text</span>
                    </button>
                  )}
                  <button
                    type="button"
                    id="remove-selected-file-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      setAnydocResult(null);
                      setShowWasmPreview(false);
                    }}
                    className="p-1 hover:bg-white/20 rounded-lg text-slate-400 hover:text-white transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Conversion Detail Banner */}
              {anydocResult && (
                <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 text-xs space-y-2 text-slate-200 text-left">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 font-bold text-emerald-400">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span>Document Conversion & Parsing</span>
                    </div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-mono">
                      Fast Processing • {anydocResult.conversionTimeMs} ms
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Document converted to structured text in <strong className="text-white">{anydocResult.conversionTimeMs} ms</strong> for executive profiling.
                  </p>

                  {/* Expandable Markdown Inspector */}
                  {showWasmPreview && (
                    <div className="mt-2 bg-slate-950 p-3 rounded-lg border border-white/10 text-xs font-mono text-emerald-300 max-h-48 overflow-y-auto space-y-2">
                      <div className="flex items-center justify-between pb-1 border-b border-white/10 text-[10px] text-slate-400">
                        <span>Converted Markdown Output:</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(anydocResult.markdown);
                            setCopiedMd(true);
                            setTimeout(() => setCopiedMd(false), 2000);
                          }}
                          className="text-slate-300 hover:text-white flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedMd ? 'Copied!' : 'Copy Markdown'}</span>
                        </button>
                      </div>
                      <pre className="whitespace-pre-wrap select-all font-mono text-[11px] leading-relaxed">
                        {anydocResult.markdown}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center shadow-lg">
                <Upload className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">
                  Drop Candidate Document (PDF, DOCX, PPTX, XLSX, RTF, EPUB, CSV, TXT) or <span className="text-indigo-400 underline">Browse Files</span>
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Parsed instantly and enriched with real-time Google Web Intelligence
                </p>
              </div>
            </>
          )}
        </div>

        {errorMsg && (
          <div className="flex items-center space-x-2 text-xs text-rose-300 bg-rose-950/50 p-2.5 rounded-xl border border-rose-500/30">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Submit & Optional Paste Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <button
            type="button"
            id="toggle-pasted-cv-btn"
            onClick={() => setShowPastedInput(!showPastedInput)}
            className="text-xs font-semibold text-indigo-300 hover:text-indigo-200 flex items-center space-x-1.5 transition bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-2 rounded-xl border border-indigo-500/30"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>{showPastedInput ? 'Hide' : 'Paste'} CV / Resume Text Directly</span>
            {showPastedInput ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            type="submit"
            id="analyze-cv-submit-btn"
            disabled={isLoading || (!selectedFile && !pastedCvText.trim())}
            className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-500 hover:from-indigo-600 hover:to-emerald-600 active:scale-98 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/25 border border-white/20 transition-all duration-150 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Processing CV & Web Search...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Process CV & Web Research</span>
              </>
            )}
          </button>
        </div>

        {/* Expandable Textarea for Direct CV Text */}
        {showPastedInput && (
          <div className="space-y-2 pt-2">
            <label htmlFor="direct-cv-text" className="block text-xs font-medium text-slate-300">
              Paste candidate CV, bio text, or resume markdown directly:
            </label>
            <textarea
              id="direct-cv-text"
              rows={4}
              value={pastedCvText}
              onChange={(e) => setPastedCvText(e.target.value)}
              placeholder="Paste CV text, experience bullet points, or raw resume markdown here..."
              className="w-full p-3.5 bg-slate-950/60 border border-indigo-500/30 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans leading-relaxed"
            />
          </div>
        )}
      </form>
    </div>
  );
};
