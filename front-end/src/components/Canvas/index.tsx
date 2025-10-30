import React, { useEffect, useRef, useState } from 'react';
import { App, Leafer, Rect, Text, Image, Line } from 'leafer-ui';
import { Editor } from '@leafer-in/editor';
import { HTMLText } from '@leafer-in/html'
import '@leafer-in/editor';
import { usePresentationStore } from '@/stores/presentationStore';
import ContextMenu from '@/components/ContextMenu';

const Canvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<App>();
  const editorRef = useRef<Editor>();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });
  const [scale, setScale] = useState(1);

  const { slides, currentSlideIndex, selectedElementIds, setSelectedElementIds, updateElement } = usePresentationStore();

  useEffect(() => {
    if (containerRef.current && !appRef.current) {
      // 创建App实例
      const app = new App({
        view: containerRef.current,
        width: 800,
        height: 600,
        fill: '#ffffff', // 背景色
        tree: { type: 'design' }, // 添加 tree 层
        sky: { type: 'draw', usePartRender: false }, // 添加 sky 层
        editor: {}, // 启用编辑器
      });
      
      appRef.current = app;
      editorRef.current = app.editor;

      // 监听右键菜单
      app.on('contextmenu', (e) => {
        e.preventDefault();
        setContextMenu({ x: e.x, y: e.y, visible: true });
      });

      // 添加滚轮缩放支持
      app.on('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = Math.max(0.1, Math.min(3, scale * delta));
        setScale(newScale);
        app.tree.scale = newScale;
      });

      // 监听编辑器选择变化
      app.editor.on('select', (e) => {
        const selectedIds = e.list.map((item: any) => item.id);
        setSelectedElementIds(selectedIds);
      });

      // 监听元素变化
      app.editor.on('change', (e) => {
        if (e.target && e.target.id) {
          const element = e.target;
          updateElement(element.id, {
            left: element.x,
            top: element.y,
            width: element.width,
            height: element.height,
            rotation: element.rotation,
          });
        }
      });
    }

    // 渲染当前幻灯片内容
    const app = appRef.current;
    if (app) {
      // 清空当前内容
      app.tree.clear();
      
      const currentSlide = slides[currentSlideIndex];
      if (currentSlide) {
        // 设置背景
        if (currentSlide.background) {
          app.tree.fill = currentSlide.background.color || '#ffffff';
          if (currentSlide.background.image) {
            const backgroundImage = new Image({
              url: currentSlide.background.image,
              width: 800,
              height: 600,
              x: 0,
              y: 0,
            });
            app.tree.add(backgroundImage);
          }
        }

        console.log(currentSlide, 'currentSlide');
        
        // 渲染元素
        currentSlide.elements.forEach(element => {
          let leaferElement;

          const elementProps = {
            id: element.id,
            x: element.x || element.left,
            y: element.y || element.top,
            width: element.width,
            height: element.height,
            rotation: element.rotation || 0,
            editable: true,
          };

          switch (element.type) {
            case 'rect':
              leaferElement = new Rect({
                ...elementProps,
                fill: element.style?.backgroundColor || element?.backgroundColor || '#ff0000',
              });
              break;
            case 'text':
              leaferElement = new HTMLText({
                ...elementProps,
                // text: element.content || 'Text',
                text: '<i style="color: red; font-weight: bold;">Welcome</i> to <i style="color: #32cd79; font-size: 30px">LeaferJS</i>',
                fontSize: element.style?.fontSize || 16,
                fill: element.style?.color || '#000000',
              });
              break;
            case 'image':
              leaferElement = new Image({
                ...elementProps,
                url: element.content || '',
              });
              break;
          }

          if (leaferElement) {
            // 添加到tree层，这样编辑器可以管理它们
            app.tree.add(leaferElement);
            
            // 如果元素被选中，让编辑器选中它
            if (selectedElementIds.includes(element.id)) {
              setTimeout(() => {
                app.editor.select(leaferElement);
              }, 0);
            }
          }
        });
      }
    }
  }, [slides, currentSlideIndex, selectedElementIds, setSelectedElementIds, updateElement, scale]);

  const handleContextMenuClose = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleContextMenuSelect = (key: string) => {
    handleContextMenuClose();
  };

  return (
    <div ref={containerRef} style={{ border: '1px solid #ccc' }} onContextMenu={(e) => e.preventDefault()}>
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