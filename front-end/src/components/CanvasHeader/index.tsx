import React from 'react';
import { Button, Space, Upload, Popover } from 'antd';
import { useHistoryStore } from '@/stores/historyStore';
import { AddElementCommand } from '@/utils/commands';
import html2canvas from 'html2canvas';
import { usePresentationStore } from '@/stores/presentationStore';
import { shapes } from '@/components/ElementRenderer/shape';

const Header: React.FC = () => {
  const { execute } = useHistoryStore();
  const { slides, currentSlideIndex, selectedElementIds, loadState } = usePresentationStore();

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

  const addShape = (shapeType: string) => {
    const command = new AddElementCommand({
      type: 'shape',
      left: 200,
      top: 200,
      width: 100,
      height: 100,
      content: shapeType, // 使用content字段存储图形类型
      style: { fill: '#4096ff', stroke: '#1677ff', strokeWidth: 2 },
    });
    execute(command);
  };

  const addLine = () => {
    const command = new AddElementCommand({
      type: 'line',
      left: 200,
      top: 200,
      width: 200,
      height: 2, // 线条的高度设为很小的值
      content: '', // 线条不需要内容
      style: { 
        stroke: '#000000', 
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeDasharray: '' // 默认实线
      },
    });
    execute(command);
  };

  // 添加图片元素（通过 Upload 选择图片）
  const addImage = (file: File) => {
    if (!file) return false;
    const url = URL.createObjectURL(file);

    // 默认尺寸，保持常见比例（4:3）
    const defaultWidth = 240;
    const defaultHeight = 180;

    const command = new AddElementCommand({
      type: 'image',
      left: 220,
      top: 220,
      width: defaultWidth,
      height: defaultHeight,
      content: url, // 使用本地预览 URL
      style: { },
    });
    execute(command);
    // 不上传到服务器，阻止默认上传行为
    return false;
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

  const shapePopoverContent = (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(8, 1fr)',
      gap: '8px',
      padding: '12px',
      // maxWidth: '400px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    }}>
      {shapes.map((shape) => (
        <div
          key={shape.type}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px',
            minHeight: '40px',
            minWidth: '40px',
            cursor: 'pointer',
            borderRadius: '6px',
            border: '1px solid #e8e8e8',
            backgroundColor: '#fafafa',
            transition: 'all 0.2s ease-in-out',
            position: 'relative',
          }}
          onClick={() => addShape(shape.type)}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e6f4ff';
            e.currentTarget.style.borderColor = '#1677ff';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(22, 119, 255, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#fafafa';
            e.currentTarget.style.borderColor = '#e8e8e8';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          title={shape.name}
        >
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: '24px',
            height: '24px'
          }}>
            {shape.svg}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ padding: '11px', backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Space>
        <div style={{ cursor: 'pointer' }} onClick={addText}>
          <svg width="1em" height="1em" viewBox="0 0 48 48" fill="none"><path d="M8 10.9333L8 6H40V10.9333" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"></path><path d="M24 6V42" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"></path><path d="M16 42H32" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"></path></svg>
        </div>
        <Popover 
          content={shapePopoverContent}
          trigger="click"
          placement='bottomRight'
        >
          <div style={{ cursor: 'pointer' }}>
            <svg width="1em" height="1em" viewBox="0 0 48 48" fill="none"><path d="M19 32C11.268 32 5 25.732 5 18C5 10.268 11.268 4 19 4C26.732 4 33 10.268 33 18" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"></path><path d="M44 18H18V44H44V18Z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"></path></svg>
          </div>
        </Popover>
        {/* 插入图片 */}
        <Upload
          beforeUpload={addImage}
          showUploadList={false}
          accept="image/*"
        >
          <div style={{ cursor: 'pointer' }} title="插入图片">
            <svg width="1em" height="1em" viewBox="0 0 48 48" fill="none">
              <rect x="6" y="8" width="36" height="28" rx="2" stroke="currentColor" strokeWidth="4" />
              <circle cx="16" cy="18" r="4" fill="currentColor" />
              <path d="M12 32 L22 22 L30 30 L36 24 L42 32" fill="none" stroke="currentColor" strokeWidth="4" />
            </svg>
          </div>
        </Upload>
        <div style={{ cursor: 'pointer' }} onClick={addLine}>
          <svg width="1em" height="1em" viewBox="0 0 48 48" fill="none"><path d="M6 24L42 24" stroke="currentColor" strokeWidth="4" strokeLinecap="round"></path></svg>
        </div>
      </Space>
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