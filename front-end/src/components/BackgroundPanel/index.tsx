import { usePresentationStore } from '@/stores/presentationStore';
import { Input, ColorPicker } from 'antd';

const BackgroundPanel = () => {
  const { slides, currentSlideIndex, updateCurrentSlide } = usePresentationStore();
  const currentSlide = slides[currentSlideIndex];

  const handleColorChange = (color: any) => {
    updateCurrentSlide({ background: { ...currentSlide.background, color: color.toHexString() } });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateCurrentSlide({ background: { ...currentSlide.background, image: e.target.value } });
  };

  return (
    <div>
      <h3>背景设置</h3>
      <div>
        <label>背景颜色：</label>
        <ColorPicker value={currentSlide.background?.color} onChange={handleColorChange} />
      </div>
      <div>
        <label>背景图片：</label>
        <Input value={currentSlide.background?.image} onChange={handleImageChange} />
      </div>
    </div>
  );
};

export default BackgroundPanel;