import { useEffect, useState } from 'react';
import { usePresentationStore } from '@/stores/presentationStore';
import Canvas from '@/components/Canvas';
import './index.less';

const PreviewPage = () => {
  const { slides, setCurrentSlideIndex, currentSlideIndex, loadState } = usePresentationStore();
  const [slideIndex, setSlideIndex] = useState(currentSlideIndex);

  useEffect(() => {
    const savedState = localStorage.getItem('presentation-for-preview');
    if (savedState) {
      loadState(JSON.parse(savedState));
    }
  }, [loadState]);

  useEffect(() => {
    setCurrentSlideIndex(slideIndex);
  }, [slideIndex, setCurrentSlideIndex]);

  // 尝试进入全屏（部分浏览器需要用户手势，失败则忽略）
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        }
      } catch (e) {
        // 可能因为未有用户手势而失败，忽略即可
      }
    };
    enterFullscreen();
  }, []);

  const handlePrev = () => {
    if (slideIndex > 0) {
      setSlideIndex(slideIndex - 1);
    }
  };

  const handleNext = () => {
    if (slideIndex < slides.length - 1) {
      setSlideIndex(slideIndex + 1);
    }
  };

  // 使用上下键切换幻灯片
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [slideIndex, slides.length]);

  const currentSlide = slides[slideIndex];

  // 以 5:3 基准尺寸进行缩放，保证内容比例不变
  const baseWidth = 800;
  const baseHeight = 480; // 5:3
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const updateScale = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const s = Math.min(vw / baseWidth, vh / baseHeight);
      setScale(s);
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
      {currentSlide && (
        <Canvas
          interactive={false}
          embedded={true}
          width={baseWidth}
          height={baseHeight}
          scale={scale}
          showBorder={false}
        />
      )}
    </div>
  );
};

export default PreviewPage;