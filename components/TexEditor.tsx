interface TexEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TexEditor({ value, onChange }: TexEditorProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-[70vh] p-4 font-mono text-sm resize-none focus:outline-none bg-gray-50"
      spellCheck={false}
      placeholder="Enter LaTeX code..."
    />
  );
}
