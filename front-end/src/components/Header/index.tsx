import React from 'react';
import { Button, Upload, Dropdown, Space, Input } from 'antd';
import { EyeOutlined, DownloadOutlined, UploadOutlined, EditOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
// import html2canvas from 'html2canvas';
import { usePresentationStore } from '@/stores/presentationStore';
import pptxgen from 'pptxgenjs';

const Header: React.FC = () => {
  const { slides, currentSlideIndex, selectedElementIds, loadState, name, setName } = usePresentationStore();
  const [isEditingName, setIsEditingName] = React.useState(false);

  const handlePreview = () => {
    const state = usePresentationStore.getState();
    localStorage.setItem('presentation-for-preview', JSON.stringify(state));
    window.open('/preview');
  };

  const handleSaveJSON = () => {
    const state = { slides, currentSlideIndex, selectedElementIds };
    const blob = new Blob([JSON.stringify(state)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fileBase = (name && name.trim()) ? name.trim() : 'presentation';
    link.download = `${fileBase}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPPT = () => {
    return
    // const pptx = new pptxgen();
    // slides.forEach(slide => {
    //   const pptxSlide = pptx.addSlide();
    //   if (slide.background?.color) {
    //     pptxSlide.background = { color: slide.background.color.replace('#', '') };
    //   }

    //   slide.elements.forEach(element => {
    //     const props = {
    //       x: (element.left || 0) / 96,
    //       y: (element.top || 0) / 96,
    //       w: element.width / 96,
    //       h: element.height / 96,
    //     };
    //     if (element.type === 'text' && element.content) {
    //       const { color, fill, ...rest } = element.style
    //       const textOptions: TextPropsOptions = {
    //         ...rest,
    //         x: pxToInches(element.left),
    //         y: pxToInches(element.top),
    //         w: pxToInches(element.width),
    //         h: pxToInches(element.height),
    //         color: (fill as string || color as string || '#000000').replace('#', ''),
    //         valign: 'middle',
    //         align: 'center',
    //         fontSize: pxToPt(element.style.fontSize as number || 28),
    //       };
    //       pptSlide.addText(element.content, textOptions);
    //     } else if (element.type === 'image') {
    //       pptSlide.addImage({
    //         path: element.src,
    //         x: pxToInches(element.left),
    //         y: pxToInches(element.top),
    //         w: pxToInches(element.width),
    //         h: pxToInches(element.height),
    //       });
    //     } else if (element.type === 'shape') {
    //       const shapeType = element.shape;
    //       const options = {
    //         x: pxToInches(element.left),
    //         y: pxToInches(element.top),
    //         w: pxToInches(element.width),
    //         h: pxToInches(element.height),
    //         fill: (element.style.backgroundColor || '#ffffff').replace('#', ''),
    //       };
    //       switch (shapeType) {
    //         case 'rectangle':
    //           pptSlide.addShape(pptx.shapes.RECTANGLE, options);
    //           break;
    //         case 'circle':
    //           pptSlide.addShape(pptx.shapes.OVAL, options);
    //           break;
    //         case 'triangle':
    //           pptSlide.addShape(pptx.shapes.TRIANGLE, options);
    //           break;
    //         case 'diamond':
    //           pptSlide.addShape(pptx.shapes.DIAMOND, options);
    //           break;
    //         case 'arrow-right':
    //           pptSlide.addShape(pptx.shapes.RIGHT_ARROW, options);
    //           break;
    //         case 'hexagon':
    //           pptSlide.addShape(pptx.shapes.HEXAGON, options);
    //           break;
    //         case 'pentagon':
    //           pptSlide.addShape(pptx.shapes.PENTAGON, options);
    //           break;
    //         case 'star':
    //           pptSlide.addShape(pptx.shapes.STAR_5_POINT, options);
    //           break;
    //         default:
    //           break;
    //       }
    //     }
    //   });
    // });
    // const fileBase = (name && name.trim()) ? name.trim() : 'presentation';
    // pptx.writeFile({ fileName: `${fileBase}.pptx` });
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

  const items: MenuProps['items'] = [
    {
      key: 'json',
      label: '导出为 JSON',
      onClick: handleSaveJSON,
    },
    {
      key: 'ppt',
      label: '导出为 PPT',
      onClick: handleExportPPT,
      disabled: true,
    }
  ];

  return (
    <div style={{ padding: '10px 12px', backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {isEditingName ? (
        <Input
          size="small"
          value={name}
          autoFocus
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setIsEditingName(false)}
          onPressEnter={() => setIsEditingName(false)}
          onKeyDown={(e) => { if (e.key === 'Escape') setIsEditingName(false); }}
          placeholder="请输入PPT名称"
          prefix={<EditOutlined style={{ color: '#8c8c8c' }} />}
          style={{ width: 240, borderRadius: 5, background: '#f7f9fc', borderColor: '#e5e7eb' }}
          allowClear
          maxLength={64}
        />
      ) : (
        <div
          onClick={() => setIsEditingName(true)}
          title="点击编辑名称"
          style={{
            width: 240,
            minHeight: 24,
            borderRadius: 5,
            padding: '0 8px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'text',
            color: '#333',
          }}
        >
          <EditOutlined style={{ color: '#8c8c8c' }} />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {name && name.trim() ? name : '未命名演示文稿'}
          </span>
        </div>
      )}
      <Space size="small" align='center'>
        <Button size='small' type="primary" icon={<EyeOutlined />} onClick={handlePreview}>
          预览
        </Button>
        <Dropdown menu={{ items }} placement="bottomLeft">
          <Button size='small' icon={<DownloadOutlined />}>
            下载
          </Button>
        </Dropdown>
        <Upload beforeUpload={handleLoad} showUploadList={false}>
          <Button size='small' icon={<UploadOutlined />}>
            加载
          </Button>
        </Upload>
      </Space>
    </div>
  );
};

export default Header;