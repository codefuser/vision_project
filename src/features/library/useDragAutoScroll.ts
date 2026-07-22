import { useEffect, RefObject } from "react";

export function useDragAutoScroll(ref: RefObject<HTMLElement | null>, speed = 10, threshold = 60) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let scrollInterval: NodeJS.Timeout | null = null;
    let scrollDirection = 0;

    const startScroll = () => {
      if (scrollInterval) return;
      scrollInterval = setInterval(() => {
        if (el) el.scrollTop += scrollDirection * speed;
      }, 16); // roughly 60fps
    };

    const stopScroll = () => {
      if (scrollInterval) {
        clearInterval(scrollInterval);
        scrollInterval = null;
      }
    };

    const handleDragOver = (e: DragEvent) => {
      const rect = el.getBoundingClientRect();
      const relativeY = e.clientY - rect.top;

      if (relativeY < threshold) {
        scrollDirection = -1;
        startScroll();
      } else if (rect.height - relativeY < threshold) {
        scrollDirection = 1;
        startScroll();
      } else {
        stopScroll();
      }
    };

    const handleDragLeave = () => stopScroll();
    const handleDrop = () => stopScroll();

    el.addEventListener("dragover", handleDragOver);
    el.addEventListener("dragleave", handleDragLeave);
    el.addEventListener("drop", handleDrop);

    return () => {
      stopScroll();
      el.removeEventListener("dragover", handleDragOver);
      el.removeEventListener("dragleave", handleDragLeave);
      el.removeEventListener("drop", handleDrop);
    };
  }, [ref, speed, threshold]);
}
