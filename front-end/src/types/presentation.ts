export type ElementType = 'text' | 'rect' | 'image';

export interface PPTElement {
  id: string;
  type: ElementType;
  left: number;
  top: number;
  width: number;
  height: number;
  rotation?: number;
  content?: string; // For text and image src
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
}

export interface Slide {
  id: string;
  elements: PPTElement[];
  background?: {
    color?: string;
    image?: string;
  };
}