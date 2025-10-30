import React, { useRef, useState, useCallback } from 'react';
import { usePresentationStore } from '@/stores/presentationStore';
import ContextMenu from '@/components/ContextMenu';
import ElementRenderer from '@/components/ElementRenderer';

const Canvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });

  const { slides, currentSlideIndex, selectedElementIds, setSelectedElementIds, updateElement } = usePresentationStore();
  const currentSlide = slides[currentSlideIndex];

  // 处理画布点击
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      // 点击空白区域，取消选择
      setSelectedElementIds([]);
    }
  }, [setSelectedElementIds]);

  // 处理右键菜单
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, visible: true });
  }, []);

  // 处理元素选择
  const handleElementSelect = useCallback((elementId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.ctrlKey || e.metaKey) {
      // 多选
      if (selectedElementIds.includes(elementId)) {
        setSelectedElementIds(selectedElementIds.filter(id => id !== elementId));
      } else {
        setSelectedElementIds([...selectedElementIds, elementId]);
      }
    } else {
      // 单选
      setSelectedElementIds([elementId]);
    }
  }, [selectedElementIds, setSelectedElementIds]);



  const handleContextMenuClose = useCallback(() => {
    setContextMenu({ ...contextMenu, visible: false });
  }, [contextMenu]);

  const handleContextMenuSelect = useCallback((key: string) => {
    handleContextMenuClose();
  }, [handleContextMenuClose]);

  return (
    <div 
      ref={containerRef} 
      className="canvas-container"
      style={{ 
        position: 'relative',
        width: 800,
        height: 600,
        border: '1px solid #ccc',
        backgroundColor: currentSlide?.background?.color || '#ffffff',
        backgroundImage: currentSlide?.background?.image ? `url(${currentSlide.background.image})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden',
        cursor: 'default'
      }}
      onClick={handleCanvasClick}
      onContextMenu={handleContextMenu}
    >
      {/* 渲染所有元素 */}
      {currentSlide?.elements.map(element => (
        <ElementRenderer
          key={element.id}
          element={element}
          isSelected={selectedElementIds.includes(element.id)}
          onSelect={handleElementSelect}
        />
      ))}
      
      <ContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        visible={contextMenu.visible}
        onClose={handleContextMenuClose}
        onSelect={handleContextMenuSelect}
      />
    </div>
  );
};

export default Canvas;