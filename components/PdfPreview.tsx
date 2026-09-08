interface PdfPreviewProps {
  url: string | null;
}

export default function PdfPreview({ url }: PdfPreviewProps) {
  if (!url) {
    return (
      <div className="h-[600px] flex items-center justify-center text-gray-400">
        PDF preview will appear here
      </div>
    );
  }

  return (
    <iframe
      src={url}
      className="w-full h-[600px]"
      title="PDF Preview"
    />
  );
}
