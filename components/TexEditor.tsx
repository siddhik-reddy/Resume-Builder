interface TexEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TexEditor({ value, onChange }: TexEditorProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-[600px] p-4 font-mono text-sm resize-none focus:outline-none"
      spellCheck={false}
      placeholder="Enter your LaTeX code here..."
    />
  );
}
