interface HeaderProps {
  fileName: string;
  setFileName: (name: string) => void;
  onExport: () => void;
  isExporting: boolean;
}

export default function Header({ fileName, setFileName, onExport, isExporting }: HeaderProps) {
  return (
    <header>
      <div className="wordmark">
        Resume <span>Builder</span>
      </div>
      <div className="header-controls">
        <div className="filename-field">
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            spellCheck={false}
          />
          <span className="ext">.pdf</span>
        </div>
        <button
          className="export"
          onClick={onExport}
          disabled={isExporting}
        >
          {isExporting ? 'Rendering...' : 'Export PDF'}
        </button>
      </div>
    </header>
  );
}
