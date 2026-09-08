import { useState, useCallback, useEffect } from 'react';
import TexEditor from '../components/TexEditor';
import PdfPreview from '../components/PdfPreview';
import Header from '../components/Header';
import { compileTexToHtml } from '../lib/compiler';

export default function Home() {
  const [texCode, setTexCode] = useState('');
  const [htmlOutput, setHtmlOutput] = useState<string | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState('resume');
  const [isAutoCompile, setIsAutoCompile] = useState(true);

  const handleCompile = useCallback(async () => {
    if (!texCode.trim()) return;
    
    setIsCompiling(true);
    setError(null);

    try {
      const html = await compileTexToHtml(texCode);
      setHtmlOutput(html);
    } catch (err) {
      setError('Failed to parse LaTeX. Please check your code.');
      console.error(err);
    } finally {
      setIsCompiling(false);
    }
  }, [texCode]);

  // Auto-compile with debounce
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
              color: #333;
              max-width: 800px;
              margin: 0 auto;
            }
            .resume-name { font-size: 30px; font-weight: bold; color: #123B63; text-align: center; }
            .resume-title { font-size: 16px; color: #123B63; text-align: center; margin: 8px 0; }
            .contact-info { font-size: 12px; text-align: center; margin-bottom: 20px; }
            .section-title { font-size: 16px; font-weight: bold; color: #123B63; border-bottom: 2px solid #123B63; margin-top: 20px; padding-bottom: 4px; }
            .section-content { font-size: 13px; line-height: 1.6; }
            ul { margin-left: 20px; }
            .highlight { background-color: #EAF2F8; padding: 10px; text-align: center; }
          </style>
        </head>
        <body>${htmlOutput}</body>
      </html>
    `);
    printWindow.document.close();
    
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
              <p className="text-xs text-gray-500">Paste your LaTeX resume</p>
            </div>
            {isCompiling && (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-xs text-gray-600">Processing...</span>
              </div>
            )}
          </div>
          <TexEditor value={texCode} onChange={setTexCode} />
        </section>

        <section className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="border-b bg-gray-50 px-4 py-3">
            <h2 className="font-semibold text-gray-800">Live Preview</h2>
            <p className="text-xs text-gray-500">
              {isAutoCompile ? 'Updates automatically' : 'Click compile to update'}
            </p>
          </div>
          {error ? (
            <div className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700">{error}</p>
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
