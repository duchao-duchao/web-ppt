import React from 'react';
import { Card, Form, InputNumber, Input, Typography, Divider, Space, ColorPicker } from 'antd';
import { usePresentationStore } from '@/stores/presentationStore';

const { Title, Text } = Typography;

const PropertyPanel = () => {
  const { selectedElementIds, slides, currentSlideIndex, updateElement } = usePresentationStore();

  if (selectedElementIds.length !== 1) {
    return (
      <div style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>
        <Text type="secondary">请选择一个元素</Text>
      </div>
    );
  }

  const selectedElementId = selectedElementIds[0];
  const currentSlide = slides[currentSlideIndex];
  const selectedElement = currentSlide.elements.find(e => e.id === selectedElementId);

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

  const getElementTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      'text': '文本',
      'image': '图片',
      'shape': '图形'
    };
    return typeMap[type] || type;
  };

  return (
    <Card
      style={{ height: '100%' }}
      bodyStyle={{ padding: '16px' }}
    >
      <Form layout="vertical" size="small">
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
      </Form>
    </Card>
  );
};

export default PropertyPanel;