import React from 'react';
import { Button, Upload } from 'antd';
import html2canvas from 'html2canvas';
import { usePresentationStore } from '@/stores/presentationStore';

const Header: React.FC = () => {
  const { slides, currentSlideIndex, selectedElementIds, loadState } = usePresentationStore();

  const handlePreview = () => {
    window.open('/preview');
  };

  const handleDownload = () => {
    const canvas = document.querySelector('.leafer-canvas') as HTMLElement;
    if (canvas) {
      html2canvas(canvas).then(canvas => {
        const link = document.createElement('a');
        link.download = 'slide.png';
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  };

  const handleSave = () => {
    const state = { slides, currentSlideIndex, selectedElementIds };
    const blob = new Blob([JSON.stringify(state)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'presentation.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleLoad = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        const state = JSON.parse(content);
        loadState(state);
      }
    };
    reader.readAsText(file);
    return false;
  };

  return (
    <div style={{ padding: '11px', backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '40px' }}>
      <div>
        {/* <Button onClick={handlePreview} style={{ marginRight: '8px' }}>预览</Button>
        <Button onClick={handleDownload} style={{ marginRight: '8px' }}>下载</Button>
        <Button onClick={handleSave} style={{ marginRight: '8px' }}>保存</Button>
        <Upload beforeUpload={handleLoad} showUploadList={false}>
          <Button>加载</Button>
        </Upload> */}
      </div>
    </div>
  );
};

export default Header;