import { useState, useCallback, useEffect, useRef } from 'react';
import Header from './Header';
import Editor from './Editor';
import Preview from './Preview';
import LogStrip from './LogStrip';
import { compileTexToHtml, sanitizeFilename } from '../lib/compiler';
import { SAMPLE_RESUME } from '../lib/sample';

declare global {
  interface Window {
    html2canvas: any;
    jspdf: any;
  }
}

export default function ResumeBuilder() {
  const [texCode, setTexCode] = useState(SAMPLE_RESUME);
  const [htmlOutput, setHtmlOutput] = useState('');
  const [logMessage, setLogMessage] = useState('ready');
  const [logType, setLogType] = useState<'ok' | 'error' | 'info'>('info');
  const [fileName, setFileName] = useState('resume');
  const [isExporting, setIsExporting] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const setLog = useCallback((message: string, type: 'ok' | 'error' | 'info' = 'info') => {
    setLogMessage(message);
    setLogType(type);
  }, []);

  const render = useCallback(() => {
    try {
      const html = compileTexToHtml(texCode);
      setHtmlOutput(html);
      
      const sectionCount = (texCode.match(/\\section/g) || []).length;
      const itemCount = (texCode.match(/\\item/g) || []).length;
      
      setLog(
        `parsed ${texCode.length} characters, ${sectionCount} section(s), ${itemCount} list item(s), 0 errors`,
        'ok'
      );
    } catch (err) {
      setLog(`parse failed: ${err instanceof Error ? err.message : 'unknown error'}`, 'error');
    }
  }, [texCode, setLog]);

  useEffect(() => {
    render();
  }, [render]);

  const handleCodeChange = useCallback((value: string) => {
    setTexCode(value);
    
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    debounceTimer.current = setTimeout(() => {
      render();
    }, 200);
  }, [render]);

  const handleExport = useCallback(async () => {
    if (typeof window.html2canvas === 'undefined' || typeof window.jspdf === 'undefined') {
      setLog('export libraries failed to load, check your connection and retry', 'error');
      return;
    }

    if (!pageRef.current) return;

    setIsExporting(true);
    setLog('rendering page to canvas...');

    try {
      const canvas = await window.html2canvas(pageRef.current, {
        scale: 2,
        backgroundColor: '#FFFFFF'
      });

      setLog('building PDF...');
      
      const jsPDFCtor = window.jspdf.jsPDF;
      const pdf = new jsPDFCtor({
        unit: 'in',
        format: 'letter',
        orientation: 'portrait'
      });

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, 8.5, 11);

      const sanitizedName = sanitizeFilename(fileName) + '.pdf';
      pdf.save(sanitizedName);

      setLog(`saved ${sanitizedName}`, 'ok');
    } catch (err) {
      setLog(`export failed: ${err instanceof Error ? err.message : 'unknown error'}`, 'error');
    } finally {
      setIsExporting(false);
    }
  }, [fileName, pageRef, setLog]);

  return (
    <div className="app">
      <Header
        fileName={fileName}
        setFileName={setFileName}
        onExport={handleExport}
        isExporting={isExporting}
      />

      <div className="panes">
        <Editor value={texCode} onChange={handleCodeChange} />
        <Preview htmlContent={htmlOutput} pageRef={pageRef} />
      </div>

      <LogStrip message={logMessage} type={logType} />
    </div>
  );
}
