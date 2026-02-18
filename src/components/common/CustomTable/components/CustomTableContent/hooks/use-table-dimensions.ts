import { useRef, useState, useEffect, useMemo } from "react";
import { Table as TanstackTable } from "@tanstack/react-table";

interface UseTableDimensionsParams<TData> {
  table: TanstackTable<TData>;
  scrollX?: number;
}

export function useTableDimensions<TData>({ table, scrollX }: UseTableDimensionsParams<TData>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerRealWidth, setContainerRealWidth] = useState<number | null>(null);
  const previousWidthRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const totalColumnsWidth = useMemo(() => {
    return table.getAllColumns().reduce((sum, column) => sum + column.getSize(), 0);
  }, [table]);

  const shouldExpandColumns = Boolean(
    scrollX && containerRealWidth && scrollX > containerRealWidth
  );

  const tableWidth = shouldExpandColumns
    ? scrollX || totalColumnsWidth
    : Math.max(containerRealWidth || 0, totalColumnsWidth);

  useEffect(() => {
    const measureContainer = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const nextWidth = Math.round(rect.width);
        if (previousWidthRef.current === nextWidth) return;

        previousWidthRef.current = nextWidth;
        setContainerRealWidth(nextWidth);
      }
    };

    const scheduleMeasure = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(measureContainer);
    };

    measureContainer();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof globalThis !== "undefined" && globalThis.ResizeObserver) {
      resizeObserver = new ResizeObserver(scheduleMeasure);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }
    }

    globalThis.addEventListener("resize", scheduleMeasure);

    return () => {
      resizeObserver?.disconnect();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      globalThis.removeEventListener("resize", scheduleMeasure);
    };
  }, []);

  return {
    containerRef,
    containerRealWidth,
    totalColumnsWidth,
    shouldExpandColumns,
    tableWidth,
  };
}
