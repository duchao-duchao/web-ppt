import React from 'react';
import { Button, Space, Upload } from 'antd';
import { useHistoryStore } from '@/stores/historyStore';
import { AddElementCommand } from '@/utils/commands';
import html2canvas from 'html2canvas';
import { usePresentationStore } from '@/stores/presentationStore';

const Header: React.FC = () => {
  const { execute } = useHistoryStore();
  const { slides, currentSlideIndex, selectedElementIds, loadState } = usePresentationStore();

  const addRect = () => {
    const command = new AddElementCommand({
      type: 'rect',
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      style: { backgroundColor: '#ff0000' },
    });
    execute(command);
  };

  const addText = () => {
    const command = new AddElementCommand({
      type: 'text',
      left: 150,
      top: 150,
      width: 150,
      height: 50,
      content: 'Hello World',
      style: { color: '#000000', fontSize: 24 },
    });
    execute(command);
  };

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

  console.log('header');
  

  return (
    <div style={{ padding: '16px', borderBottom: '1px solid #e8e8e8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Space>
        <Button onClick={addRect}>Add Rect</Button>
        <Button onClick={addText}>Add Text</Button>
      </Space>
      <div>
        <Button onClick={handlePreview} style={{ marginRight: '8px' }}>预览</Button>
        <Button onClick={handleDownload} style={{ marginRight: '8px' }}>下载</Button>
        <Button onClick={handleSave} style={{ marginRight: '8px' }}>保存</Button>
        <Upload beforeUpload={handleLoad} showUploadList={false}>
          <Button>加载</Button>
        </Upload>
      </div>
    </div>
  );
};

export default Header;