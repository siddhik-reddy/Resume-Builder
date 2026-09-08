import { useState } from 'react';
import TexEditor from '@/components/TexEditor';
import PdfPreview from '@/components/PdfPreview';
import { compileTex } from '@/lib/compiler';

const DEFAULT_TEX = `\\documentclass{article}
\\begin{document}
Hello, World!
\\end{document}`;

export default function Home() {
  const [texCode, setTexCode] = useState(DEFAULT_TEX);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState('resume');

  const handleCompile = async () => {
    setIsCompiling(true);
    setError(null);
    
    try {
      const result = await compileTex(texCode);
      
      if (result.pdf) {
        const blob = new Blob([result.pdf], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        // Clean up old URL
        if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        
        setPdfUrl(url);
      } else {
        setError('Compilation failed');
      }
    } catch (err) {
      setError('Error compiling LaTeX');
    } finally {
      setIsCompiling(false);
    }
  };

  const handleDownload = () => {
    if (!pdfUrl) return;
    
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${fileName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold">LaTeX Resume Builder</h1>
          
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
              placeholder="File name"
            />
            <button
              onClick={handleDownload}
              disabled={!pdfUrl}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              Download PDF
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 gap-4">
        <div className="bg-white rounded shadow">
          <div className="border-b px-4 py-2 flex items-center justify-between">
            <h2 className="font-semibold">Editor</h2>
            <button
              onClick={handleCompile}
              disabled={isCompiling}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isCompiling ? 'Compiling...' : 'Compile'}
            </button>
          </div>
          <TexEditor value={texCode} onChange={setTexCode} />
        </div>

        <div className="bg-white rounded shadow">
          <div className="border-b px-4 py-2">
            <h2 className="font-semibold">Preview</h2>
          </div>
          {error ? (
            <div className="p-4 text-red-600">{error}</div>
          ) : (
            <PdfPreview url={pdfUrl} />
          )}
        </div>
      </main>
    </div>
  );
}
