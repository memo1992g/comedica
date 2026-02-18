import { useRef, useState, useCallback, useEffect } from "react";

interface UseScrollSyncParams {
  rowsLength: number;
}

export function useScrollSync({ rowsLength }: UseScrollSyncParams) {
  const isSyncingRef = useRef(false);
  const headerScrollRef = useRef<HTMLDivElement>(null);
  const bodyScrollRef = useRef<HTMLDivElement>(null);

  const [scrollbarWidth, setScrollbarWidth] = useState<number>(0);
  const [isScrollAtEnd, setIsScrollAtEnd] = useState<boolean>(false);

  const measureScrollbarWidth = useCallback(() => {
    if (bodyScrollRef.current) {
      const element = bodyScrollRef.current;
      const hasVerticalScrollbar = element.scrollHeight > element.clientHeight;
      if (hasVerticalScrollbar) {
        setScrollbarWidth(element.offsetWidth - element.clientWidth);
      } else {
        setScrollbarWidth(0);
      }
    }
  }, []);

  const checkScrollPosition = useCallback(() => {
    if (bodyScrollRef.current) {
      const element = bodyScrollRef.current;
      const isAtEnd =
        Math.abs(
          element.scrollLeft + element.clientWidth - element.scrollWidth
        ) <= 5;
      setIsScrollAtEnd(isAtEnd);
    }
  }, []);

  const syncScroll = useCallback(
    (source: "header" | "body", scrollLeft: number) => {
      const header = headerScrollRef.current;
      const body = bodyScrollRef.current;
      if (!header || !body) return;

      if (isSyncingRef.current) return;
      isSyncingRef.current = true;

      const target = source === "header" ? body : header;
      if (Math.abs(target.scrollLeft - scrollLeft) > 1) {
        target.scrollLeft = scrollLeft;
      }

      requestAnimationFrame(() => {
        isSyncingRef.current = false;
        checkScrollPosition();
      });
    },
    [checkScrollPosition]
  );

  // Medir scrollbar cuando cambian los datos
  useEffect(() => {
    const timer = setTimeout(() => {
      measureScrollbarWidth();
      checkScrollPosition();
    }, 100);
    return () => clearTimeout(timer);
  }, [rowsLength, measureScrollbarWidth, checkScrollPosition]);

  return {
    headerScrollRef,
    bodyScrollRef,
    scrollbarWidth,
    isScrollAtEnd,
    syncScroll,
  };
}
