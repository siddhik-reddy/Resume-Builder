import { useState, useCallback, useEffect } from 'react';
import TexEditor from '../components/TexEditor';
import PdfPreview from '../components/PdfPreview';
import Header from '../components/Header';
import { compileTexToHtml } from '../lib/compiler';
import { DEFAULT_TEMPLATE } from '../lib/templates';

export default function Home() {
  const [texCode, setTexCode] = useState(DEFAULT_TEMPLATE);
  const [htmlOutput, setHtmlOutput] = useState<string | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState('resume');
  const [isAutoCompile, setIsAutoCompile] = useState(true);

  const handleCompile = useCallback(async () => {
    setIsCompiling(true);
    setError(null);

    try {
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 300));
      const html = compileTexToHtml(texCode);
      setHtmlOutput(html);
    } catch (err) {
      setError('Failed to compile LaTeX. Check your code for errors.');
    } finally {
      setIsCompiling(false);
    }
  }, [texCode]);

  // Auto-compile on code change with debounce
  useEffect(() => {
    if (!isAutoCompile) return;
    
    const timer = setTimeout(() => {
      handleCompile();
    }, 500);

    return () => clearTimeout(timer);
  }, [texCode, isAutoCompile, handleCompile]);

  const handleDownload = useCallback(() => {
    if (!htmlOutput) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${fileName}</title>
          <style>
            body { 
              font-family: 'Times New Roman', serif; 
              padding: 40px; 
              line-height: 1.6;
              color: #1a1a1a;
              max-width: 800px;
              margin: 0 auto;
            }
            h1.name { font-size: 24px; text-align: center; margin-bottom: 8px; }
            h2.section-title { 
              font-size: 18px; 
              border-bottom: 2px solid #1a1a1a; 
              margin-top: 24px; 
              margin-bottom: 12px; 
              padding-bottom: 4px;
            }
            ul, ol { margin-left: 20px; margin-bottom: 12px; }
            li { margin-bottom: 4px; }
            .center { text-align: center; }
          </style>
        </head>
        <body>${htmlOutput}</body>
      </html>
    `);
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = function() {
      printWindow.print();
    };
    
    // Fallback for browsers that don't trigger onload
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }, [htmlOutput, fileName]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
      <Header
        fileName={fileName}
        setFileName={setFileName}
        onDownload={handleDownload}
        canDownload={!!htmlOutput}
        onCompile={handleCompile}
        isCompiling={isCompiling}
        isAutoCompile={isAutoCompile}
        setIsAutoCompile={setIsAutoCompile}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="border-b bg-gray-50 px-4 py-3 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-800">LaTeX Editor</h2>
              <p className="text-xs text-gray-500">Write your resume in LaTeX</p>
            </div>
            {isCompiling && (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-xs text-gray-600">Compiling...</span>
              </div>
            )}
          </div>
          <TexEditor value={texCode} onChange={setTexCode} />
        </section>

        <section className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="border-b bg-gray-50 px-4 py-3">
            <h2 className="font-semibold text-gray-800">Live Preview</h2>
            <p className="text-xs text-gray-500">Updates automatically</p>
          </div>
          {error ? (
            <div className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Compilation Error</h3>
                    <p className="mt-1 text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <PdfPreview htmlContent={htmlOutput} />
          )}
        </section>
      </main>
    </div>
  );
}
