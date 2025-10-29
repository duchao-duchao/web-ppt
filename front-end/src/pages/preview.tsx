import { useEffect, useState } from 'react';
import { usePresentationStore } from '@/stores/presentationStore';
import Canvas from '@/components/Canvas';
import { Button, Space } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const PreviewPage = () => {
  const { slides, setCurrentSlideIndex, currentSlideIndex } = usePresentationStore();
  const [slideIndex, setSlideIndex] = useState(currentSlideIndex);

  useEffect(() => {
    setCurrentSlideIndex(slideIndex);
  }, [slideIndex, setCurrentSlideIndex]);

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

  const currentSlide = slides[slideIndex];

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {currentSlide && <Canvas />}
      </div>
      <div style={{ padding: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Space>
          <Button icon={<LeftOutlined />} onClick={handlePrev} disabled={slideIndex === 0} />
          <span>{`${slideIndex + 1} / ${slides.length}`}</span>
          <Button icon={<RightOutlined />} onClick={handleNext} disabled={slideIndex === slides.length - 1} />
        </Space>
      </div>
    </div>
  );
};

export default PreviewPage;