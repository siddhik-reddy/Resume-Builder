import { RefObject } from 'react';

interface PreviewProps {
  htmlContent: string;
  pageRef: RefObject<HTMLDivElement>;
}

export default function Preview({ htmlContent, pageRef }: PreviewProps) {
  return (
    <div className="pane preview-pane">
      <div className="pane-label">preview</div>
      <div className="page-wrap">
        <div
          className="page"
          ref={pageRef}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  );
}
