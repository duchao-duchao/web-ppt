export type ElementType = 'text' | 'image' | 'shape';

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
}

export interface Slide {
  id: string;
  elements: PPTElement[];
  background?: {
    color?: string;
    image?: string;
  };
}