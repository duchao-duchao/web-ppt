import React from 'react';
import { Button, Upload, Dropdown, Space, Input } from 'antd';
import { EyeOutlined, DownloadOutlined, UploadOutlined, EditOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { usePresentationStore } from '@/stores/presentationStore';
// import pptxgen from 'pptxgenjs';

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
    try {
      const pptx = new window.PptxGenJS();
      const pxToInches = (px: number) => px / 96;
      const pxToPt = (px: number) => px * 0.75;
      const shapeOf = (type: string) => {
        const s = pptx.shapes;
        switch (type) {
          case 'rectangle':
          case 'square':
            return s.RECTANGLE;
          case 'circle':
          case 'ellipse':
            return s.OVAL;
          case 'triangle':
            return s.TRIANGLE;
          case 'diamond':
            return s.DIAMOND;
          case 'arrow-right':
            return s.RIGHT_ARROW;
          case 'hexagon':
            return s.HEXAGON;
          case 'pentagon':
            return s.PENTAGON;
          case 'star':
            return s.STAR_5_POINT;
          // 无法映射的类型退化为矩形
          default:
            return s.RECTANGLE;
        }
      };

      slides.forEach((s) => {
        const slide = pptx.addSlide();
        // 背景色（去掉#）
        if (s.background?.color) {
          slide.background = { color: s.background.color.replace('#', '') };
        }

        s.elements.forEach((e) => {
          const left = (e.x ?? e.left ?? 0);
          const top = (e.y ?? e.top ?? 0);
          const w = e.width ?? 0;
          const h = e.height ?? 0;

          if (e.type === 'text') {
            const color = (e.style?.color || '#000000').replace('#', '');
            const align = (e.style?.textAlign || 'left') as 'left' | 'center' | 'right';
            const fontSizePx = e.style?.fontSize ?? 16;
            const isBold =
              (e.style?.fontWeight ?? 'normal') === 'bold' ||
              (typeof e.style?.fontWeight === 'number' ? e.style!.fontWeight! >= 600 : false);

            slide.addText(e.content || '', {
              x: pxToInches(left),
              y: pxToInches(top),
              w: pxToInches(w),
              h: pxToInches(h),
              color,
              fontSize: pxToPt(fontSizePx),
              bold: isBold,
              align,
              valign: 'middle',
            });
          } else if (e.type === 'image') {
            const path = e.content || '';
            if (path) {
              slide.addImage({
                path,
                x: pxToInches(left),
                y: pxToInches(top),
                w: pxToInches(w),
                h: pxToInches(h),
              });
            }
          } else if (e.type === 'shape') {
            const shapeType = shapeOf(e.content || 'rectangle');
            const fillColor = (e.style?.backgroundColor || e.style?.fill || '#ffffff').replace('#', '');
            const lineColor = (e.style?.borderColor || e.style?.stroke || '#000000').replace('#', '');
            const lineWidth = e.style?.borderWidth ?? e.style?.strokeWidth ?? 1;

            slide.addShape(shapeType, {
              x: pxToInches(left),
              y: pxToInches(top),
              w: pxToInches(w),
              h: pxToInches(h),
              fill: fillColor,
              line: { color: lineColor, width: lineWidth },
            });
          } else if (e.type === 'line') {
            const lineColor = (e.style?.stroke || '#000000').replace('#', '');
            const lineWidth = e.style?.strokeWidth ?? 2;

            slide.addShape(pptx.shapes.LINE, {
              x: pxToInches(left),
              y: pxToInches(top + h / 2),
              w: pxToInches(w),
              h: pxToInches(h),
              line: { color: lineColor, width: lineWidth },
            });
          }
        });
      });

      const fileBase = (name && name.trim()) ? name.trim() : 'presentation';
      pptx.writeFile({ fileName: `${fileBase}.pptx` });
    } catch (err) {
      console.error('Export PPT failed:', err);
    }
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