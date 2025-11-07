import { useEffect, useRef, useState } from 'react';
import { usePresentationStore } from '@/stores/presentationStore';
import Canvas from '@/components/Canvas';
import './index.less';
import { ElementAnimation, Slide } from '@/types/presentation';

const PreviewPage = () => {
  const { slides, setCurrentSlideIndex, currentSlideIndex, loadState } = usePresentationStore();
  const [slideIndex, setSlideIndex] = useState(currentSlideIndex);
  const [stepIndex, setStepIndex] = useState(0);
  const waitClickRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const runningRef = useRef<Animation[]>([]);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    const savedState = localStorage.getItem('presentation-for-preview');
    if (savedState) {
      loadState(JSON.parse(savedState));
    }
  }, [loadState]);

  useEffect(() => {
    setCurrentSlideIndex(slideIndex);
    setStepIndex(0);
    applyInitialEntranceGating();
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

  // ===== 动画构建 =====
  const buildKeyframes = (anim: ElementAnimation): Keyframe[] => {
    const { effect, options, kind } = anim;
    const dist = options.distancePx ?? 120;
    const dir = options.direction ?? 'bottom';
    const rot = options.rotateDeg ?? 360;

    switch (effect) {
      case 'appear':
      case 'fade':
        return [{ opacity: 0 }, { opacity: 1 }];
      case 'disappear':
        return [{ opacity: 1 }, { opacity: 0 }];
      case 'zoomIn':
        return [{ transform: 'scale(0.8)', opacity: 0.5 }, { transform: 'scale(1)', opacity: 1 }];
      case 'zoomOut':
        return [{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(0.8)', opacity: 0.5 }];
      case 'flyIn': {
        const t = dir === 'left' ? `translateX(-${dist}px)`
          : dir === 'right' ? `translateX(${dist}px)`
          : dir === 'top' ? `translateY(-${dist}px)`
          : `translateY(${dist}px)`;
        return [{ transform: t, opacity: 0 }, { transform: 'translate(0,0)', opacity: 1 }];
      }
      case 'flyOut': {
        const t = dir === 'left' ? `translateX(-${dist}px)`
          : dir === 'right' ? `translateX(${dist}px)`
          : dir === 'top' ? `translateY(-${dist}px)`
          : `translateY(${dist}px)`;
        return [{ transform: 'translate(0,0)', opacity: 1 }, { transform: t, opacity: 0 }];
      }
      case 'spin': {
        const endDeg = rot || 360;
        return [{ transform: 'rotate(0deg)' }, { transform: `rotate(${endDeg}deg)` }];
      }
      case 'bounce':
        return [
          { transform: 'scale(1)', offset: 0 },
          { transform: 'scale(1.15)', offset: 0.4 },
          { transform: 'scale(0.95)', offset: 0.7 },
          { transform: 'scale(1)', offset: 1 },
        ];
      case 'wipe': {
        // 简化：用淡入近似
        return [{ opacity: 0 }, { opacity: 1 }];
      }
      default:
        // 未知效果，退化为淡入
        if (kind === 'exit') return [{ opacity: 1 }, { opacity: 0 }];
        return [{ opacity: 0 }, { opacity: 1 }];
    }
  };

  const getElementDom = (elementId: string): HTMLElement | null => {
    const main = document.getElementById('ppt-main-canvas');
    const thumb = document.getElementById(`ppt-thumb-canvas-${slideIndex}`);
    const selector = `#ppt-el-${elementId}`;
    return (main?.querySelector(selector) as HTMLElement) || (thumb?.querySelector(selector) as HTMLElement) || null;
  };

  const findAnimation = (slide: Slide | undefined, elementId: string, animationId: string): ElementAnimation | null => {
    if (!slide) return null;
    const el = slide.elements.find(e => e.id === elementId);
    const anim = el?.animations?.find(a => a.id === animationId) ?? null;
    return anim || null;
  };

  // 为入口类动画应用初始隐藏（gating），避免未播放时元素直接可见
  const applyInitialEntranceGating = () => {
    const slide = currentSlide;
    if (!slide || !Array.isArray(slide.timeline)) return;
    console.log('applyInitialEntranceGating for slide', slide.id);
    
    const refs = slide.timeline.flatMap(step => step.animationRefs);
    const gatedIds = new Set<string>();
    for (const ref of refs) {
      if (gatedIds.has(ref.elementId)) continue;
      const anim = findAnimation(slide, ref.elementId, ref.animationId);
      if (!anim) continue;
      if (anim.kind === 'entrance') {
        const dom = getElementDom(ref.elementId);
        if (!dom) continue;
        // 仅使用不影响旋转/位移的属性进行 gating
        dom.style.opacity = '0';
        // 标记：已设置初始隐藏
        dom.setAttribute('data-pre-enter', 'true');
        gatedIds.add(ref.elementId);
      }
    }
  };

  const cancelRunning = () => {
    runningRef.current.forEach(a => {
      try { a.cancel(); } catch {}
    });
    runningRef.current = [];
    isPlayingRef.current = false;
  };

  // 取消当前幻灯片容器内所有动画，避免 fill 持久化造成状态残留
  const cancelAllAnimationsOnSlide = () => {
    const container = document.getElementById(`ppt-thumb-canvas-${slideIndex}`) || document.getElementById('ppt-main-canvas');
    if (container && (container as any).getAnimations) {
      try {
        (container as any).getAnimations().forEach((a: Animation) => a.cancel());
      } catch {}
    }
  };

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const playCurrentStep = async () => {
    const step = currentSlide?.timeline?.[stepIndex];
    if (!currentSlide || !step) return;
    clearTimer();
    cancelRunning();
    waitClickRef.current = false;
    isPlayingRef.current = true;

    const waapis: Animation[] = [];
    for (const ref of step.animationRefs) {
      const anim = findAnimation(currentSlide, ref.elementId, ref.animationId);
      const dom = getElementDom(ref.elementId);
      if (!anim || !dom) continue;
      // 清除该元素上任何残留动画
      try { (dom as any).getAnimations?.().forEach((a: Animation) => a.cancel()); } catch {}
      // 播放前清除入口 gating
      if (dom.getAttribute('data-pre-enter') === 'true') {
        dom.style.opacity = '';
        dom.removeAttribute('data-pre-enter');
      }
      const kf = buildKeyframes(anim);
      const wa = dom.animate(kf, {
        duration: anim.options.durationMs ?? 600,
        delay: anim.options.delayMs ?? 0,
        easing: anim.options.easing ?? 'ease',
        // 不持久化最终样式，播放后恢复到元素本来的样式（避免切换返回时全部可见）
        fill: 'none',
      });
      waapis.push(wa);
    }

    runningRef.current = waapis;
    try {
      await Promise.all(waapis.map(a => a.finished.catch(() => {})));
    } catch {}
    isPlayingRef.current = false;

    // 自动推进下一步：仅当下一步 trigger 为 auto/afterDelay
    const next = currentSlide.timeline?.[stepIndex + 1];
    if (!next) return;
    if (next.trigger === 'auto') {
      setStepIndex(i => i + 1);
    } else if (next.trigger === 'afterDelay') {
      clearTimer();
      timerRef.current = window.setTimeout(() => setStepIndex(i => i + 1), next.delayMs ?? 0);
    } else {
      waitClickRef.current = true;
      setStepIndex(i => i + 1);
    }
  };

  // 当步骤或幻灯片变化时，根据 trigger 决定是否播放
  useEffect(() => {
    clearTimer();
    cancelRunning();
    cancelAllAnimationsOnSlide();
    const step = currentSlide?.timeline?.[stepIndex];
    if (!currentSlide || !step) return;
    // 在进入该幻灯片时先设置入口 gating（只需执行一次即可，若重复执行影响也极小）
    applyInitialEntranceGating();
    if (step.trigger === 'auto') {
      playCurrentStep();
    } else if (step.trigger === 'afterDelay') {
      timerRef.current = window.setTimeout(() => playCurrentStep(), step.delayMs ?? 0);
    } else {
      waitClickRef.current = true;
    }
    return () => {
      clearTimer();
      cancelRunning();
      cancelAllAnimationsOnSlide();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlide?.id]);

  const advanceOnClick = () => {
    if (isPlayingRef.current) return;
    const step = currentSlide?.timeline?.[stepIndex];
    if (!step) return;
    if (step.trigger === 'onClick' && waitClickRef.current) {
      playCurrentStep();
    }
  };

  // Space/Enter 推进当前步骤
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        advanceOnClick();
      }
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
  }, [slideIndex, stepIndex, currentSlide]);

  return (
    <div
      style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}
      onClick={advanceOnClick}
    >
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