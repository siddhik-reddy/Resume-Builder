declare global {
  interface Window {
    swiftlatex: any;
  }
}

let engineInstance: any = null;

async function loadSwiftLatex() {
  if (engineInstance) return engineInstance;

  // Load SwiftLaTeX from CDN
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/swiftlatex@latest/dist/swiftlatex.min.js';
  document.head.appendChild(script);

  await new Promise((resolve, reject) => {
    script.onload = resolve;
    script.onerror = reject;
  });

  // Initialize engine
  if (window.swiftlatex) {
    engineInstance = await window.swiftlatex.load();
    return engineInstance;
  }

  throw new Error('Failed to load SwiftLaTeX');
}

export async function compileTex(texCode: string) {
  const engine = await loadSwiftLatex();
  const result = engine.compileLaTeX(texCode);
  
  return {
    pdf: result.pdf,
    log: result.log,
    status: result.status
  };
}
