import { useLenis } from 'lenis/react';
import { useEffect } from 'react';

export const chapterState = {
  scroll: 0,
  chapter: 0,
  chapterProgress: 0,
};

let chapters: { id: number; top: number; bottom: number }[] = [];

function measureChapters() {
  const elements = document.querySelectorAll('[data-chapter]');
  const scrollY = window.scrollY;
  chapters = Array.from(elements).map((el) => {
    const rect = el.getBoundingClientRect();
    const id = parseInt(el.getAttribute('data-chapter') || '0', 10);
    return {
      id,
      top: rect.top + scrollY,
      bottom: rect.bottom + scrollY,
    };
  });
}

export function useChapterEngine() {
  useEffect(() => {
    measureChapters();
    // Wait for fonts and images to load to ensure dimensions are correct
    window.addEventListener('load', measureChapters);
    window.addEventListener('resize', measureChapters);
    // Timeout as a fallback
    setTimeout(measureChapters, 500);
    setTimeout(measureChapters, 2000);
    return () => {
      window.removeEventListener('load', measureChapters);
      window.removeEventListener('resize', measureChapters);
    };
  }, []);

  useLenis(({ scroll, limit }) => {
    chapterState.scroll = limit > 0 ? scroll / limit : 0;
    
    if (chapters.length === 0) return;
    
    // Find active chapter based on center of screen
    const triggerY = scroll + window.innerHeight / 2;
    
    for (let i = 0; i < chapters.length; i++) {
      const c = chapters[i];
      if (triggerY >= c.top && triggerY < c.bottom) {
        chapterState.chapter = c.id;
        const height = c.bottom - c.top;
        const localScroll = triggerY - c.top;
        chapterState.chapterProgress = Math.max(0, Math.min(1, localScroll / height));
        break;
      }
    }
  });
}
