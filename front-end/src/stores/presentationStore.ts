import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Slide, PPTElement } from '@/types/presentation';
import { temporal } from 'zundo';

interface PresentationState {
  slides: Slide[];
  currentSlideIndex: number;
  selectedElementIds: string[];

  addSlide: () => void;
  deleteSlide: (index: number) => void;
  setCurrentSlideIndex: (index: number) => void;
  updateCurrentSlide: (slide: Partial<Slide>) => void;
  addElement: (element: Omit<PPTElement, 'id'> & { left?: number, top?: number }) => void;
  updateElement: (id: string, element: Partial<PPTElement>) => void;
  setSelectedElementIds: (ids: string[]) => void;
  loadState: (state: PresentationState) => void;
}

export const usePresentationStore = create<PresentationState>()(temporal((set, get) => ({
  slides: [{ id: uuidv4(), elements: [] }],
  currentSlideIndex: 0,
  selectedElementIds: [],

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

  setSelectedElementIds: (ids: string[]) => {
    set({ selectedElementIds: ids });
  },

  loadState: (newState) => {
    set(newState);
  },
})));