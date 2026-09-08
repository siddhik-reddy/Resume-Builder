declare module 'latex.js' {
  export const latex: {
    toHTML(texCode: string): string;
    parse(texCode: string): any;
    toMarkdown(texCode: string): string;
  };
}
