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
      // 基础几何图形
      case 'rectangle':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <rect x="15" y="30" width="70" height="40" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'square':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <rect x="25" y="25" width="50" height="50" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'ellipse':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <ellipse cx="50" cy="50" rx="40" ry="25" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'rounded-rectangle':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <rect x="15" y="30" width="70" height="40" rx="8" ry="8" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      // 箭头图形
      case 'arrow-left':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="90,20 90,80 30,80 30,90 10,50 30,10 30,20" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'arrow-up':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="20,90 80,90 80,30 90,30 50,10 10,30 20,30" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'arrow-down':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="20,10 80,10 80,70 90,70 50,90 10,70 20,70" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'double-arrow':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="10,50 25,35 25,42 75,42 75,35 90,50 75,65 75,58 25,58 25,65" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      // 特殊图形
      case 'cloud':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M75,60 C85,60 90,54 90,46 C90,38 85,32 75,32 C73,24 65,18 55,18 C45,18 37,24 35,32 C27,32 20,38 20,46 C20,54 27,60 35,60 L75,60 Z" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'speech-bubble':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M15,15 L85,15 C90,15 95,20 95,25 L95,55 C95,60 90,65 85,65 L40,65 L25,80 L35,65 L20,65 C15,65 10,60 10,55 L10,25 C10,20 15,15 20,15 Z" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'thought-bubble':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <ellipse cx="55" cy="35" rx="32" ry="25" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
            <circle cx="35" cy="65" r="8" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
            <circle cx="25" cy="75" r="4" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'cross':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="40,10 60,10 60,40 90,40 90,60 60,60 60,90 40,90 40,60 10,60 10,40 40,40" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'plus':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M45,15 L55,15 L55,45 L85,45 L85,55 L55,55 L55,85 L45,85 L45,55 L15,55 L15,45 L45,45 Z" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'minus':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <rect x="15" y="45" width="70" height="10" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'octagon':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="35,15 65,15 85,35 85,65 65,85 35,85 15,65 15,35" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'trapezoid':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="30,25 70,25 85,75 15,75" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'parallelogram':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="25,65 15,35 75,35 85,65" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'lightning':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="55,10 35,45 50,45 45,90 65,55 50,55" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'gear':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M50,30 C60,30 70,40 70,50 C70,60 60,70 50,70 C40,70 30,60 30,50 C30,40 40,30 50,30 Z M45,10 L55,10 L57,20 L65,22 L70,15 L77,22 L70,29 L72,37 L82,39 L82,49 L72,51 L70,59 L77,66 L70,73 L65,66 L57,68 L55,78 L45,78 L43,68 L35,66 L30,73 L23,66 L30,59 L28,51 L18,49 L18,39 L28,37 L30,29 L23,22 L30,15 L35,22 L43,20 Z" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      // 更多箭头图形
      case 'curved-arrow':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M20,70 Q50,20 80,50 L75,45 L85,55 L75,65 L80,60 Q50,30 20,80 Z" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'circular-arrow':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M50,15 A35,35 0 1,1 49,15 L55,10 L60,20 L50,25 Z" fill="none" stroke={stroke} strokeWidth={strokeWidth}/>
            <polygon points="55,10 60,20 50,25" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'u-turn-arrow':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M20,80 L20,40 Q20,20 40,20 Q60,20 60,40 L60,60 L55,55 L65,70 L75,55 L70,60 L70,40 Q70,10 40,10 Q10,10 10,40 L10,80 Z" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'arrow-up-right':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="20,80 30,70 70,30 60,30 80,10 80,30 70,30 30,70 40,60 20,80" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'arrow-down-left':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="80,20 70,30 30,70 40,70 20,90 20,70 30,70 70,30 60,40 80,20" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      // 常用符号图形
      case 'check-mark':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M20,50 L40,70 L80,30" fill="none" stroke={stroke} strokeWidth={strokeWidth * 2}/>
          </svg>
        );
      case 'x-mark':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M25,25 L75,75 M75,25 L25,75" fill="none" stroke={stroke} strokeWidth={strokeWidth * 2}/>
          </svg>
        );
      case 'warning':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="50,10 90,80 10,80" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
            <circle cx="50" cy="65" r="3" fill={stroke}/>
            <rect x="47" y="35" width="6" height="20" fill={stroke}/>
          </svg>
        );
      case 'info':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <circle cx="50" cy="50" r="40" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
            <circle cx="50" cy="35" r="4" fill={stroke}/>
            <rect x="47" y="45" width="6" height="25" fill={stroke}/>
          </svg>
        );
      case 'question':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <circle cx="50" cy="50" r="40" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
            <path d="M40,35 Q40,25 50,25 Q60,25 60,35 Q60,45 50,45 L50,55" fill="none" stroke={stroke} strokeWidth={strokeWidth}/>
            <circle cx="50" cy="65" r="3" fill={stroke}/>
          </svg>
        );
      // 流程图专用图形
      case 'process-rectangle':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <rect x="15" y="35" width="70" height="30" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'decision-diamond':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="50,20 80,50 50,80 20,50" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'start-end-ellipse':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <ellipse cx="50" cy="50" rx="35" ry="20" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'document':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M20,20 L80,20 L80,70 Q70,80 60,70 Q50,60 40,70 Q30,80 20,70 Z" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'database':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <ellipse cx="50" cy="25" rx="30" ry="10" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
            <rect x="20" y="25" width="60" height="40" fill={fill} stroke="none"/>
            <ellipse cx="50" cy="65" rx="30" ry="10" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
            <line x1="20" y1="25" x2="20" y2="65" stroke={stroke} strokeWidth={strokeWidth}/>
            <line x1="80" y1="25" x2="80" y2="65" stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      // 装饰性图形
      case 'flower':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <circle cx="50" cy="50" r="8" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
            <ellipse cx="50" cy="30" rx="8" ry="15" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
            <ellipse cx="70" cy="50" rx="15" ry="8" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
            <ellipse cx="50" cy="70" rx="8" ry="15" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
            <ellipse cx="30" cy="50" rx="15" ry="8" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'leaf':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M20,80 Q50,20 80,50 Q60,70 20,80 Z" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
            <path d="M20,80 Q40,60 60,40" fill="none" stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'sun':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <circle cx="50" cy="50" r="20" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
            <g stroke={stroke} strokeWidth={strokeWidth}>
              <line x1="50" y1="10" x2="50" y2="20"/>
              <line x1="50" y1="80" x2="50" y2="90"/>
              <line x1="10" y1="50" x2="20" y2="50"/>
              <line x1="80" y1="50" x2="90" y2="50"/>
              <line x1="21" y1="21" x2="29" y2="29"/>
              <line x1="71" y1="71" x2="79" y2="79"/>
              <line x1="79" y1="21" x2="71" y2="29"/>
              <line x1="29" y1="71" x2="21" y2="79"/>
            </g>
          </svg>
        );
      case 'moon':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M30,20 A25,25 0 1,0 30,80 A20,20 0 1,1 30,20 Z" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
          </svg>
        );
      case 'house':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="50,20 20,50 30,50 30,80 70,80 70,50 80,50" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
            <rect x="40" y="60" width="10" height="20" fill={stroke}/>
            <rect x="55" y="35" width="8" height="8" fill={stroke}/>
          </svg>
        );
      case 'tree':
        return (
          <svg style={svgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <rect x="47" y="60" width="6" height="25" fill="#8B4513"/>
            <circle cx="50" cy="40" r="20" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
            <circle cx="35" cy="50" r="15" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
            <circle cx="65" cy="50" r="15" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
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