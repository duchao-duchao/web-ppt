import React, { useEffect, useRef, useState } from 'react';
import { Leafer, Rect, Text, Image } from 'leafer-ui';
import { usePresentationStore } from '@/stores/presentationStore';
import ContextMenu from '@/components/ContextMenu';

const Canvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leaferRef = useRef<Leafer>();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });

  const { slides, currentSlideIndex, selectedElementIds, setSelectedElementIds, updateElement } = usePresentationStore();

  useEffect(() => {
    if (containerRef.current && !leaferRef.current) {
      const leafer = new Leafer({ view: containerRef.current, height: 600, width: 800 });
      leaferRef.current = leafer;

      leafer.on('contextmenu', (e) => {
        e.preventDefault();
        setContextMenu({ x: e.x, y: e.y, visible: true });
      });

      // 点击空白区域取消选择
      leafer.on('click', (e) => {
        if (e.target === leafer) {
          setSelectedElementIds([]);
        }
      });
    }

    const leafer = leaferRef.current;
    if (leafer) {
      leafer.clear();
      const currentSlide = slides[currentSlideIndex];
      if (currentSlide) {
        if (currentSlide.background) {
          leafer.fill = currentSlide.background.color || '#ffffff';
          if (currentSlide.background.image) {
            const image = new Image({
              url: currentSlide.background.image,
              width: 800,
              height: 600,
            });
            leafer.add(image);
          }
        }

        console.log(currentSlide, 'currentSlide');
        

        currentSlide.elements.forEach(element => {
          const isSelected = selectedElementIds.includes(element.id);
          let leaferElement;

          const elementProps = {
            ...element,
            draggable: true,
            editable: isSelected,
          };

          switch (element.type) {
            case 'rect':
              elementProps.fill = elementProps.style?.backgroundColor
              leaferElement = new Rect(elementProps);
              break;
            case 'text':
              leaferElement = new Text({
                ...elementProps,
                text: element.content || '',
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
            // 如果元素被选中，添加选择框
            if (isSelected) {
              leaferElement.stroke = '#1890ff';
              leaferElement.strokeWidth = 2;
              leaferElement.dashPattern = [5, 5];
              
              // 添加控制点
              const controlPoints = [
                // 四个角的控制点
                { x: element.x - 4, y: element.y - 4 },
                { x: element.x + element.width + 4, y: element.y - 4 },
                { x: element.x - 4, y: element.y + element.height + 4 },
                { x: element.x + element.width + 4, y: element.y + element.height + 4 },
                // 四个边的中点控制点
                { x: element.x + element.width / 2, y: element.y - 4 },
                { x: element.x + element.width / 2, y: element.y + element.height + 4 },
                { x: element.x - 4, y: element.y + element.height / 2 },
                { x: element.x + element.width + 4, y: element.y + element.height / 2 },
              ];

              controlPoints.forEach(point => {
                const controlPoint = new Rect({
                  x: point.x,
                  y: point.y,
                  width: 8,
                  height: 8,
                  fill: '#1890ff',
                  stroke: '#ffffff',
                  strokeWidth: 1,
                  cursor: 'pointer',
                });
                leafer.add(controlPoint);
              });
            }

            leaferElement.on('click', (e) => {
              setSelectedElementIds([e.target.id]);
            });

            leaferElement.on('drag.end', (e) => {
              updateElement(e.target.id, { left: e.target.x, top: e.target.y });
            });

            leaferElement.on('scale.end', (e) => {
              updateElement(e.target.id, { 
                left: e.target.x, 
                top: e.target.y, 
                width: e.target.width, 
                height: e.target.height 
              });
            });

            leaferElement.on('rotate.end', (e) => {
              updateElement(e.target.id, { rotation: e.target.rotation });
            });

            leafer.add(leaferElement);
          }
        });
      }
    }
  }, [slides, currentSlideIndex, selectedElementIds, setSelectedElementIds, updateElement]);

  const handleContextMenuClose = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleContextMenuSelect = (key: string) => {
    console.log('Selected:', key);
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