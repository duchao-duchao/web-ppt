import { usePresentationStore } from '@/stores/presentationStore';
import { PPTElement } from '@/types/presentation';
import { Command } from '@/types/command';
import { v4 as uuidv4 } from 'uuid';

export class AddElementCommand implements Command {
  private element: Omit<PPTElement, 'id'> & { left?: number, top?: number };
  private elementId: string | null = null;

  constructor(element: Omit<PPTElement, 'id'> & { left?: number, top?: number }) {
    this.element = element;
  }

  execute() {
    const { addElement, selectedElementIds } = usePresentationStore.getState();
    addElement(this.element);
    // 获取刚添加的元素ID（最新选中的元素）
    const newSelectedIds = usePresentationStore.getState().selectedElementIds;
    this.elementId = newSelectedIds[0];
  }

  undo() {
    if (this.elementId) {
      const { slides, currentSlideIndex, updateCurrentSlide } = usePresentationStore.getState();
      const currentSlide = slides[currentSlideIndex];
      const newSlide = {
        ...currentSlide,
        elements: currentSlide.elements.filter(e => e.id !== this.elementId),
      };
      updateCurrentSlide(newSlide);
    }
  }
}