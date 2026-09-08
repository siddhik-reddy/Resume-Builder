interface TexEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TexEditor({ value, onChange }: TexEditorProps) {
  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-[70vh] p-4 font-mono text-sm resize-none focus:outline-none bg-gray-50 text-gray-800"
        spellCheck={false}
        placeholder="Enter LaTeX code..."
      />
      <div className="absolute bottom-4 right-4 text-xs text-gray-400">
        {value.split('\n').length} lines
      </div>
    </div>
  );
}
