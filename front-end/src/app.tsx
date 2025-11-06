import React from 'react';

function injectPptxScript() {
  if (typeof window === 'undefined') return;
  if ((window as any).PptxGenJS) return;
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/gh/gitbrent/pptxgenjs/dist/pptxgen.bundle.js';
  script.async = true;
  document.head.appendChild(script);
}

export function rootContainer(container: React.ReactNode) {
  injectPptxScript();
  return container;
}