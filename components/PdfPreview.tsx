interface PdfPreviewProps {
  htmlContent: string | null;
}

export default function PdfPreview({ htmlContent }: PdfPreviewProps) {
  if (!htmlContent) {
    return (
      <div className="h-[70vh] flex items-center justify-center text-gray-400">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="mt-2 text-sm">Compiled preview will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[70vh] overflow-auto bg-white p-8">
      <div 
        className="max-w-3xl mx-auto"
        style={{
          fontFamily: "'Times New Roman', serif",
          color: '#1a1a1a',
          lineHeight: '1.6'
        }}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
}
