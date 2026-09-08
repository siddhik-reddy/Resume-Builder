import { latex } from 'latex.js';

export function compileTexToHtml(texCode: string): string {
  try {
    const html = latex.toHTML(texCode);
    return html;
  } catch (error) {
    console.error('LaTeX compilation error:', error);
    throw new Error('Failed to compile LaTeX');
  }
}
