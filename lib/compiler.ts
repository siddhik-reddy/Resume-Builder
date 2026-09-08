// Simple LaTeX to HTML converter (no external dependencies)
export function compileTexToHtml(texCode: string): string {
  try {
    let html: string = texCode;

    // 0. Escape HTML special characters FIRST, before injecting any real tags.
    //    Otherwise user-supplied `<`, `>`, `&` in the LaTeX source would be
    //    interpreted as markup (and is an XSS risk if rendered as trusted HTML).
    html = html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // 1. Remove document structure
    html = html.replace(/\\documentclass.*?$/m, '');
    html = html.replace(/\\usepackage.*?$/gm, '');
    html = html.replace(/\\begin\{document\}/, '');
    html = html.replace(/\\end\{document\}/, '');

    // 2. Convert environments (itemize/enumerate) BEFORE inline formatting,
    //    since \item content may itself contain \textbf etc.
    html = html.replace(/\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g, (_match, content: string) => {
      const items = content.split('\\item').filter((item: string) => item.trim() !== '');
      const listItems = items.map((item: string) => `<li>${item.trim()}</li>`).join('');
      return `<ul>${listItems}</ul>`;
    });

    html = html.replace(/\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/g, (_match, content: string) => {
      const items = content.split('\\item').filter((item: string) => item.trim() !== '');
      const listItems = items.map((item: string) => `<li>${item.trim()}</li>`).join('');
      return `<ol>${listItems}</ol>`;
    });

    // 3. Convert sizing commands BEFORE generic \textbf/\textit conversion,
    //    since \Large\textbf{...} needs to see the raw \textbf token.
    //    `s` flag lets `.` match newlines for multi-line content.
    html = html.replace(/\\Large\s+\\textbf\{(.*?)\}/gs, '<h1 class="name">$1</h1>');
    html = html.replace(/\\Large\s+(.*?)$/gm, '<h3>$1</h3>');
    html = html.replace(/\\small\s+(.*?)$/gm, '<small>$1</small>');

    // 4. Convert sections
    html = html.replace(/\\section\*?\{(.*?)\}/gs, '<h2 class="section-title">$1</h2>');

    // 5. Convert remaining text formatting (dotAll flag for multi-line content)
    html = html.replace(/\\textbf\{(.*?)\}/gs, '<strong>$1</strong>');
    html = html.replace(/\\textit\{(.*?)\}/gs, '<em>$1</em>');
    html = html.replace(/\\underline\{(.*?)\}/gs, '<u>$1</u>');

    // 6. Convert line breaks
    html = html.replace(/\\\\/g, '<br/>');

    // 7. Convert centering / alignment
    html = html.replace(/\\begin\{center\}([\s\S]*?)\\end\{center\}/g, '<div class="center">$1</div>');
    html = html.replace(/\\begin\{flushleft\}([\s\S]*?)\\end\{flushleft\}/g, '<div class="left">$1</div>');

    // 8. Handle spacing commands
    html = html.replace(/\\vspace\{.*?\}/g, '<div style="height: 10px;"></div>');
    html = html.replace(/\\hspace\{.*?\}/g, '<span style="margin-left: 10px;"></span>');

    // 9. Strip LaTeX comments (unescaped %, not \%)
    html = html.replace(/(?<!\\)%.*$/gm, '');

    // 10. Fallback: strip any leftover \command{...} or \command patterns
    //     so unhandled LaTeX doesn't leak into the output as raw text.
    html = html.replace(/\\[a-zA-Z]+\*?\{(.*?)\}/gs, '$1');
    html = html.replace(/\\[a-zA-Z]+/g, '');

    // 11. Clean up blank lines
    html = html.replace(/^\s*$/gm, '');

    return html.trim();
  } catch (error) {
    console.error('LaTeX compilation error:', error);
    throw new Error('Failed to compile LaTeX');
  }
}
