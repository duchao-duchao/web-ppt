import React, { useState, useCallback, useEffect } from 'react';
import { usePresentationStore } from '@/stores/presentationStore';
import { PPTElement } from '@/types/presentation';

interface ElementRendererProps {
  element: PPTElement;
  isSelected: boolean;
  onSelect: (elementId: string, e: React.MouseEvent) => void;
}

const ElementRenderer: React.FC<ElementRendererProps> = ({ 
  element, 
  isSelected, 
  onSelect 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ 
    x: 0, y: 0, width: 0, height: 0, left: 0, top: 0 
  });
  const [resizeDirection, setResizeDirection] = useState('');

  const { updateElement } = usePresentationStore();

  // 处理拖拽开始
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (element.type === 'text' && isSelected) {
      if (e.target !== e.currentTarget) {
        e.stopPropagation();
        return;
      }
    }

    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    
    onSelect(element.id, e);
  }, [element.id, element.type, isSelected, onSelect]);

  // 处理缩放开始
  const handleResizeMouseDown = useCallback((e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    setResizeDirection(direction);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: element.width,
      height: element.height,
      left: element.x || element.left || 0,
      top: element.y || element.top || 0,
    });
  }, [element]);

  // 处理拖拽和缩放
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      updateElement(element.id, {
        left: (element.x || element.left || 0) + deltaX,
        top: (element.y || element.top || 0) + deltaY,
      });
      setDragStart({ x: e.clientX, y: e.clientY });
    } else if (isResizing) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;
      let newLeft = resizeStart.left;
      let newTop = resizeStart.top;

      switch (resizeDirection) {
        case 'top-left':
          newWidth = Math.max(20, resizeStart.width - deltaX);
          newHeight = Math.max(20, resizeStart.height - deltaY);
          newLeft = resizeStart.left + (resizeStart.width - newWidth);
          newTop = resizeStart.top + (resizeStart.height - newHeight);
          break;
        case 'top-right':
          newWidth = Math.max(20, resizeStart.width + deltaX);
          newHeight = Math.max(20, resizeStart.height - deltaY);
          newTop = resizeStart.top + (resizeStart.height - newHeight);
          break;
        case 'bottom-left':
          newWidth = Math.max(20, resizeStart.width - deltaX);
          newHeight = Math.max(20, resizeStart.height + deltaY);
          newLeft = resizeStart.left + (resizeStart.width - newWidth);
          break;
        case 'bottom-right':
          newWidth = Math.max(20, resizeStart.width + deltaX);
          newHeight = Math.max(20, resizeStart.height + deltaY);
          break;
        case 'top-center':
          newHeight = Math.max(20, resizeStart.height - deltaY);
          newTop = resizeStart.top + (resizeStart.height - newHeight);
          break;
        case 'bottom-center':
          newHeight = Math.max(20, resizeStart.height + deltaY);
          break;
        case 'left-center':
          newWidth = Math.max(20, resizeStart.width - deltaX);
          newLeft = resizeStart.left + (resizeStart.width - newWidth);
          break;
        case 'right-center':
          newWidth = Math.max(20, resizeStart.width + deltaX);
          break;
      }
      
      updateElement(element.id, {
        width: newWidth,
        height: newHeight,
        left: newLeft,
        top: newTop,
      });
    }
  }, [isDragging, isResizing, dragStart, resizeStart, resizeDirection, element.id, element.x, element.left, element.y, element.top, updateElement]);

  // 处理拖拽和缩放结束
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeDirection('');
  }, []);

  // 添加全局事件监听
  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  // 渲染元素内容
  const renderElementContent = () => {
    const baseStyle: React.CSSProperties = {
      width: '100%',
      height: '100%',
      border: 'none',
      outline: 'none',
      background: 'transparent',
    };

    switch (element.type) {
      case 'rect':
        return (
          <div
            style={{
              ...baseStyle,
              backgroundColor: element.style?.backgroundColor || '#ff0000',
            }}
          />
        );
        
      case 'text':
        return (
          <div
            style={{
              ...baseStyle,
              color: element.style?.color || '#000000',
              fontSize: element.style?.fontSize || 16,
              fontWeight: element.style?.fontWeight || 'normal',
              fontStyle: element.style?.fontStyle || 'normal',
              textAlign: element.style?.textAlign || 'left',
              display: 'flex',
              alignItems: 'center',
              justifyContent: element.style?.textAlign === 'center' ? 'center' : 
                             element.style?.textAlign === 'right' ? 'flex-end' : 'flex-start',
              padding: '4px',
              wordBreak: 'break-word',
              cursor: isSelected ? 'text' : 'grab',
            }}
            contentEditable={isSelected}
            suppressContentEditableWarning={true}
            onBlur={(e) => {
              updateElement(element.id, { content: e.target.textContent || '' });
            }}
          >
            {element.content || 'Text'}
          </div>
        );
        
      case 'image':
        return (
          <img
            src={element.content || ''}
            alt=""
            style={{
              ...baseStyle,
              objectFit: 'cover',
            }}
            draggable={false}
          />
        );
        
      default:
        return null;
    }
  };

  // 渲染选择框和控制点
  const renderSelectionBox = () => {
    if (!isSelected) return null;

    return (
      <>
        {/* 选择框 */}
        <div
          style={{
            position: 'absolute',
            top: -2,
            left: -2,
            right: -2,
            bottom: -2,
            border: '2px solid #1890ff',
            borderRadius: '2px',
            pointerEvents: 'none',
          }}
        />
        
        {/* 控制点 */}
        {[
          { position: 'top-left', cursor: 'nw-resize' },
          { position: 'top-right', cursor: 'ne-resize' },
          { position: 'bottom-left', cursor: 'sw-resize' },
          { position: 'bottom-right', cursor: 'se-resize' },
          { position: 'top-center', cursor: 'n-resize' },
          { position: 'bottom-center', cursor: 's-resize' },
          { position: 'left-center', cursor: 'w-resize' },
          { position: 'right-center', cursor: 'e-resize' },
        ].map(({ position, cursor }) => (
          <div
            key={position}
            style={{
              position: 'absolute',
              width: 8,
              height: 8,
              backgroundColor: '#1890ff',
              border: '1px solid #ffffff',
              borderRadius: '1px',
              cursor,
              ...getControlPointPosition(position),
            }}
            onMouseDown={(e) => handleResizeMouseDown(e, position)}
          />
        ))}
      </>
    );
  };

  // 获取控制点位置
  const getControlPointPosition = (position: string): React.CSSProperties => {
    switch (position) {
      case 'top-left': return { top: -4, left: -4 };
      case 'top-right': return { top: -4, right: -4 };
      case 'bottom-left': return { bottom: -4, left: -4 };
      case 'bottom-right': return { bottom: -4, right: -4 };
      case 'top-center': return { top: -4, left: '50%', transform: 'translateX(-50%)' };
      case 'bottom-center': return { bottom: -4, left: '50%', transform: 'translateX(-50%)' };
      case 'left-center': return { left: -4, top: '50%', transform: 'translateY(-50%)' };
      case 'right-center': return { right: -4, top: '50%', transform: 'translateY(-50%)' };
      default: return {};
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: element.x || element.left,
        top: element.y || element.top,
        width: element.width,
        height: element.height,
        transform: element.rotation ? `rotate(${element.rotation}deg)` : 'none',
        cursor: isDragging ? 'grabbing' : isResizing ? 'resizing' : (element.type === 'text' && isSelected ? 'text' : 'grab'),
        userSelect: element.type === 'text' && isSelected ? 'text' : 'none',
        zIndex: isSelected ? 1000 : 1,
      }}
      onMouseDown={handleMouseDown}
    >
      {renderElementContent()}
      {renderSelectionBox()}
    </div>
  );
};

export default ElementRenderer;