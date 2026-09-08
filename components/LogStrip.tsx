interface LogStripProps {
  message: string;
  type: 'ok' | 'error' | 'info';
}

export default function LogStrip({ message, type }: LogStripProps) {
  const className = type === 'error' ? 'err' : type === 'ok' ? 'ok' : '';
  
  return (
    <div className="log">
      <span className={className}>{message}</span>
    </div>
  );
}
