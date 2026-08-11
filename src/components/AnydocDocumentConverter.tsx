import React, { useState, useRef } from 'react';
import {
  FileText,
  Upload,
  Zap,
  Cpu,
  Copy,
  Download,
  Check,
  Eye,
  Code2,
  ShieldCheck,
  RefreshCw,
  X,
  FileSpreadsheet,
  FileCheck,
  ArrowRight,
  FileUp,
  Sparkles,
} from 'lucide-react';
import { convertDocumentWithAnydoc, AnydocConversionResult } from '../lib/anydoc';

interface ConvertedFileItem {
  id: string;
  fileName: string;
  fileSize: number;
  result: AnydocConversionResult;
}

interface AnydocDocumentConverterProps {
  onSendToProfiler?: (markdown: string, fileName: string) => void;
  onClose?: () => void;
  isModal?: boolean;
}

export const AnydocDocumentConverter: React.FC<AnydocDocumentConverterProps> = ({
  onSendToProfiler,
  onClose,
  isModal = false,
}) => {
  const [convertedItems, setConvertedItems] = useState<ConvertedFileItem[]>([]);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState<'raw' | 'rendered'>('rendered');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const activeItem = convertedItems.find((item) => item.id === activeItemId) || convertedItems[0] || null;

  const processFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    setError(null);

    const newItems: ConvertedFileItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const result = await convertDocumentWithAnydoc(file);
        const item: ConvertedFileItem = {
          id: `doc-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}`,
          fileName: file.name,
          fileSize: file.size,
          result,
        };
        newItems.push(item);
      } catch (err) {
        console.error('Error converting file with Anydoc WASM:', err);
        setError(`Failed to convert ${file.name}. Ensure it is a valid PDF, Word, PowerPoint, Excel, RTF, or EPUB file.`);
      }
    }

    if (newItems.length > 0) {
      setConvertedItems((prev) => [...newItems, ...prev]);
      setActiveItemId(newItems[0].id);
    }
    setIsProcessing(false);
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleCopy = () => {
    if (!activeItem) return;
    navigator.clipboard.writeText(activeItem.result.markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!activeItem) return;
    const blob = new Blob([activeItem.result.markdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeItem.fileName.replace(/\.[^/.]+$/, '')}-converted.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRemoveItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConvertedItems((prev) => {
      const filtered = prev.filter((item) => item.id !== id);
      if (activeItemId === id) {
        setActiveItemId(filtered[0]?.id || null);
      }
      return filtered;
    });
  };

  return (
    <div
      className={`bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl text-slate-100 flex flex-col ${
        isModal ? 'max-w-4xl w-full max-h-[90vh] overflow-hidden' : 'p-6 space-y-6'
      }`}
    >
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20">
            <Zap className="w-5 h-5 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-lg text-white tracking-tight">
                Document Converter & Text Inspector
              </h3>
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="w-3 h-3 text-emerald-400 mr-1" />
                Instant Local Processing
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Instant client-side conversion for PDF, DOCX, PPTX, XLSX, ODT, RTF, EPUB, CSV, & TXT documents.
            </p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className={`p-5 sm:p-6 space-y-6 ${isModal ? 'overflow-y-auto flex-1' : ''}`}>
        {/* Format Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 flex items-center space-x-2">
            <FileText className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="text-slate-300 font-medium">PDF Documents</span>
          </div>
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 flex items-center space-x-2">
            <FileCheck className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="text-slate-300 font-medium">Word (.doc, .docx)</span>
          </div>
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 flex items-center space-x-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-300 font-medium">Excel (.xls, .xlsx)</span>
          </div>
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-slate-300 font-medium">PPT, RTF, EPUB, CSV</span>
          </div>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center space-y-3 ${
            isDragging
              ? 'border-emerald-400 bg-emerald-500/20 scale-[1.01]'
              : 'border-amber-500/30 bg-amber-950/10 hover:border-amber-400/60 hover:bg-amber-950/20'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.odt,.ods,.odp,.rtf,.epub,.csv,.txt,.md"
            onChange={(e) => e.target.files && processFiles(e.target.files)}
            className="hidden"
            disabled={isProcessing}
          />

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-emerald-500/20 border border-amber-500/30 text-amber-300 flex items-center justify-center shadow-lg">
            {isProcessing ? (
              <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
            ) : (
              <Upload className="w-6 h-6 text-amber-400" />
            )}
          </div>

          <div>
            <p className="text-sm font-bold text-white">
              {isProcessing ? 'Processing Document...' : 'Drop Documents to Convert to Structured Text'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports PDF, DOCX, PPTX, XLSX, ODT, RTF, EPUB, CSV, TXT. Converts documents directly into clean markdown format.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl text-xs text-rose-300">
            {error}
          </div>
        )}

        {/* Converted Files Tab List */}
        {convertedItems.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin">
              {convertedItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveItemId(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition ${
                    item.id === activeItemId
                      ? 'bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border-emerald-400/50 text-white shadow-lg'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span className="truncate max-w-[140px]">{item.fileName}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-emerald-300 font-mono">
                    {item.result.conversionTimeMs}ms
                  </span>
                  <span
                    onClick={(e) => handleRemoveItem(item.id, e)}
                    className="p-0.5 hover:bg-white/20 rounded text-slate-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </span>
                </button>
              ))}
            </div>

            {/* Active File Inspector & Actions */}
            {activeItem && (
              <div className="bg-slate-950/80 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                {/* Toolbar */}
                <div className="p-3.5 bg-white/5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-emerald-400" />
                      {activeItem.fileName}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      ({(activeItem.fileSize / 1024).toFixed(1)} KB)
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      ⚡ Processed in {activeItem.result.conversionTimeMs} ms
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Structured Output
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* View Mode Toggle */}
                    <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-white/10 text-xs">
                      <button
                        onClick={() => setViewMode('rendered')}
                        className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                          viewMode === 'rendered' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Eye className="w-3 h-3" />
                        <span>Preview</span>
                      </button>
                      <button
                        onClick={() => setViewMode('raw')}
                        className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                          viewMode === 'raw' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Code2 className="w-3 h-3" />
                        <span>Raw Markdown</span>
                      </button>
                    </div>

                    <button
                      onClick={handleCopy}
                      className="p-1.5 bg-white/10 hover:bg-white/20 text-slate-200 rounded-lg text-xs font-medium flex items-center space-x-1 transition"
                      title="Copy Markdown"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={handleDownload}
                      className="p-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-medium flex items-center space-x-1 transition"
                      title="Download Markdown File"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Download .md</span>
                    </button>

                    {onSendToProfiler && (
                      <button
                        onClick={() => onSendToProfiler(activeItem.result.markdown, activeItem.fileName)}
                        className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-emerald-500 hover:from-indigo-600 hover:to-emerald-600 text-white text-xs font-semibold rounded-lg shadow-md flex items-center space-x-1 transition"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Analyze Candidate</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Markdown View Area */}
                <div className="p-4 max-h-[350px] overflow-y-auto font-mono text-xs leading-relaxed text-slate-300 bg-slate-950">
                  {viewMode === 'raw' ? (
                    <pre className="whitespace-pre-wrap font-mono text-emerald-300 select-all">
                      {activeItem.result.markdown}
                    </pre>
                  ) : (
                    <div className="prose prose-invert prose-xs max-w-none space-y-2 font-sans">
                      {activeItem.result.markdown.split('\n').map((line, idx) => {
                        if (line.startsWith('# ')) {
                          return <h1 key={idx} className="text-lg font-bold text-white border-b border-white/10 pb-1 mt-3">{line.replace('# ', '')}</h1>;
                        }
                        if (line.startsWith('## ')) {
                          return <h2 key={idx} className="text-sm font-bold text-indigo-300 mt-2">{line.replace('## ', '')}</h2>;
                        }
                        if (line.startsWith('### ')) {
                          return <h3 key={idx} className="text-xs font-semibold text-emerald-300 mt-1">{line.replace('### ', '')}</h3>;
                        }
                        if (line.startsWith('- ') || line.startsWith('* ')) {
                          return <li key={idx} className="ml-4 text-slate-300">{line.replace(/^[-*]\s+/, '')}</li>;
                        }
                        if (!line.trim()) {
                          return <div key={idx} className="h-1"></div>;
                        }
                        return <p key={idx} className="text-slate-300 leading-normal">{line}</p>;
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
