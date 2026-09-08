// Simple LaTeX to HTML converter (no external dependencies)
export function compileTexToHtml(texCode: string): string {
  try {
    let html = texCode;
    
    // Remove document structure
    html = html.replace(/\\documentclass.*?$/m, '');
    html = html.replace(/\\usepackage.*?$/gm, '');
    html = html.replace(/\\begin{document}/, '');
    html = html.replace(/\\end{document}/, '');
    
    // Convert sections
    html = html.replace(/\\section\*?\{(.*?)\}/g, '<h2 class="section-title">$1</h2>');
    html = html.replace(/\\section\{(.*?)\}/g, '<h2 class="section-title">$1</h2>');
    
    // Convert text formatting
    html = html.replace(/\\textbf\{(.*?)\}/g, '<strong>$1</strong>');
    html = html.replace(/\\textit\{(.*?)\}/g, '<em>$1</em>');
    html = html.replace(/\\underline\{(.*?)\}/g, '<u>$1</u>');
    
    // Convert sizing commands
    html = html.replace(/\\Large\s+\\textbf\{(.*?)\}/g, '<h1 class="name">$1</h1>');
    html = html.replace(/\\Large\s+(.*?)$/gm, '<h3>$1</h3>');
    html = html.replace(/\\small\s+(.*?)$/gm, '<small>$1</small>');
    
    // Convert itemize environments
    html = html.replace(/\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g, function(match, content) {
      const items = content.split('\\item').filter(item => item.trim());
      const listItems = items.map(item => `<li>${item.trim()}</li>`).join('');
      return `<ul>${listItems}</ul>`;
    });
    
    // Convert enumerate environments
    html = html.replace(/\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/g, function(match, content) {
      const items = content.split('\\item').filter(item => item.trim());
      const listItems = items.map(item => `<li>${item.trim()}</li>`).join('');
      return `<ol>${listItems}</ol>`;
    });
    
    // Convert line breaks
    html = html.replace(/\\\\/g, '<br/>');
    
    // Convert centering
    html = html.replace(/\\begin\{center\}([\s\S]*?)\\end\{center\}/g, '<div class="center">$1</div>');
    html = html.replace(/\\begin\{flushleft\}([\s\S]*?)\\end\{flushleft\}/g, '<div class="left">$1</div>');
    
    // Handle remaining LaTeX commands
    html = html.replace(/\\vspace\{.*?\}/g, '<div style="height: 10px;"></div>');
    html = html.replace(/\\hspace\{.*?\}/g, '<span style="margin-left: 10px;"></span>');
    
    // Clean up
    html = html.replace(/^\s*$/gm, '');
    
    return html;
  } catch (error) {
    console.error('LaTeX compilation error:', error);
    throw new Error('Failed to compile LaTeX');
  }
}
