import React from 'react';
import { usePresentationStore } from '@/stores/presentationStore';
import { Button } from 'antd';
import { Slide } from '@/types/presentation';
import styles from './index.less';
import Canvas from '@/components/Canvas';

// 缩略图组件（复用 Canvas，整体缩放）
const SlideThumbnail: React.FC<{ slide: Slide; scale: number; slideIndex: number }> = ({ slide, scale, slideIndex }) => {
  // 与主画布一致的基准尺寸
  const canvasBaseWidth = 800;
  const canvasBaseHeight = 480;

  return (
    <div className={styles.thumbnail}>
      <div
        style={{
          width: canvasBaseWidth * scale,
          height: canvasBaseHeight * scale,
          position: 'relative',
        }}
      >
        <Canvas
          slideIndex={slideIndex}
          interactive={false}
          embedded={true}
          width={canvasBaseWidth}
          height={canvasBaseHeight}
          scale={scale}
          showBorder={false}
        />
      </div>
      <div className={styles.thumbnailIndex}>{slideIndex + 1}</div>
    </div>
  );
};

const SlideList = () => {
  const { slides, currentSlideIndex, addSlide, setCurrentSlideIndex } = usePresentationStore();
  
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