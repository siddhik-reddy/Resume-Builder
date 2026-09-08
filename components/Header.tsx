interface HeaderProps {
  fileName: string;
  setFileName: (name: string) => void;
  onDownload: () => void;
  canDownload: boolean;
  onCompile: () => void;
  isCompiling: boolean;
}

export default function Header({ 
  fileName, 
  setFileName, 
  onDownload, 
  canDownload,
  onCompile,
  isCompiling
}: HeaderProps) {
  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold text-gray-800">Resume Builder</h1>
        
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={onCompile}
            disabled={isCompiling}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCompiling ? 'Compiling...' : 'Compile'}
          </button>
          
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="File name"
          />
          
          <button
            onClick={onDownload}
            disabled={!canDownload}
            className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Download PDF
          </button>
        </div>
      </div>
    </header>
  );
}
