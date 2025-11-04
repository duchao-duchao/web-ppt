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
        {
          id: uuidv4(),
          elements: [
            {
              id: uuidv4(),
              type: 'text',
              content: '项目汇报',
              x: 100,
              y: 150,
              width: 400,
              height: 80,
              style: {
                fontSize: 48,
                fontWeight: 'bold',
                color: '#1a1a1a',
                textAlign: 'center',
                fontFamily: 'Microsoft YaHei'
              }
            },
            {
              id: uuidv4(),
              type: 'text',
              content: '2024年第一季度工作总结',
              x: 100,
              y: 250,
              width: 400,
              height: 40,
              style: {
                fontSize: 24,
                color: '#666666',
                textAlign: 'center',
                fontFamily: 'Microsoft YaHei'
              }
            },
            {
              id: uuidv4(),
              type: 'shape',
              shape: 'rectangle',
              x: 200,
              y: 320,
              width: 200,
              height: 4,
              style: {
                backgroundColor: '#1890ff',
                borderColor: '#096dd9',
                borderWidth: 0
              }
            }
          ]
        },
        {
          id: uuidv4(),
          elements: [
            {
              id: uuidv4(),
              type: 'text',
              content: '核心成果',
              x: 50,
              y: 50,
              width: 200,
              height: 50,
              style: {
                fontSize: 32,
                fontWeight: 'bold',
                color: '#1a1a1a',
                fontFamily: 'Microsoft YaHei'
              }
            },
            {
              id: uuidv4(),
              type: 'shape',
              shape: 'circle',
              x: 80,
              y: 130,
              width: 60,
              height: 60,
              style: {
                backgroundColor: '#52c41a',
                borderColor: '#389e0d',
                borderWidth: 2
              }
            },
            {
              id: uuidv4(),
              type: 'text',
              content: '用户增长',
              x: 160,
              y: 140,
              width: 120,
              height: 40,
              style: {
                fontSize: 20,
                fontWeight: 'bold',
                color: '#52c41a',
                fontFamily: 'Microsoft YaHei'
              }
            },
            {
              id: uuidv4(),
              type: 'text',
              content: '新增用户 50,000+',
              x: 160,
              y: 175,
              width: 200,
              height: 30,
              style: {
                fontSize: 16,
                color: '#666666',
                fontFamily: 'Microsoft YaHei'
              }
            },
            {
              id: uuidv4(),
              type: 'shape',
              shape: 'circle',
              x: 80,
              y: 230,
              width: 60,
              height: 60,
              style: {
                backgroundColor: '#1890ff',
                borderColor: '#096dd9',
                borderWidth: 2
              }
            },
            {
              id: uuidv4(),
              type: 'text',
              content: '营收提升',
              x: 160,
              y: 240,
              width: 120,
              height: 40,
              style: {
                fontSize: 20,
                fontWeight: 'bold',
                color: '#1890ff',
                fontFamily: 'Microsoft YaHei'
              }
            },
            {
              id: uuidv4(),
              type: 'text',
              content: '同比增长 35%',
              x: 160,
              y: 275,
              width: 200,
              height: 30,
              style: {
                fontSize: 16,
                color: '#666666',
                fontFamily: 'Microsoft YaHei'
              }
            }
          ]
        },
        {
          id: uuidv4(),
          elements: [
            {
              id: uuidv4(),
              type: 'text',
              content: '未来展望',
              x: 50,
              y: 50,
              width: 200,
              height: 50,
              style: {
                fontSize: 32,
                fontWeight: 'bold',
                color: '#1a1a1a',
                fontFamily: 'Microsoft YaHei'
              }
            },
            {
              id: uuidv4(),
              type: 'shape',
              shape: 'rounded-rectangle',
              x: 60,
              y: 130,
              width: 420,
              height: 80,
              style: {
                backgroundColor: '#f0f5ff',
                borderColor: '#b8d4ff',
                borderWidth: 1,
                borderRadius: 8
              }
            },
            {
              id: uuidv4(),
              type: 'text',
              content: 'Q2 目标规划',
              x: 80,
              y: 145,
              width: 150,
              height: 30,
              style: {
                fontSize: 18,
                fontWeight: 'bold',
                color: '#1890ff',
                fontFamily: 'Microsoft YaHei'
              }
            },
            {
              id: uuidv4(),
              type: 'text',
              content: '• 用户规模突破 100万\n• 产品功能全面升级\n• 市场拓展至新领域',
              x: 80,
              y: 175,
              width: 380,
              height: 60,
              style: {
                fontSize: 14,
                color: '#333333',
                fontFamily: 'Microsoft YaHei',
                lineHeight: 1.5
              }
            },
            {
              id: uuidv4(),
              type: 'shape',
              shape: 'rounded-rectangle',
              x: 60,
              y: 240,
              width: 420,
              height: 80,
              style: {
                backgroundColor: '#fff7e6',
                borderColor: '#ffd591',
                borderWidth: 1,
                borderRadius: 8
              }
            },
            {
              id: uuidv4(),
              type: 'text',
              content: '战略重点',
              x: 80,
              y: 255,
              width: 150,
              height: 30,
              style: {
                fontSize: 18,
                fontWeight: 'bold',
                color: '#fa8c16',
                fontFamily: 'Microsoft YaHei'
              }
            },
            {
              id: uuidv4(),
              type: 'text',
              content: '• 技术创新驱动发展\n• 用户体验持续优化\n• 团队能力全面提升',
              x: 80,
              y: 285,
              width: 380,
              height: 60,
              style: {
                fontSize: 14,
                color: '#333333',
                fontFamily: 'Microsoft YaHei',
                lineHeight: 1.5
              }
            }
          ]
        }
      ],
      currentSlideIndex: 0,
      selectedElementIds: [],
      name: '项目汇报模板',
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