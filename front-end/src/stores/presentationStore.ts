import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Slide, PPTElement } from '@/types/presentation';
import { temporal } from 'zundo';
import { persist } from 'zustand/middleware';

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
  pause: () => void;
  resume: () => void;
}

export const usePresentationStore = create<PresentationState>()(
  persist(
    temporal((set, get) => ({
      slides: [
        // 封面：全屏背景图 + 半透明标题卡片
        {
          id: uuidv4(),
          background: {
            color: '#000000',
            image: 'https://images.unsplash.com/photo-1506765515384-028b60a970df?auto=format&fit=crop&w=1200&q=60'
          },
          elements: [
            {
              id: uuidv4(),
              type: 'shape',
              content: 'rounded-rectangle',
              x: 80,
              y: 140,
              width: 640,
              height: 180,
              style: {
                fill: 'rgba(255,255,255,0.85)',
                stroke: 'transparent',
                strokeWidth: 0
              }
            },
            {
              id: uuidv4(),
              type: 'text',
              content: '精美演示模板',
              x: 100,
              y: 160,
              width: 600,
              height: 70,
              style: {
                fontSize: 44,
                fontWeight: 'bold',
                color: '#111111',
                textAlign: 'center'
              }
            },
            {
              id: uuidv4(),
              type: 'text',
              content: '图文展示 · 极简风格',
              x: 100,
              y: 230,
              width: 600,
              height: 50,
              style: {
                fontSize: 20,
                color: '#555555',
                textAlign: 'center'
              }
            }
          ]
        },
        // 文本+图片版式：左图右文
        {
          id: uuidv4(),
          background: {
            color: '#f7f9fc'
          },
          elements: [
            {
              id: uuidv4(),
              type: 'image',
              content: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1000&q=60',
              x: 60,
              y: 80,
              width: 360,
              height: 240,
              style: {}
            },
            {
              id: uuidv4(),
              type: 'shape',
              content: 'rounded-rectangle',
              x: 440,
              y: 80,
              width: 300,
              height: 240,
              style: {
                fill: '#ffffff',
                stroke: '#e0e4ef',
                strokeWidth: 1
              }
            },
            {
              id: uuidv4(),
              type: 'text',
              content: '产品亮点',
              x: 460,
              y: 100,
              width: 260,
              height: 40,
              style: {
                fontSize: 26,
                fontWeight: 'bold',
                color: '#111111'
              }
            },
            {
              id: uuidv4(),
              type: 'text',
              content: '• 高质感视觉',
              x: 460,
              y: 150,
              width: 260,
              height: 28,
              style: {
                fontSize: 16,
                color: '#444444'
              }
            },
            {
              id: uuidv4(),
              type: 'text',
              content: '• 响应式布局',
              x: 460,
              y: 182,
              width: 260,
              height: 28,
              style: {
                fontSize: 16,
                color: '#444444'
              }
            },
            {
              id: uuidv4(),
              type: 'text',
              content: '• 易于编辑',
              x: 460,
              y: 214,
              width: 260,
              height: 28,
              style: {
                fontSize: 16,
                color: '#444444'
              }
            }
          ]
        },
        // 图片集锦：三张图片横排
        {
          id: uuidv4(),
          background: {
            color: '#ffffff'
          },
          elements: [
            {
              id: uuidv4(),
              type: 'text',
              content: '图片集锦',
              x: 60,
              y: 50,
              width: 680,
              height: 50,
              style: {
                fontSize: 32,
                fontWeight: 'bold',
                color: '#111111'
              }
            },
            {
              id: uuidv4(),
              type: 'shape',
              content: 'rectangle',
              x: 60,
              y: 100,
              width: 120,
              height: 4,
              style: {
                fill: '#1677ff',
                stroke: 'transparent',
                strokeWidth: 0
              }
            },
            {
              id: uuidv4(),
              type: 'image',
              content: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60',
              x: 60,
              y: 140,
              width: 200,
              height: 140,
              style: {}
            },
            {
              id: uuidv4(),
              type: 'image',
              content: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60',
              x: 300,
              y: 140,
              width: 200,
              height: 140,
              style: {}
            },
            {
              id: uuidv4(),
              type: 'image',
              content: 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=800&q=60',
              x: 540,
              y: 140,
              width: 200,
              height: 140,
              style: {}
            }
          ]
        }
      ],
      currentSlideIndex: 0,
      selectedElementIds: [],
      name: '精美PPT模板',
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

      pause: () => {
        usePresentationStore.temporal.getState().pause();
      },

      resume: () => {
        usePresentationStore.temporal.getState().resume();
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
    })),
    {
      name: 'presentation',
    }
  )
);