import { useState, useCallback } from 'react';
import { TexCompiler } from '@/lib/tex/compiler';

export function useTexCompiler() {
  const [isCompiling, setIsCompiling] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const compile = useCallback(async (texCode: string) => {
    setIsCompiling(true);
    setError(null);
    
    try {
      const result = await TexCompiler.compile(texCode);
      
      if (result.status === 0) {
        const blob = new Blob([result.pdf], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } else {
        setError('Compilation failed. Check your LaTeX code.');
      }
    } catch
