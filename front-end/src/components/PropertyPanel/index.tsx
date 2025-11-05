import React from 'react';
import { Card, Form, InputNumber, Input, Typography, Divider, Space, ColorPicker, Select } from 'antd';
import { usePresentationStore } from '@/stores/presentationStore';

const { Title, Text } = Typography;

const PropertyPanel = () => {
  const { selectedElementIds, slides, currentSlideIndex, updateElement, updateCurrentSlide } = usePresentationStore();

  // 如果没有选中元素，显示画布背景设置
  if (selectedElementIds.length !== 1) {
    const currentSlide = slides[currentSlideIndex];

    const handleBackgroundColorChange = (color: any) => {
      const colorValue = typeof color === 'string' ? color : color.toHexString();
      updateCurrentSlide({ 
        background: { 
          ...currentSlide.background, 
          color: colorValue 
        } 
      });
    };

    const handleBackgroundImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      updateCurrentSlide({ 
        background: { 
          ...currentSlide.background, 
          image: e.target.value 
        } 
      });
    };

    return (
      <Form layout="vertical" size="small" style={{padding: 16}}>
        <Title level={5} style={{ margin: '0 0 12px 0', fontSize: '14px' }}>背景样式</Title>
        
        <Form.Item label="背景颜色" style={{ marginBottom: '16px' }}>
          <ColorPicker
            value={currentSlide.background?.color || '#ffffff'}
            onChange={handleBackgroundColorChange}
            showText
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item label="背景图片URL" style={{ marginBottom: '16px' }}>
          <Input
            value={currentSlide.background?.image || ''}
            onChange={handleBackgroundImageChange}
            placeholder="请输入背景图片URL"
          />
        </Form.Item>
      </Form>
    );
  }

  const selectedElementId = selectedElementIds[0];
  const currentSlide = slides[currentSlideIndex];
  const selectedElement = currentSlide?.elements.find(e => e.id === selectedElementId);

  if (!selectedElement) {
    return (
      <Card title="属性面板" style={{ height: '100%' }}>
        <div style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>
          <Text type="secondary">未找到元素</Text>
        </div>
      </Card>
    );
  }

  const handleNumberChange = (field: string) => (value: number | null) => {
    if (value !== null) {
      updateElement(selectedElementId, { [field]: value });
    }
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateElement(selectedElementId, { [field]: e.target.value });
  };

  const handleColorChange = (field: string) => (color: any) => {
    const colorValue = typeof color === 'string' ? color : color.toHexString();
    updateElement(selectedElementId, { 
      style: { 
        ...selectedElement.style, 
        [field]: colorValue 
      } 
    });
  };

  return (
    <Form layout="vertical" size="small" style={{padding: 16, height: 'calc(100vh - 120px)', overflow: 'auto'}}>
      {/* 位置和尺寸 */}
      <Title level={5} style={{ margin: '0 0 12px 0', fontSize: '14px' }}>位置和尺寸</Title>
      
      <Space.Compact style={{ width: '100%', marginBottom: '12px' }}>
        <Form.Item label="宽度" style={{ flex: 1, marginBottom: 0, marginRight: '8px' }}>
          <InputNumber
            value={selectedElement.width}
            onChange={handleNumberChange('width')}
            min={1}
            style={{ width: '100%' }}
            placeholder="宽度"
          />
        </Form.Item>
        <Form.Item label="高度" style={{ flex: 1, marginBottom: 0 }}>
          <InputNumber
            value={selectedElement.height}
            onChange={handleNumberChange('height')}
            min={1}
            style={{ width: '100%' }}
            placeholder="高度"
          />
        </Form.Item>
      </Space.Compact>

      <Space.Compact style={{ width: '100%', marginBottom: '16px' }}>
        <Form.Item label="X坐标" style={{ flex: 1, marginBottom: 0, marginRight: '8px' }}>
          <InputNumber
            value={selectedElement.x}
            onChange={handleNumberChange('x')}
            style={{ width: '100%' }}
            placeholder="X坐标"
          />
        </Form.Item>
        <Form.Item label="Y坐标" style={{ flex: 1, marginBottom: 0 }}>
          <InputNumber
            value={selectedElement.y}
            onChange={handleNumberChange('y')}
            style={{ width: '100%' }}
            placeholder="Y坐标"
          />
        </Form.Item>
      </Space.Compact>

      <Divider style={{ margin: '16px 0' }} />

      {/* 内容设置 */}
      {selectedElement.type === 'text' && (
        <>
          <Title level={5} style={{ margin: '0 0 12px 0', fontSize: '14px' }}>文本内容</Title>
          <Form.Item label="文本内容" style={{ marginBottom: '16px' }}>
            <Input.TextArea
              value={selectedElement.content || ''}
              onChange={handleInputChange('content')}
              placeholder="请输入文本内容"
              rows={3}
            />
          </Form.Item>
          
          <Form.Item label="字体大小" style={{ marginBottom: '16px' }}>
            <InputNumber
              value={selectedElement.style?.fontSize || 16}
              onChange={(value) => {
                if (value !== null) {
                  updateElement(selectedElementId, { 
                    style: { 
                      ...selectedElement.style, 
                      fontSize: value 
                    } 
                  });
                }
              }}
              min={8}
              max={200}
              style={{ width: '100%' }}
              placeholder="字体大小"
            />
          </Form.Item>

          <Form.Item label="文字颜色" style={{ marginBottom: '16px' }}>
            <ColorPicker
              value={selectedElement.style?.color || '#000000'}
              onChange={handleColorChange('color')}
              showText
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item label="背景颜色" style={{ marginBottom: '16px' }}>
            <ColorPicker
              value={selectedElement.style?.backgroundColor || 'transparent'}
              onChange={handleColorChange('backgroundColor')}
              showText
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Space.Compact style={{ width: '100%', marginBottom: '12px' }}>
            <Form.Item label="加粗" style={{ flex: 1, marginBottom: 0, marginRight: '8px' }}>
              <Select
                value={selectedElement.style?.fontWeight ?? 400}
                onChange={(value) => {
                  updateElement(selectedElementId, {
                    style: {
                      ...selectedElement.style,
                      fontWeight: value,
                    },
                  });
                }}
                options={[
                  { label: '常规', value: 400 },
                  { label: '中等', value: 500 },
                  { label: '加粗', value: 700 },
                ]}
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item label="斜体" style={{ flex: 1, marginBottom: 0 }}>
              <Select
                value={selectedElement.style?.fontStyle || 'normal'}
                onChange={(value) => {
                  updateElement(selectedElementId, {
                    style: {
                      ...selectedElement.style,
                      fontStyle: value,
                    },
                  });
                }}
                options={[
                  { label: '正常', value: 'normal' },
                  { label: '斜体', value: 'italic' },
                ]}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Space.Compact>

          <Space.Compact style={{ width: '100%', marginBottom: '12px' }}>
            <Form.Item label="下划线" style={{ flex: 1, marginBottom: 0, marginRight: '8px' }}>
              <Select
                value={selectedElement.style?.textDecoration || 'none'}
                onChange={(value) => {
                  updateElement(selectedElementId, {
                    style: {
                      ...selectedElement.style,
                      textDecoration: value,
                    },
                  });
                }}
                options={[
                  { label: '无', value: 'none' },
                  { label: '下划线', value: 'underline' },
                ]}
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item label="对齐" style={{ flex: 1, marginBottom: 0 }}>
              <Select
                value={selectedElement.style?.textAlign || 'left'}
                onChange={(value) => {
                  updateElement(selectedElementId, {
                    style: {
                      ...selectedElement.style,
                      textAlign: value,
                    },
                  });
                }}
                options={[
                  { label: '左对齐', value: 'left' },
                  { label: '居中', value: 'center' },
                  { label: '右对齐', value: 'right' },
                ]}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Space.Compact>
        </>
      )}

      {selectedElement.type === 'shape' && (
        <>
          <Title level={5} style={{ margin: '0 0 12px 0', fontSize: '14px' }}>图形样式</Title>
          <Form.Item label="填充颜色" style={{ marginBottom: '12px' }}>
            <ColorPicker
              value={selectedElement.style?.fill || '#4096ff'}
              onChange={handleColorChange('fill')}
              showText
              style={{ width: '100%' }}
            />
          </Form.Item>
          
          <Form.Item label="边框颜色" style={{ marginBottom: '12px' }}>
            <ColorPicker
              value={selectedElement.style?.stroke || '#1677ff'}
              onChange={handleColorChange('stroke')}
              showText
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item label="边框宽度" style={{ marginBottom: '16px' }}>
            <InputNumber
              value={selectedElement.style?.strokeWidth || 2}
              onChange={(value) => {
                if (value !== null) {
                  updateElement(selectedElementId, { 
                    style: { 
                      ...selectedElement.style, 
                      strokeWidth: value 
                    } 
                  });
                }
              }}
              min={0}
              max={20}
              style={{ width: '100%' }}
              placeholder="边框宽度"
            />
          </Form.Item>
        </>
      )}

      {selectedElement.type === 'line' && (
        <>
          <Title level={5} style={{ margin: '0 0 12px 0', fontSize: '14px' }}>线条样式</Title>
          <Form.Item label="线条颜色" style={{ marginBottom: '12px' }}>
            <ColorPicker
              value={selectedElement.style?.stroke || '#000000'}
              onChange={handleColorChange('stroke')}
              showText
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item label="线条粗细" style={{ marginBottom: '12px' }}>
            <InputNumber
              value={selectedElement.style?.strokeWidth || 2}
              onChange={(value) => {
                if (value !== null) {
                  updateElement(selectedElementId, { 
                    style: { 
                      ...selectedElement.style, 
                      strokeWidth: value 
                    } 
                  });
                }
              }}
              min={1}
              max={20}
              style={{ width: '100%' }}
              placeholder="线条粗细"
            />
          </Form.Item>

          <Form.Item label="线条样式" style={{ marginBottom: '12px' }}>
            <Select
              value={selectedElement.style?.strokeDasharray || ''}
              onChange={(value) => {
                updateElement(selectedElementId, { 
                  style: { 
                    ...selectedElement.style, 
                    strokeDasharray: value 
                  } 
                });
              }}
              style={{ width: '100%' }}
              options={[
                { label: '实线', value: '' },
                { label: '虚线', value: '5,5' },
                { label: '点线', value: '2,2' },
                { label: '点划线', value: '10,5,2,5' },
              ]}
            />
          </Form.Item>

          <Form.Item label="端点样式" style={{ marginBottom: '16px' }}>
            <Select
              value={selectedElement.style?.strokeLinecap || 'round'}
              onChange={(value) => {
                updateElement(selectedElementId, { 
                  style: { 
                    ...selectedElement.style, 
                    strokeLinecap: value 
                  } 
                });
              }}
              style={{ width: '100%' }}
              options={[
                { label: '圆形', value: 'round' },
                { label: '方形', value: 'square' },
                { label: '平直', value: 'butt' },
              ]}
            />
          </Form.Item>
        </>
      )}
    </Form>
  );
};

export default PropertyPanel;