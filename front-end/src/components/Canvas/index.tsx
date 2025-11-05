import React, { useRef, useState, useCallback, useEffect } from 'react';
import { usePresentationStore } from '@/stores/presentationStore';
import ContextMenu from '@/components/ContextMenu';
import ElementRenderer from '@/components/ElementRenderer';

interface CanvasProps {
  slideIndex?: number;
  interactive?: boolean;
  width?: number;
  height?: number;
  scale?: number;
  embedded?: boolean;
  showBorder?: boolean;
}

const Canvas: React.FC<CanvasProps> = ({
  slideIndex,
  interactive = true,
  width,
  height,
  scale,
  embedded = false,
  showBorder = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });

  const { slides, currentSlideIndex, selectedElementIds, setSelectedElementIds, updateElement, deleteElement, copyElements, pasteElements, bringForward, sendBackward, pause, resume } = usePresentationStore();
  const renderSlideIndex = typeof slideIndex === 'number' ? slideIndex : currentSlideIndex;
  const currentSlide = slides[renderSlideIndex];

  // 处理画布点击
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
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
      if (selectedElementIds.includes(elementId)) {
        setSelectedElementIds(selectedElementIds.filter(id => id !== elementId));
      } else {
        setSelectedElementIds([...selectedElementIds, elementId]);
      }
    } else {
      setSelectedElementIds([elementId]);
    }
  }, [selectedElementIds, setSelectedElementIds]);

  const handleContextMenuClose = useCallback(() => {
    setContextMenu({ ...contextMenu, visible: false });
  }, [contextMenu]);

  const handleContextMenuSelect = useCallback((key: string) => {
    if (key === 'copy') {
      copyElements();
    } else if (key === 'paste') {
      pasteElements();
    } else if (key === 'delete') {
      selectedElementIds.forEach(id => deleteElement(id));
    } else if (key === 'bringForward') {
      bringForward();
    } else if (key === 'sendBackward') {
      sendBackward();
    }
    handleContextMenuClose();
  }, [handleContextMenuClose, copyElements, pasteElements, deleteElement, bringForward, sendBackward, selectedElementIds]);

  // 键盘快捷键处理（仅交互模式）
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // 如果当前焦点在可编辑区域或输入控件中，则不触发画布的快捷键
    const activeEl = document.activeElement as HTMLElement | null;
    const tag = activeEl?.tagName;
    const isEditableTarget = !!(
      activeEl && (
        activeEl.isContentEditable ||
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        activeEl.getAttribute('role') === 'textbox' ||
        activeEl.closest('.ant-input') ||
        activeEl.closest('.ant-select') ||
        activeEl.closest('.ant-color-picker')
      )
    );

    if (isEditableTarget) {
      return;
    }

    // 删除
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (selectedElementIds.length) {
        selectedElementIds.forEach(id => deleteElement(id));
      }
    }

    const isCtrlOrCmd = e.ctrlKey || (e as any).metaKey;
    // 复制
    if (isCtrlOrCmd && e.key.toLowerCase() === 'c') {
      if (selectedElementIds.length) {
        copyElements();
      }
    }
    // 粘贴
    if (isCtrlOrCmd && e.key.toLowerCase() === 'v') {
      pasteElements();
    }
    
    // 撤销 / 重做
    if (isCtrlOrCmd && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      if (e.shiftKey) {
        // Ctrl/Cmd + Shift + Z => 重做
        try { (usePresentationStore as any).temporal.getState().redo(); } catch {}
      } else {
        // Ctrl/Cmd + Z => 撤销
        try { (usePresentationStore as any).temporal.getState().undo(); } catch {}
      }
    }
    if (isCtrlOrCmd && e.key.toLowerCase() === 'y') {
      e.preventDefault();
      try { (usePresentationStore as any).temporal.getState().redo(); } catch {}
    }

    // 选中全部元素
    if (isCtrlOrCmd && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      const allIds = (currentSlide?.elements || []).map(el => el.id);
      setSelectedElementIds(allIds);
    }

    // 复制并创建副本（Duplicate）
    if (isCtrlOrCmd && e.key.toLowerCase() === 'd') {
      e.preventDefault();
      if (selectedElementIds.length) {
        copyElements();
        pasteElements();
      }
    }

    // 层级调整：置顶/置底（向前/向后一步）
    if (isCtrlOrCmd && e.key === ']') {
      e.preventDefault();
      bringForward();
    }
    if (isCtrlOrCmd && e.key === '[') {
      e.preventDefault();
      sendBackward();
    }

    // 方向键移动元素（Shift加速10像素）
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      if (selectedElementIds.length) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        const dx = e.key === 'ArrowLeft' ? -step : e.key === 'ArrowRight' ? step : 0;
        const dy = e.key === 'ArrowUp' ? -step : e.key === 'ArrowDown' ? step : 0;
        pause();
        selectedElementIds.forEach(id => {
          const el = currentSlide?.elements.find(e => e.id === id);
          if (!el) return;
          const left = (el.x ?? el.left ?? 0) + dx;
          const top = (el.y ?? el.top ?? 0) + dy;
          updateElement(id, { left, top });
        });
        resume();
      }
    }

    // Esc 清空选择
    if (e.key === 'Escape') {
      setSelectedElementIds([]);
    }
    
  }, [selectedElementIds, deleteElement, copyElements, pasteElements, currentSlide, setSelectedElementIds, bringForward, sendBackward, pause, resume, updateElement]);

  // 绑定/解绑键盘事件（仅交互模式）
  useEffect(() => {
    if (!interactive) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, interactive]);

  // 画布主体（内部板）
  const board = (
    <div 
      ref={containerRef} 
      className="canvas-container"
      style={{ 
        position: 'relative',
        width: width ?? 'min(80vw, calc((100vh - 80px) * 0.8 * 5/3))',
        height: height ?? 'min(80vh - 64px, calc(80vw * 3/5))',
        maxWidth: '1000px',
        maxHeight: '600px',
        aspectRatio: '5/3',
        border: showBorder ? '1px solid #e5e7eb' : 'none',
        backgroundColor: currentSlide?.background?.color || '#ffffff',
        backgroundImage: currentSlide?.background?.image ? `url(${currentSlide.background.image})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden',
        cursor: 'default',
        // 缩略图禁用所有子元素交互
        pointerEvents: interactive ? 'auto' : 'none',
      }}
      onClick={interactive ? handleCanvasClick : undefined}
      onContextMenu={interactive ? handleContextMenu : undefined}
    >
      {/* 渲染所有元素 */}
      {currentSlide?.elements.map(element => (
        <ElementRenderer
          key={element.id}
          element={element}
          isSelected={interactive ? selectedElementIds.includes(element.id) : false}
          onSelect={interactive ? handleElementSelect : () => {}}
        />
      ))}

      {/* 右键菜单（仅交互模式） */}
      {interactive && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          visible={contextMenu.visible}
          onClose={handleContextMenuClose}
          onSelect={handleContextMenuSelect}
        />
      )}
    </div>
  );

  // 嵌入模式：用于侧边缩略图
  if (embedded) {
    if (typeof width === 'number' && typeof height === 'number' && typeof scale === 'number') {
      return (
        <div style={{ position: 'relative', width: width * scale, height: height * scale }}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
            {board}
          </div>
        </div>
      );
    }
    return board;
  }

  // 编辑模式：保持居中容器
  return (
    <div style={{ height: 'calc(100vh - 80px)', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {board}
    </div>
  );
};

export default Canvas;