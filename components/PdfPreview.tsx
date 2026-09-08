interface PdfPreviewProps {
  htmlContent: string | null;
}

export default function PdfPreview({ htmlContent }: PdfPreviewProps) {
  if (!htmlContent) {
    return (
      <div className="h-[70vh] flex items-center justify-center text-gray-400 text-sm">
        Compiled output will appear here
      </div>
    );
  }

  return (
    <div 
      className="h-[70vh] overflow-auto p-6"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
