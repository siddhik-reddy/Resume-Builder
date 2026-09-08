export function compileTexToHtml(texCode: string): string {
  let html = texCode;

  // Escape HTML entities first
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Remove document structure
  html = html.replace(/\\documentclass.*?$/m, "");
  html = html.replace(/\\usepackage.*?$/gm, "");
  html = html.replace(/\\begin\{document\}/, "");
  html = html.replace(/\\end\{document\}/, "");

  // Remove LaTeX comments
  html = html.replace(/(?<!\\)%.*$/gm, "");

  // Convert special characters
  html = html.replace(/\\&/g, "&amp;");
  html = html.replace(/\\%/g, "%");
  html = html.replace(/\\#/g, "#");
  html = html.replace(/\\_/g, "_");

  // Convert sizing and formatting commands
  html = html.replace(/\\fontsize\{\d+\}\{\d+\}\\selectfont\\bfseries\s*([^\n]+)/g, '<h1 class="name">$1</h1>');
  html = html.replace(/\\Large\s+\\textbf\{([\s\S]*?)\}/g, '<h1 class="name">$1</h1>');
  html = html.replace(/\\Large\s+(.*?)$/gm, "<h3>$1</h3>");
  html = html.replace(/\\large\s+(.*?)$/gm, "<h3>$1</h3>");
  html = html.replace(/\\small\s+(.*?)$/gm, "<small>$1</small>");
  html = html.replace(/\\footnotesize\s+(.*?)$/gm, "<small>$1</small>");

  // Convert sections
  html = html.replace(/\\section\*?\{([\s\S]*?)\}/g, '<h2 class="section-title">$1</h2>');

  // Convert text formatting
  html = html.replace(/\\textbf\{([\s\S]*?)\}/g, "<strong>$1</strong>");
  html = html.replace(/\\textit\{([\s\S]*?)\}/g, "<em>$1</em>");
  html = html.replace(/\\underline\{([\s\S]*?)\}/g, "<u>$1</u>");
  html = html.replace(/\\textcolor\{[^}]*\}\{([\s\S]*?)\}/g, "$1");
  html = html.replace(/\\color\{[^}]*\}/g, "");

  // Convert lists
  html = html.replace(
    /\\begin\{itemize\}(\[[^\]]*\])?([\s\S]*?)\\end\{itemize\}/g,
    function(match: string, opts: string, content: string): string {
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

  html = html.replace(
    /\\begin\{enumerate\}(\[[^\]]*\])?([\s\S]*?)\\end\{enumerate\}/g,
    function(match: string, opts: string, content: string): string {
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

  // Convert environments
  html = html.replace(
    /\\begin\{center\}([\s\S]*?)\\end\{center\}/g,
    '<div class="center">$1</div>'
  );
  html = html.replace(
    /\\begin\{flushleft\}([\s\S]*?)\\end\{flushleft\}/g,
    '<div class="left">$1</div>'
  );

  // Convert tabularx to simple table
  html = html.replace(
    /\\begin\{tabularx\}\{[^}]*\}([\s\S]*?)\\end\{tabularx\}/g,
    function(match: string, content: string): string {
      // Split rows
      const rows = content.split("\\\\");
      let tableHtml = '<div class="table">';
      
      rows.forEach(function(row: string) {
        if (row.trim() === "") return;
        
        // Split columns by &
        const cols = row.split("&");
        tableHtml += '<div class="table-row">';
        
        cols.forEach(function(col: string) {
          tableHtml += '<div class="table-cell">' + col.trim() + '</div>';
        });
        
        tableHtml += '</div>';
      });
      
      tableHtml += '</div>';
      return tableHtml;
    }
  );

  // Convert hyperlinks
  html = html.replace(
    /\\href\{([^}]+)\}\{([^}]+)\}/g,
    '<a href="$1" class="link">$2</a>'
  );

  // Convert fontawesome icons
  html = html.replace(/\\faEnvelope\s*/g, '');
  html = html.replace(/\\faPhone\s*/g, '');
  html = html.replace(/\\faLinkedin\s*/g, '');
  html = html.replace(/\\faGithub\s*/g, '');
  html = html.replace(/\\faGlobe\s*/g, '');

  // Handle spacing
  html = html.replace(/\\vspace\{.*?\}/g, '<div style="height: 10px;"></div>');
  html = html.replace(/\\hspace\{.*?\}/g, '<span style="margin-left: 10px;"></span>');
  html = html.replace(/\\vfill/g, '<div style="flex: 1;"></div>');
  html = html.replace(/\\quad/g, ' ');
  html = html.replace(/\\;/g, ' | ');
  html = html.replace(/\\,/g, ' ');

  // Handle parbox and colorbox
  html = html.replace(
    /\\colorbox\{[^}]*\}\{\\parbox\{[^}]*\}\{([\s\S]*?)\}\}/g,
    '<div class="highlight">$1</div>'
  );
  html = html.replace(/\\parbox\{[^}]*\}\{([\s\S]*?)\}/g, '<div>$1</div>');

  // Remove remaining LaTeX commands
  html = html.replace(/\\[a-zA-Z]+\*?\{([\s\S]*?)\}/g, "$1");
  html = html.replace(/\\[a-zA-Z]+/g, "");

  // Convert line breaks
  html = html.replace(/\\\\/g, "<br/>");

  // Clean up
  html = html.replace(/^\s*[\r\n]/gm, "");
  html = html.replace(/\{([^}]*)\}/g, "$1");

  return html.trim();
}

export function sanitizeFilename(name: string): string {
  const cleaned = name.replace(/[\/\\:*?"<>|]/g, "").trim();
  return cleaned === "" ? "resume" : cleaned;
}
