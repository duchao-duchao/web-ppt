export type ElementType = 'text' | 'image' | 'shape' | 'line';

export interface PPTElement {
  id: string;
  type: ElementType;
  left?: number;
  top?: number;
  width: number;
  height: number;
  rotation?: number;
  content?: string; // For text, image src, and shape type
  style?: ElementStyle;
  x?: number;
  y?: number;
  // 元素级动画（可选）
  animations?: ElementAnimation[];
}

export interface ElementStyle {
  color?: string;
  backgroundColor?: string;
  fontSize?: number;
  fontWeight?: number;
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline';
  textAlign?: 'left' | 'center' | 'right';
  // SVG相关样式
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  // 线条相关样式
  strokeDasharray?: string; // 虚线样式，如 "5,5" 表示虚线
  strokeLinecap?: 'butt' | 'round' | 'square'; // 线条端点样式
}

// 动画分类与效果
export type AnimationKind = 'entrance' | 'emphasis' | 'exit' | 'motion';
export type AnimationEffect =
  | 'fade' | 'zoomIn' | 'zoomOut' | 'flyIn' | 'flyOut'
  | 'spin' | 'bounce' | 'wipe' | 'appear' | 'disappear';

export type AnimationStartMode = 'onClick' | 'withPrevious' | 'afterPrevious';

export interface AnimationOptions {
  durationMs: number;       // 动画时长
  delayMs?: number;         // 延迟开始
  easing?: string;          // 缓动函数，如 'ease', 'ease-in-out', 'linear'
  direction?: 'left' | 'right' | 'top' | 'bottom'; // 方向型动画
  distancePx?: number;      // 位移/飞入距离
  rotateDeg?: number;       // 旋转角度（spin）
  loop?: boolean;           // 是否循环（强调/路径）
}

export interface ElementAnimation {
  id: string;
  kind: AnimationKind;
  effect: AnimationEffect;
  startMode: AnimationStartMode; // 触发方式
  options: AnimationOptions;
}

export interface Slide {
  id: string;
  elements: PPTElement[];
  background?: {
    color?: string;
    image?: string;
  };
  // 可选：该页的编排时间线（后续可用于串行/并行播放）
  timeline?: SlideTimelineStep[];
}

// 幻灯片时间线：按“步骤”组织一组动画并行执行
export interface SlideTimelineStep {
  id: string;
  title?: string;
  trigger: 'onClick' | 'auto' | 'afterDelay';
  delayMs?: number; // trigger=afterDelay时使用
  // 引用元素动画（并行播放）
  animationRefs: Array<{ elementId: string; animationId: string }>; 
  notes?: string;
}