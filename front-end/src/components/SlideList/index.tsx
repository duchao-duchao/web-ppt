import { usePresentationStore } from '@/stores/presentationStore';
import { Button } from 'antd';
import styles from './index.less';

const SlideList = () => {
  const { slides, currentSlideIndex, addSlide, deleteSlide, setCurrentSlideIndex } = usePresentationStore();

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
            {index + 1}
            {/* <Button
              className={styles.deleteButton}
              size="small"
              danger
              onClick={(e) => {
                e.stopPropagation();
                deleteSlide(index);
              }}
            >
              删除
            </Button> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlideList;