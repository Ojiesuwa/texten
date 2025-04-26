"use client";

import { useEffect } from "react";

export function useResponsiveDimensions(
  divRef: React.RefObject<HTMLDivElement>,
  setDivWidth: (width: number) => void,
  setScreenWidth: (width: number) => void
) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      setScreenWidth(window.screen.width);
    }

    const resizeObserver = new ResizeObserver(() => {
      if (divRef.current) {
        setDivWidth(divRef.current.clientWidth);
      }
    });

    if (divRef.current) {
      resizeObserver.observe(divRef.current);
    }

    // Cleanup
    return () => {
      resizeObserver.disconnect();
    };
  }, [divRef, setDivWidth, setScreenWidth]);
}
