import React, { useState, useCallback, useEffect, useRef } from 'react';
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
  const [isRotating, setIsRotating] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const [rotateStart, setRotateStart] = useState<{ startAngle: number; initialRotation: number }>({ startAngle: 0, initialRotation: 0 });

  const { updateElement, pause, resume } = usePresentationStore();

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
    
    pause();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    
    onSelect(element.id, e);
  }, [element.id, element.type, isSelected, onSelect, pause]);

  // 处理缩放开始
  const handleResizeMouseDown = useCallback((e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    pause();
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
  }, [element, pause]);

  // 处理旋转开始
  const handleRotateMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = elementRef.current?.getBoundingClientRect();
    if (!rect) return;

    pause();
    setIsRotating(true);

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;
    setRotateStart({ startAngle, initialRotation: element.rotation || 0 });
  }, [pause, element.rotation]);

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
    } else if (isRotating) {
      const rect = elementRef.current?.getBoundingClientRect();
      if (!rect) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;
      let newRotation = rotateStart.initialRotation + (currentAngle - rotateStart.startAngle);

      // Shift 键进行 15° 吸附
      if ((e as any).shiftKey) {
        newRotation = Math.round(newRotation / 15) * 15;
      }

      updateElement(element.id, { rotation: newRotation });
    }
  }, [isDragging, isResizing, isRotating, dragStart, resizeStart, rotateStart, resizeDirection, element.id, element.x, element.left, element.y, element.top, updateElement]);

  // 处理拖拽和缩放结束
  const handleMouseUp = useCallback(() => {
    if (isDragging || isResizing || isRotating) {
      resume();
    }
    setIsDragging(false);
    setIsResizing(false);
    setIsRotating(false);
    setResizeDirection('');
  }, [isDragging, isResizing, isRotating, resume]);

  // 添加全局事件监听
  useEffect(() => {
    if (isDragging || isResizing || isRotating) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, isRotating, handleMouseMove, handleMouseUp]);

  // 渲染线条
  const renderLine = () => {
    const stroke = element.style?.stroke || '#000000';
    const strokeWidth = element.style?.strokeWidth || 2;
    const strokeDasharray = element.style?.strokeDasharray || '';
    const strokeLinecap = element.style?.strokeLinecap || 'round';

    return (
      <svg 
        style={{ width: '100%', height: '100%' }} 
        viewBox={`0 0 ${element.width} ${element.height}`} 
        preserveAspectRatio="none"
      >
        <line
          x1="0"
          y1={element.height / 2}
          x2={element.width}
          y2={element.height / 2}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeLinecap={strokeLinecap}
        />
      </svg>
    );
  };

  // 渲染SVG图形
  const renderShape = () => {
    const shapeType = element.content || 'circle';
    const fill = element.style?.fill || '#4096ff';
    const stroke = element.style?.stroke || '#1677ff';
    const strokeWidth = element.style?.strokeWidth || 2;

    const baseStyle: React.CSSProperties = {
      width: '100%',
      height: '100%',
    };

    switch (shapeType) {
      case 'circle':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <circle cx="50" cy="50" r="40" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'triangle':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="50,10 90,80 10,80" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'diamond':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="50,10 90,50 50,90 10,50" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'star':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'arrow-right':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="10,20 10,80 70,80 70,90 90,50 70,10 70,20" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'hexagon':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="25,15 75,15 90,50 75,85 25,85 10,50" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'heart':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M50,85 C50,85 20,60 20,40 C20,25 30,15 45,15 C47,15 50,20 50,20 C50,20 53,15 55,15 C70,15 80,25 80,40 C80,60 50,85 50,85 Z" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'pentagon':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="50,10 90,35 75,85 25,85 10,35" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      // 基础几何图形
      case 'rectangle':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <rect x="15" y="30" width="70" height="40" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'square':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <rect x="25" y="25" width="50" height="50" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'ellipse':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <ellipse cx="50" cy="50" rx="40" ry="25" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'rounded-rectangle':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <rect x="15" y="30" width="70" height="40" rx="8" ry="8" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      // 箭头图形
      case 'arrow-left':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="90,20 90,80 30,80 30,90 10,50 30,10 30,20" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'arrow-up':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="20,90 80,90 80,30 90,30 50,10 10,30 20,30" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'arrow-down':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="20,10 80,10 80,70 90,70 50,90 10,70 20,70" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'double-arrow':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="10,50 25,35 25,42 75,42 75,35 90,50 75,65 75,58 25,58 25,65" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      // 特殊图形
      case 'cloud':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M75,60 C85,60 90,54 90,46 C90,38 85,32 75,32 C73,24 65,18 55,18 C45,18 37,24 35,32 C27,32 20,38 20,46 C20,54 27,60 35,60 L75,60 Z" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'speech-bubble':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M15,15 L85,15 C90,15 95,20 95,25 L95,55 C95,60 90,65 85,65 L40,65 L25,80 L35,65 L20,65 C15,65 10,60 10,55 L10,25 C10,20 15,15 20,15 Z" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'thought-bubble':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <ellipse cx="55" cy="35" rx="32" ry="25" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
            <circle cx="35" cy="65" r="8" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
            <circle cx="25" cy="75" r="4" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'cross':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="40,10 60,10 60,40 90,40 90,60 60,60 60,90 40,90 40,60 10,60 10,40 40,40" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'plus':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M45,15 L55,15 L55,45 L85,45 L85,55 L55,55 L55,85 L45,85 L45,55 L15,55 L15,45 L45,45 Z" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'minus':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <rect x="15" y="45" width="70" height="10" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'octagon':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="35,15 65,15 85,35 85,65 65,85 35,85 15,65 15,35" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'trapezoid':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="30,25 70,25 85,75 15,75" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'parallelogram':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="25,65 15,35 75,35 85,65" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'lightning':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="55,10 35,45 50,45 45,90 65,55 50,55" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'gear':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M50,30 C60,30 70,40 70,50 C70,60 60,70 50,70 C40,70 30,60 30,50 C30,40 40,30 50,30 Z M45,10 L55,10 L57,20 L65,22 L70,15 L77,22 L70,29 L72,37 L82,39 L82,49 L72,51 L70,59 L77,66 L70,73 L65,66 L57,68 L55,78 L45,78 L43,68 L35,66 L30,73 L23,66 L30,59 L28,51 L18,49 L18,39 L28,37 L30,29 L23,22 L30,15 L35,22 L43,20 Z" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      // 更多箭头图形
      case 'curved-arrow':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M20,70 Q50,20 80,50 L70,60 L90,70 L70,80 L80,70 Q50,40 30,70" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'circular-arrow':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M50,15 A35,35 0 1,1 15,50 L25,40 L15,30 L5,40 L15,50 A35,35 0 1,0 50,15" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'u-turn-arrow':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M30,80 L30,40 Q30,20 50,20 Q70,20 70,40 L70,60 L60,50 L80,60 L60,70 L70,60 L70,40 Q70,30 50,30 Q30,30 30,40 L30,80" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'arrow-up-right':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="40,80 30,70 60,40 40,40 40,20 80,20 80,60 60,60 60,40 30,70" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'arrow-down-left':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="60,20 70,30 40,60 60,60 60,80 20,80 20,40 40,40 40,60 70,30" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      // 常用符号图形
      case 'checkmark':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M15,50 L35,70 L85,20 L75,10 L35,50 L25,40 Z" fill="#52c41a" stroke="#389e0d" strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'x-mark':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M25,25 L75,75 M75,25 L25,75" fill="none" stroke="#ff4d4f" strokeWidth={strokeWidth * 2} strokeLinecap="round"/>
          </svg>
        );
      case 'warning':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="50,10 90,80 10,80" fill="#faad14" stroke="#d48806" strokeWidth={strokeWidth}/>
            <rect x="45" y="35" width="10" height="25" fill="white"/>
            <circle cx="50" cy="70" r="4" fill="white"/>
          </svg>
        );
      case 'info':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <circle cx="50" cy="50" r="40" fill="#1890ff" stroke="#096dd9" strokeWidth={strokeWidth}/>
            <circle cx="50" cy="35" r="4" fill="white"/>
            <rect x="45" y="50" width="10" height="25" fill="white"/>
          </svg>
        );
      case 'question':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <circle cx="50" cy="50" r="40" fill="#722ed1" stroke="#531dab" strokeWidth={strokeWidth}/>
            <path d="M40,40 Q40,30 50,30 Q60,30 60,40 Q60,45 50,50 L50,55" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round"/>
            <circle cx="50" cy="65" r="3" fill="white"/>
          </svg>
        );
      // 流程图专用图形
      case 'process-rectangle':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <rect x="10" y="30" width="80" height="40" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'decision-diamond':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="50,15 85,50 50,85 15,50" fill="#faad14" stroke="#d48806" strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'start-end-oval':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <ellipse cx="50" cy="50" rx="40" ry="25" fill="#52c41a" stroke="#389e0d" strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'document':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M20,15 L70,15 L80,25 L80,85 L20,85 Z M70,15 L70,25 L80,25" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'database':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <ellipse cx="50" cy="25" rx="35" ry="12" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
            <path d="M15,25 L15,75 Q15,87 50,87 Q85,87 85,75 L85,25" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
            <ellipse cx="50" cy="50" rx="35" ry="6" fill="none" stroke={stroke} strokeWidth={strokeWidth}/>
            <ellipse cx="50" cy="65" rx="35" ry="6" fill="none" stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      // 装饰性图形
      case 'flower':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <circle cx="50" cy="30" r="12" fill="#ff85c0" stroke="#f759ab" strokeWidth={strokeWidth}/>
            <circle cx="70" cy="50" r="12" fill="#ff85c0" stroke="#f759ab" strokeWidth={strokeWidth}/>
            <circle cx="50" cy="70" r="12" fill="#ff85c0" stroke="#f759ab" strokeWidth={strokeWidth}/>
            <circle cx="30" cy="50" r="12" fill="#ff85c0" stroke="#f759ab" strokeWidth={strokeWidth}/>
            <circle cx="50" cy="50" r="8" fill="#faad14" stroke="#d48806" strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'leaf':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M50,80 Q30,60 30,40 Q30,20 50,20 Q70,20 70,40 Q70,60 50,80 Z M50,80 Q50,50 70,40" fill="#52c41a" stroke="#389e0d" strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'sun':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <circle cx="50" cy="50" r="16" fill="#faad14" stroke="#d48806" strokeWidth={strokeWidth}/>
            <g stroke="#faad14" strokeWidth="4" strokeLinecap="round">
              <line x1="50" y1="10" x2="50" y2="20"/>
              <line x1="50" y1="80" x2="50" y2="90"/>
              <line x1="10" y1="50" x2="20" y2="50"/>
              <line x1="80" y1="50" x2="90" y2="50"/>
              <line x1="23" y1="23" x2="30" y2="30"/>
              <line x1="70" y1="70" x2="77" y2="77"/>
              <line x1="23" y1="77" x2="30" y2="70"/>
              <line x1="70" y1="30" x2="77" y2="23"/>
            </g>
          </svg>
        );
      case 'moon':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M60,15 A36,36 0 1,0 60,85 A30,30 0 1,1 60,15 Z" fill="#722ed1" stroke="#531dab" strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'house':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="50,15 15,45 15,85 85,85 85,45" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
            <rect x="40" y="60" width="20" height="25" fill="#faad14" stroke="#d48806" strokeWidth={strokeWidth}/>
            <rect x="60" y="40" width="12" height="12" fill="#faad14" stroke="#d48806" strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'tree':
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <rect x="45" y="70" width="10" height="20" fill="#8b4513" stroke="#654321" strokeWidth={strokeWidth}/>
            <circle cx="50" cy="40" r="24" fill="#52c41a" stroke="#389e0d" strokeWidth={strokeWidth}/>
            <circle cx="35" cy="50" r="16" fill="#52c41a" stroke="#389e0d" strokeWidth={strokeWidth}/>
            <circle cx="65" cy="50" r="16" fill="#52c41a" stroke="#389e0d" strokeWidth={strokeWidth}/>
          </svg>
        );
      default:
        return (
          <svg style={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <circle cx="50" cy="50" r="40" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
    }
  };

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
      case 'text':
        return (
          <div
            style={{
              ...baseStyle,
              color: element.style?.color || '#000000',
              fontSize: element.style?.fontSize || 16,
              fontWeight: element.style?.fontWeight || 'normal',
              fontStyle: element.style?.fontStyle || 'normal',
              textDecoration: element.style?.textDecoration || 'none',
              textAlign: element.style?.textAlign || 'left',
              backgroundColor: element.style?.backgroundColor || 'transparent',
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

      case 'shape':
        return renderShape();

      case 'line':
        return renderLine();
        
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

        {/* 旋转连线（仅装饰，不可交互） */}
        <div
          style={{
            position: 'absolute',
            top: -20,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 1,
            height: 16,
            backgroundColor: '#1890ff',
            pointerEvents: 'none',
          }}
        />

        {/* 旋转控制点 */}
        <div
          style={{
            position: 'absolute',
            top: -30,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 14,
            height: 14,
            backgroundColor: '#1890ff',
            border: '1px solid #ffffff',
            borderRadius: '50%',
            cursor: 'grab',
          }}
          onMouseDown={handleRotateMouseDown}
        />
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
      ref={elementRef}
      style={{
        position: 'absolute',
        left: element.x || element.left,
        top: element.y || element.top,
        width: element.width,
        height: element.height,
        transform: element.rotation ? `rotate(${element.rotation}deg)` : 'none',
        cursor: isDragging ? 'grabbing' : isResizing ? 'resizing' : isRotating ? 'grabbing' : (element.type === 'text' && isSelected ? 'text' : 'grab'),
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