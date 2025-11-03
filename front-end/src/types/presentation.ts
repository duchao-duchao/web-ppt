export type ElementType = 'text' | 'image' | 'shape' | 'line';

export interface PPTElement {
  id: string;
  type: ElementType;
  left: number;
  top: number;
  width: number;
  height: number;
  rotation?: number;
  content?: string; // For text, image src, and shape type
  style?: ElementStyle;
  x?: number;
  y?: number;
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

export interface Slide {
  id: string;
  elements: PPTElement[];
  background?: {
    color?: string;
    image?: string;
  };
}