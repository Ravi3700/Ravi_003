import { useState, useEffect } from 'react';

export interface ScrollSpyOptions {
  offset?: number;
  threshold?: number;
}

/**
 * Custom hook to track the active section in view as the user scrolls.
 * Uses a combination of scroll position geometry and IntersectionObserver
 * to ensure reliable highlighting on desktop, tablet, and mobile.
 */
export function useScrollSpy(
  sectionIds: string[],
  options: ScrollSpyOptions = {}
): string {
  const { offset = 120 } = options;
  const [activeId, setActiveId] = useState<string>(sectionIds[0] || '');

  useEffect(() => {
    if (typeof window === 'undefined' || sectionIds.length === 0) return;

    let isThrottled = false;

    const determineActiveSection = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // 1. Near the top of page: always highlight the first section (Home/Hero)
      if (scrollPosition < 100) {
        if (sectionIds[0]) {
          setActiveId(sectionIds[0]);
        }
        return;
      }

      // 2. Near the bottom of page: always highlight the last section (Contact)
      if (windowHeight + scrollPosition >= documentHeight - 60) {
        if (sectionIds[sectionIds.length - 1]) {
          setActiveId(sectionIds[sectionIds.length - 1]);
        }
        return;
      }

      // 3. Find the section that intersects best with the top reading boundary
      const sections = sectionIds
        .map((id) => {
          const el = document.getElementById(id);
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          return {
            id,
            top: rect.top,
            bottom: rect.bottom,
            height: rect.height,
          };
        })
        .filter((s): s is { id: string; top: number; bottom: number; height: number } => s !== null);

      if (sections.length === 0) return;

      // Look for the section whose top is at or above the threshold and bottom is below the threshold
      const targetThreshold = offset;
      const currentSection = sections.find(
        (sec) => sec.top <= targetThreshold && sec.bottom > targetThreshold
      );

      if (currentSection) {
        setActiveId(currentSection.id);
        return;
      }

      // Fallback: choose the section closest to the top of the viewport
      let closestSection = sections[0];
      let minDistance = Math.abs(sections[0].top - targetThreshold);

      for (let i = 1; i < sections.length; i++) {
        const distance = Math.abs(sections[i].top - targetThreshold);
        if (distance < minDistance) {
          minDistance = distance;
          closestSection = sections[i];
        }
      }

      if (closestSection) {
        setActiveId(closestSection.id);
      }
    };

    const handleScroll = () => {
      if (!isThrottled) {
        isThrottled = true;
        window.requestAnimationFrame(() => {
          determineActiveSection();
          isThrottled = false;
        });
      }
    };

    // Initial check on mount
    determineActiveSection();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [sectionIds, offset]);

  return activeId;
}
