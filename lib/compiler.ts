import { latex } from 'latex.js';

export async function compileTexToHtml(texCode: string): Promise<string> {
  try {
    const html = latex.toHTML(texCode);
    return html;
  } catch (error) {
    console.error('LaTeX compilation error:', error);
    throw new Error('Failed to compile LaTeX');
  }
}

export function generatePdfFromHtml(htmlContent: string): void {
  // Create a new window and print to PDF
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Resume</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
        </style>
      </head>
      <body>${htmlContent}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}
