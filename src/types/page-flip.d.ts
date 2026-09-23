declare module 'page-flip' {
  export class PageFlip {
    constructor(element: HTMLElement, settings: {
      width: number; height: number; size?: 'fixed' | 'stretch';
      minWidth?: number; maxWidth?: number; minHeight?: number; maxHeight?: number;
      drawShadow?: boolean; flippingTime?: number; usePortrait?: boolean;
      startPage?: number; autoSize?: boolean; maxShadowOpacity?: number;
      showCover?: boolean; mobileScrollSupport?: boolean; swipeDistance?: number;
      clickEventForward?: boolean; useMouseEvents?: boolean; showPageCorners?: boolean;
      disableFlipByClick?: boolean;
    });
    loadFromHTML(pages: HTMLElement[]): void;
    on(event: string, callback: (event: { data: unknown; object: PageFlip }) => void): void;
    off(event: string): void;
    destroy(): void;
    update(): void;
    getCurrentPageIndex(): number;
    getOrientation(): 'portrait' | 'landscape';
    getState(): string;
    getBoundsRect(): { pageWidth: number; width: number; height: number; left: number; top: number };
    flipNext(corner?: 'top' | 'bottom'): void;
    flipPrev(corner?: 'top' | 'bottom'): void;
    turnToNextPage(): void;
    turnToPrevPage(): void;
    turnToPage(page: number): void;
  }
}
