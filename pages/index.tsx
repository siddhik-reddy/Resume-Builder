import { useState, useCallback } from 'react';
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

  const handleCompile = useCallback(async () => {
    setIsCompiling(true);
    setError(null);

    try {
      const html = compileTexToHtml(texCode);
      setHtmlOutput(html);
    } catch (err) {
      setError('Failed to compile LaTeX. Check your code for errors.');
    } finally {
      setIsCompiling(false);
    }
  }, [texCode]);

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
              font-family: 'Computer Modern', 'Times New Roman', serif; 
              padding: 40px; 
              line-height: 1.5;
            }
          </style>
        </head>
        <body>${htmlOutput}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }, [htmlOutput, fileName]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header
        fileName={fileName}
        setFileName={setFileName}
        onDownload={handleDownload}
        canDownload={!!htmlOutput}
        onCompile={handleCompile}
        isCompiling={isCompiling}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="bg-white rounded-lg shadow overflow-hidden">
          <div className="border-b px-4 py-3">
            <h2 className="font-semibold text-gray-700">LaTeX Editor</h2>
          </div>
          <TexEditor value={texCode} onChange={setTexCode} />
        </section>

        <section className="bg-white rounded-lg shadow overflow-hidden">
          <div className="border-b px-4 py-3">
            <h2 className="font-semibold text-gray-700">Preview</h2>
          </div>
          {error ? (
            <div className="p-4 text-red-600 text-sm">{error}</div>
          ) : (
            <PdfPreview htmlContent={htmlOutput} />
          )}
        </section>
      </main>
    </div>
  );
}
