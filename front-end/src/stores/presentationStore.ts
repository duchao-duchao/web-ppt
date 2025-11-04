import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Slide, PPTElement } from '@/types/presentation';
import { temporal } from 'zundo';

interface PresentationState {
  slides: Slide[];
  currentSlideIndex: number;
  selectedElementIds: string[];
  name: string;
  copiedElements: PPTElement[];

  addSlide: () => void;
  deleteSlide: (index: number) => void;
  setCurrentSlideIndex: (index: number) => void;
  updateCurrentSlide: (slide: Partial<Slide>) => void;
  addElement: (element: Omit<PPTElement, 'id'> & { left?: number, top?: number }) => void;
  updateElement: (id: string, element: Partial<PPTElement>) => void;
  deleteElement: (id: string) => void;
  setSelectedElementIds: (ids: string[]) => void;
  copyElements: () => void;
  pasteElements: () => void;
  bringForward: () => void;
  sendBackward: () => void;
  setName: (name: string) => void;
  loadState: (state: Partial<PresentationState>) => void;
}

export const usePresentationStore = create<PresentationState>()(temporal((set, get) => ({
  slides: [{ id: uuidv4(), elements: [] }],
  currentSlideIndex: 0,
  selectedElementIds: [],
  name: '未命名PPT',
  copiedElements: [],

  addSlide: () => {
    set(state => ({
      slides: [...state.slides, { id: uuidv4(), elements: [] }],
      currentSlideIndex: state.slides.length,
    }));
  },

  deleteSlide: (index: number) => {
    set(state => ({
      slides: state.slides.filter((_, i) => i !== index),
      currentSlideIndex: state.currentSlideIndex >= index ? Math.max(0, state.currentSlideIndex - 1) : state.currentSlideIndex,
    }));
  },

  setCurrentSlideIndex: (index: number) => {
    set({ currentSlideIndex: index, selectedElementIds: [] });
  },

  updateCurrentSlide: (slide) => {
    set(state => ({
      slides: state.slides.map((s, i) => i === state.currentSlideIndex ? { ...s, ...slide } : s),
    }));
  },

  addElement: (element) => {
    set(state => {
      const newElement = { ...element, id: uuidv4(), x: element.left, y: element.top };
      delete (newElement as any).left;
      delete (newElement as any).top;

      const newSlides = state.slides.map((slide, index) => {
        if (index !== state.currentSlideIndex) return slide;
        return {
          ...slide,
          elements: [...slide.elements, newElement as PPTElement],
        };
      });

      return { slides: newSlides, selectedElementIds: [newElement.id] };
    });
  },

  updateElement: (id, element) => {
    set(state => ({
      slides: state.slides.map((slide, index) => {
        if (index !== state.currentSlideIndex) return slide;

        return {
          ...slide,
          elements: slide.elements.map(el => {
            if (el.id !== id) return el;

            const { left, top, ...rest } = element as Partial<PPTElement> & { left?: number; top?: number };
            const newProps: Partial<PPTElement> = rest;
            if (left !== undefined) newProps.x = left;
            if (top !== undefined) newProps.y = top;

            return { ...el, ...newProps };
          }),
        };
      }),
    }));
  },

  deleteElement: (id) => {
    set((state) => ({
      slides: state.slides.map((slide, index) => {
        if (index !== state.currentSlideIndex) return slide;
        return {
          ...slide,
          elements: slide.elements.filter((el) => el.id !== id),
        };
      }),
      selectedElementIds: state.selectedElementIds.filter((selectedId) => selectedId !== id),
    }));
  },

  setSelectedElementIds: (ids: string[]) => {
    set({ selectedElementIds: ids });
  },
  
  copyElements: () => {
    const { slides, currentSlideIndex, selectedElementIds } = get();
    const currentSlide = slides[currentSlideIndex];
    if (!currentSlide) return;

    const copied = currentSlide.elements.filter(el => selectedElementIds.includes(el.id));
    set({ copiedElements: copied });
  },

  pasteElements: () => {
    const { slides, currentSlideIndex, copiedElements } = get();
    if (!copiedElements.length) return;

    const newElements = copiedElements.map(el => ({
      ...el,
      id: uuidv4(),
      x: (el.x ?? el.left) + 20,
      y: (el.y ?? el.top) + 20,
    }));

    set(state => ({
      slides: state.slides.map((slide, index) => {
        if (index !== currentSlideIndex) return slide;
        return {
          ...slide,
          elements: [...slide.elements, ...newElements],
        };
      }),
      selectedElementIds: newElements.map(el => el.id),
    }));
  },

  bringForward: () => {
    set(state => {
      const { slides, currentSlideIndex, selectedElementIds } = state;
      if (selectedElementIds.length !== 1) return state;

      const slide = slides[currentSlideIndex];
      const elementId = selectedElementIds[0];
      const index = slide.elements.findIndex(e => e.id === elementId);

      if (index < slide.elements.length - 1) {
        const newElements = [...slide.elements];
        const [element] = newElements.splice(index, 1);
        newElements.splice(index + 1, 0, element);

        return {
          ...state,
          slides: slides.map((s, i) => i === currentSlideIndex ? { ...s, elements: newElements } : s),
        };
      }
      return state;
    });
  },

  sendBackward: () => {
    set(state => {
      const { slides, currentSlideIndex, selectedElementIds } = state;
      if (selectedElementIds.length !== 1) return state;

      const slide = slides[currentSlideIndex];
      const elementId = selectedElementIds[0];
      const index = slide.elements.findIndex(e => e.id === elementId);

      if (index > 0) {
        const newElements = [...slide.elements];
        const [element] = newElements.splice(index, 1);
        newElements.splice(index - 1, 0, element);

        return {
          ...state,
          slides: slides.map((s, i) => i === currentSlideIndex ? { ...s, elements: newElements } : s),
        };
      }
      return state;
    });
  },

  setName: (name: string) => {
    set({ name });
  },

  loadState: (newState) => {
    set(state => ({
      ...state,
      ...newState,
      name: (newState.name ?? state.name),
    }));
  },
})));