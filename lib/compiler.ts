interface ParsedResume {
  name: string;
  title: string;
  contact: string[];
  sections: Array<{
    title: string;
    content: string;
  }>;
}

export function parseLatexResume(texCode: string): string {
  try {
    let html = '';
    
    // Extract header information
    const nameMatch = texCode.match(/\\fontsize\{\d+\}\{\d+\}\\selectfont\\bfseries\s*([^}]+)/);
    const titleMatch = texCode.match(/\\large\\color\{navy\}\s*([^}]+)/);
    
    if (nameMatch) {
      html += `<div class="resume-header">
        <h1 class="resume-name">${nameMatch[1].trim()}</h1>`;
      
      if (titleMatch) {
        html += `<div class="resume-title">${titleMatch[1].trim().replace(/\\;/g, ' | ')}</div>`;
      }
      
      html += '</div>';
    }
    
    // Extract contact info
    const contactPattern = /\\small\s*([\s\S]*?)\\end\{center\}/;
    const contactMatch = texCode.match(contactPattern);
    
    if (contactMatch) {
      let contactHtml = contactMatch[1];
      
      // Clean up contact info
      contactHtml = contactHtml
        .replace(/\\faEnvelope\\?\s*/g, '<span class="icon">✉</span> ')
        .replace(/\\faPhone\\?\s*/g, '<span class="icon">📞</span> ')
        .replace(/\\faLinkedin\\?\s*/g, '<span class="icon">💼</span> ')
        .replace(/\\faGithub\\?\s*/g, '<span class="icon">🐙</span> ')
        .replace(/\\faGlobe\\?\s*/g, '<span class="icon">🌐</span> ')
        .replace(/\\href\{([^}]+)\}\{([^}]+)\}/g, '<a href="$1" class="contact-link">$2</a>')
        .replace(/\\quad/g, '<span class="separator">|</span>')
        .replace(/\\;/g, ' | ')
        .replace(/\\\\/g, '<br/>');
      
      html += `<div class="contact-info">${contactHtml}</div>`;
    }
    
    // Parse sections
    const sectionPattern = /\\section\*\{([^}]+)\}([\s\S]*?)(?=\\section\*|\\vfill|\\end\{document\})/g;
    let sectionMatch;
    
    while ((sectionMatch = sectionPattern.exec(texCode)) !== null) {
      const sectionTitle = sectionMatch[1].trim();
      let sectionContent = sectionMatch[2];
      
      // Clean up section content
      sectionContent = sectionContent
        .replace(/\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g, (match, items) => {
          const itemList = items
            .split('\\item')
            .filter((item: string) => item.trim())
            .map((item: string) => `<li>${item.trim()}</li>`)
            .join('');
          return `<ul>${itemList}</ul>`;
        })
        .replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>')
        .replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>')
        .replace(/\\\\/g, '<br/>')
        .replace(/\\parbox\{[^}]+\}\{/g, '<div>')
        .replace(/\\colorbox\{[^}]+\}\{/g, '<div class="highlight">')
        .replace(/\\centering/g, '')
        .replace(/\{([^}]+)\}/g, '$1')
        .replace(/\\;/g, ' | ')
        .replace(/\\quad/g, ' ');
      
      html += `
        <div class="resume-section">
          <h2 class="section-title">${sectionTitle}</h2>
          <div class="section-content">${sectionContent}</div>
        </div>
      `;
    }
    
    return html;
  } catch (error) {
    console.error('Parsing error:', error);
    throw error;
  }
}

export async function compileTexToHtml(texCode: string): Promise<string> {
  return parseLatexResume(texCode);
}
