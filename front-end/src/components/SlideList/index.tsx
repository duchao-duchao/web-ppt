import React from 'react';
import { usePresentationStore } from '@/stores/presentationStore';
import { Button } from 'antd';
import { Slide, PPTElement } from '@/types/presentation';
import styles from './index.less';

// 缩略图组件
const SlideThumbnail: React.FC<{ slide: Slide; scale: number; slideIndex: number }> = ({ slide, scale, slideIndex }) => {
  // 渲染元素缩略图
  const renderElementThumbnail = (element: PPTElement) => {
    const elementStyle: React.CSSProperties = {
      position: 'absolute',
      left: (element.x || element.left || 0) * scale,
      top: (element.y || element.top || 0) * scale,
      width: element.width * scale,
      height: element.height * scale,
      transform: element.rotation ? `rotate(${element.rotation}deg)` : 'none',
    };

    switch (element.type) {      
      case 'text':
        return (
          <div
            key={element.id}
            style={{
              ...elementStyle,
              color: element.style?.color || '#000000',
              fontSize: (element.style?.fontSize || 16) * scale,
              fontWeight: element.style?.fontWeight || 'normal',
              fontStyle: element.style?.fontStyle || 'normal',
              textAlign: element.style?.textAlign || 'left',
              display: 'flex',
              alignItems: 'center',
              justifyContent: element.style?.textAlign === 'center' ? 'center' : 
                             element.style?.textAlign === 'right' ? 'flex-end' : 'flex-start',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {element.content || 'Text'}
          </div>
        );
      
      case 'image':
        return (
          <img
            key={element.id}
            src={element.content || ''}
            alt=""
            style={{
              ...elementStyle,
              objectFit: 'cover',
            }}
          />
        );
      
      case 'shape':
        const shapeType = element.content || 'circle';
        const fill = element.style?.fill || '#4096ff';
        const stroke = element.style?.stroke || '#1677ff';
        const strokeWidth = (element.style?.strokeWidth || 2) * scale;

        return (
          <div key={element.id} style={elementStyle}>
            {renderShapeThumbnail(shapeType, fill, stroke, strokeWidth)}
          </div>
        );

      case 'line':
        const lineStroke = element.style?.stroke || '#000000';
        const lineStrokeWidth = (element.style?.strokeWidth || 2) * scale;
        const strokeDasharray = element.style?.strokeDasharray || '';
        const strokeLinecap = element.style?.strokeLinecap || 'round';

        return (
          <div key={element.id} style={elementStyle}>
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
                stroke={lineStroke}
                strokeWidth={lineStrokeWidth}
                strokeDasharray={strokeDasharray}
                strokeLinecap={strokeLinecap}
              />
            </svg>
          </div>
        );
      
      default:
        return null;
    }
  };

  // 渲染图形缩略图
  const renderShapeThumbnail = (shapeType: string, fill: string, stroke: string, strokeWidth: number) => {
    const svgStyle: React.CSSProperties = {
      width: '100%',
      height: '100%',
    };

    switch (shapeType) {
      case 'circle':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <circle cx="50" cy="50" r="40" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'triangle':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="50,10 90,80 10,80" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'diamond':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="50,10 90,50 50,90 10,50" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'star':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="25,2 30,18 47,18 34,28 39,44 25,35 11,44 16,28 3,18 20,18" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'arrow-right':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="5,15 5,35 35,35 35,45 45,25 35,5 35,15" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'hexagon':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="15,8 35,8 45,25 35,42 15,42 5,25" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'heart':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M25,42 C25,42 10,30 10,20 C10,12 15,8 22,8 C23,8 25,10 25,10 C25,10 27,8 28,8 C35,8 40,12 40,20 C40,30 25,42 25,42 Z" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'pentagon':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="25,5 45,18 38,42 12,42 5,18" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      default:
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <circle cx="50" cy="50" r="40" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
    }
  };

  return (
    <div className={styles.thumbnail}>
      {/* 背景 */}
      <div 
        className={styles.thumbnailBackground}
        style={{
          backgroundColor: slide.background?.color || '#ffffff',
          backgroundImage: slide.background?.image ? `url(${slide.background.image})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* 元素 */}
      <div className={styles.thumbnailElements}>
        {slide.elements.map(renderElementThumbnail)}
      </div>
      
      {/* 页码 */}
      <div className={styles.thumbnailIndex}>
        {slideIndex + 1}
      </div>
    </div>
  );
};

const SlideList = () => {
  const { slides, currentSlideIndex, addSlide, deleteSlide, setCurrentSlideIndex } = usePresentationStore();
  
  // 缩略图容器的实际尺寸（slideItem: 120x72, padding: 5px）
  const thumbnailWidth = 120 - 10; // 120px - 5px左右padding
  const thumbnailHeight = 72 - 10; // 72px - 5px上下padding
  
  // 画布的实际显示尺寸（需要与Canvas组件的实际尺寸匹配）
  // 由于Canvas使用了复杂的响应式计算，我们使用一个更合理的基准尺寸
  const canvasBaseWidth = 800; // 更接近实际显示的宽度
  const canvasBaseHeight = 480; // 保持5:3比例 (800 * 3/5 = 480)
  
  // 计算缩放比例
  const scaleX = thumbnailWidth / canvasBaseWidth;
  const scaleY = thumbnailHeight / canvasBaseHeight;
  const scale = Math.min(scaleX, scaleY);

  return (
    <div className={styles.slideList}>
      <div className={styles.actions}>
        <Button onClick={addSlide} block style={{borderRadius: 5}}>添加幻灯片</Button>
      </div>
      <div className={styles.list}>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`${styles.slideItem} ${index === currentSlideIndex ? styles.active : ''}`}
            onClick={() => setCurrentSlideIndex(index)}
          >
            <SlideThumbnail slide={slide} scale={scale} slideIndex={index} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlideList;