interface HeaderProps {
  fileName: string;
  setFileName: (name: string) => void;
  onDownload: () => void;
  canDownload: boolean;
  onCompile: () => void;
  isCompiling: boolean;
  isAutoCompile: boolean;
  setIsAutoCompile: (value: boolean) => void;
}

export default function Header({ 
  fileName, 
  setFileName, 
  onDownload, 
  canDownload,
  onCompile,
  isCompiling,
  isAutoCompile,
  setIsAutoCompile
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Resume Builder</h1>
              <p className="text-xs text-gray-500">LaTeX to PDF in your browser</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            {/* Auto-compile toggle */}
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={isAutoCompile}
                onChange={(e) => setIsAutoCompile(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Auto-compile
            </label>

            {/* Compile button */}
            <button
              onClick={onCompile}
              disabled={isCompiling}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCompiling ? 'Compiling...' : 'Compile Now'}
            </button>
            
            {/* File name input */}
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="File name"
            />
            
            {/* Download button */}
            <button
              onClick={onDownload}
              disabled={!canDownload}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
