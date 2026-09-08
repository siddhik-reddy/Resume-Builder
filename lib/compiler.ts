export function compileTexToHtml(texCode: string): string {
  let html = texCode;

  // Escape HTML entities
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Remove document structure
  html = html.replace(/\\documentclass.*?$/m, "");
  html = html.replace(/\\usepackage.*?$/gm, "");
  html = html.replace(/\\begin\{document\}/, "");
  html = html.replace(/\\end\{document\}/, "");

  // Convert itemize environments
  html = html.replace(
    /\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g,
    function(match: string, content: string): string {
      const items: string[] = content
        .split("\\item")
        .filter(function(item: string): boolean {
          return item.trim() !== "";
        });
      
      const listItems: string = items
        .map(function(item: string): string {
          return "<li>" + item.trim() + "</li>";
        })
        .join("");
      
      return "<ul>" + listItems + "</ul>";
    }
  );

  // Convert enumerate environments
  html = html.replace(
    /\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/g,
    function(match: string, content: string): string {
      const items: string[] = content
        .split("\\item")
        .filter(function(item: string): boolean {
          return item.trim() !== "";
        });
      
      const listItems: string = items
        .map(function(item: string): string {
          return "<li>" + item.trim() + "</li>";
        })
        .join("");
      
      return "<ol>" + listItems + "</ol>";
    }
  );

  // Convert sizing commands
  html = html.replace(/\\Large\s+\\textbf\{([\s\S]*?)\}/g, '<h1 class="name">$1</h1>');
  html = html.replace(/\\Large\s+(.*?)$/gm, "<h3>$1</h3>");
  html = html.replace(/\\small\s+(.*?)$/gm, "<small>$1</small>");

  // Convert sections
  html = html.replace(/\\section\*?\{([\s\S]*?)\}/g, '<h2 class="section-title">$1</h2>');

  // Convert text formatting
  html = html.replace(/\\textbf\{([\s\S]*?)\}/g, "<strong>$1</strong>");
  html = html.replace(/\\textit\{([\s\S]*?)\}/g, "<em>$1</em>");
  html = html.replace(/\\underline\{([\s\S]*?)\}/g, "<u>$1</u>");

  // Convert line breaks
  html = html.replace(/\\\\/g, "<br/>");

  // Convert centering
  html = html.replace(
    /\\begin\{center\}([\s\S]*?)\\end\{center\}/g,
    '<div class="center">$1</div>'
  );
  html = html.replace(
    /\\begin\{flushleft\}([\s\S]*?)\\end\{flushleft\}/g,
    '<div class="left">$1</div>'
  );

  // Handle spacing
  html = html.replace(/\\vspace\{.*?\}/g, '<div style="height: 10px;"></div>');
  html = html.replace(/\\hspace\{.*?\}/g, '<span style="margin-left: 10px;"></span>');

  // Remove comments
  html = html.replace(/(?<!\\)%.*$/gm, "");

  // Remove remaining LaTeX commands
  html = html.replace(/\\[a-zA-Z]+\*?\{([\s\S]*?)\}/g, "$1");
  html = html.replace(/\\[a-zA-Z]+/g, "");

  // Clean up empty lines
  html = html.replace(/^\s*[\r\n]/gm, "");

  return html.trim();
}

export function sanitizeFilename(name: string): string {
  const cleaned = name.replace(/[\/\\:*?"<>|]/g, "").trim();
  return cleaned === "" ? "resume" : cleaned;
}
