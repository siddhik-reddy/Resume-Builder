import swiftlatex from '@swiftlatex/webassembly';

let engineInstance: any = null;

async function getEngine() {
  if (!engineInstance) {
    engineInstance = await swiftlatex.load();
  }
  return engineInstance;
}

export async function compileTex(texCode: string) {
  const engine = await getEngine();
  const result = engine.compileLaTeX(texCode);
  
  return {
    pdf: result.pdf,
    log: result.log,
    status: result.status
  };
}
