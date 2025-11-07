import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Slide, PPTElement, ElementAnimation, SlideTimelineStep } from '@/types/presentation';
import { temporal } from 'zundo';
import { persist } from 'zustand/middleware';
import { initialSlides } from '@/constant';

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
  // 动画相关操作
  addAnimation: (elementId: string, anim: Omit<ElementAnimation, 'id'>) => void;
  updateAnimation: (elementId: string, animationId: string, patch: Partial<ElementAnimation>) => void;
  removeAnimation: (elementId: string, animationId: string) => void;
  reorderAnimations: (elementId: string, fromIndex: number, toIndex: number) => void;
}

export const usePresentationStore = create<PresentationState>()(
  persist(
    temporal((set, get) => ({
      slides: initialSlides,
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

      // ===== 动画：增删改查 =====
      addAnimation: (elementId, anim) => {
        set(state => ({
          slides: state.slides.map((slide, i) => {
            if (i !== state.currentSlideIndex) return slide;

            let newAnimId: string | null = null;
            const newElements = slide.elements.map(el => {
              if (el.id !== elementId) return el;
              const next = { ...el } as PPTElement;
              const animations = Array.isArray(next.animations) ? next.animations : [];
              const newAnim = { ...anim, id: uuidv4() } as ElementAnimation;
              newAnimId = newAnim.id;
              next.animations = [...animations, newAnim];
              return next;
            });

            // 更新 timeline：根据 startMode 决定并入上一并行步骤或新增步骤
            let newTimeline: SlideTimelineStep[] | undefined;
            if (Array.isArray(slide.timeline)) {
              newTimeline = [...slide.timeline];
            } else {
              newTimeline = [];
            }

            if (newAnimId) {
              const ref = { elementId, animationId: newAnimId };
              if (anim.startMode === 'withPrevious') {
                if (newTimeline.length > 0) {
                  const last = newTimeline[newTimeline.length - 1];
                  newTimeline[newTimeline.length - 1] = {
                    ...last,
                    animationRefs: [...last.animationRefs, ref],
                  };
                } else {
                  newTimeline.push({
                    id: uuidv4(),
                    title: `步骤 ${newTimeline.length + 1}`,
                    trigger: 'auto',
                    animationRefs: [ref],
                  });
                }
              } else {
                newTimeline.push({
                  id: uuidv4(),
                  title: `步骤 ${newTimeline.length + 1}`,
                  trigger: anim.startMode === 'onClick' ? 'onClick' : 'auto',
                  animationRefs: [ref],
                });
              }
            }

            return { ...slide, elements: newElements, timeline: newTimeline };
          })
        }));
      },

      updateAnimation: (elementId, animationId, patch) => {
        set(state => ({
          slides: state.slides.map((slide, i) => {
            if (i !== state.currentSlideIndex) return slide;
            return {
              ...slide,
              elements: slide.elements.map(el => {
                if (el.id !== elementId) return el;
                const animations = Array.isArray(el.animations) ? el.animations : [];
                return {
                  ...el,
                  animations: animations.map(a => a.id === animationId ? { ...a, ...patch, options: { ...a.options, ...(patch as any).options } } : a),
                };
              }),
            };
          })
        }));
      },

      removeAnimation: (elementId, animationId) => {
        set(state => ({
          slides: state.slides.map((slide, i) => {
            if (i !== state.currentSlideIndex) return slide;

            const elements = slide.elements.map(el => {
              if (el.id !== elementId) return el;
              const animations = Array.isArray(el.animations) ? el.animations : [];
              return { ...el, animations: animations.filter(a => a.id !== animationId) };
            });

            // 同步清理 timeline 中的引用，并删除空步骤
            let timeline = slide.timeline;
            if (Array.isArray(timeline)) {
              timeline = timeline
                .map(step => ({
                  ...step,
                  animationRefs: step.animationRefs.filter(ref => !(ref.elementId === elementId && ref.animationId === animationId))
                }))
                .filter(step => step.animationRefs.length > 0);
            }

            return { ...slide, elements, timeline };
          })
        }));
      },

      reorderAnimations: (elementId, fromIndex, toIndex) => {
        set(state => ({
          slides: state.slides.map((slide, i) => {
            if (i !== state.currentSlideIndex) return slide;
            return {
              ...slide,
              elements: slide.elements.map(el => {
                if (el.id !== elementId) return el;
                const animations = Array.isArray(el.animations) ? [...el.animations] : [];
                if (fromIndex < 0 || toIndex < 0 || fromIndex >= animations.length || toIndex >= animations.length) {
                  return el;
                }
                const [moved] = animations.splice(fromIndex, 1);
                animations.splice(toIndex, 0, moved);
                return { ...el, animations };
              }),
            };
          })
        }));
      },
    })),
    {
      name: 'presentation',
    }
  )
);