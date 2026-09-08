// Wrapper for SwiftLaTeX compilation
import swiftlatex from '@swiftlatex/webassembly';

export class TexCompiler {
  private static instance: any;
  
  static async getInstance() {
    if (!this.instance) {
      this.instance = await swiftlatex.load();
    }
    return this.instance;
  }
  
  static async compile(texCode: string) {
    const engine = await this.getInstance();
    const result = engine.compileLaTeX(texCode);
    return {
      pdf: result.pdf,
      log: result.log,
      status: result.status
    };
  }
}
