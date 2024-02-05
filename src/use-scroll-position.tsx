import { useCallback, useEffect, useRef } from "react";

import { useInView, useIsomorphicLayoutEffect } from "@react-spring/web";

import { toPrecision } from "./precision";

type Bounds = { top: number; height: number; viewport: number };

export type UseScrollPositionProps = {
  /**
   * The offset from the top of the section to trigger the callback. Represents a percentage of the viewport height.
   *
   * @defaultValue 0
   */
  offsetTop?: number;
  /**
   * The offset from the bottom of the section to trigger the callback. Represents a percentage of the viewport height.
   *
   * @defaultValue 0
   */
  offsetBottom?: number;
  /**
   * The precision of the percentage position.
   *
   * @defaultValue 3
   */
  precision?: number;
  /**
   * The callback to be called when the percentage position changes. The percentage position is a number between 0 and 1.
   */
  onChange: (scrollPercent: number) => void;
};

export const useScrollPosition = (props: UseScrollPositionProps) => {
  const { offsetTop = 0, offsetBottom = 0, precision = 3, onChange } = props;

  const [ref, inView] = useInView();
  const enabledRef = useRef<boolean>(false);
  const rafRef = useRef<number>(0);
  const scrollYRef = useRef<number>(-1);
  const boundsRef = useRef<Bounds>({ top: 0, height: 0, viewport: 0 });

  const animate = useCallback(() => {
    const scrollY = window.scrollY;
    if (scrollY !== scrollYRef.current) {
      const { top, height, viewport } = boundsRef.current;

      const adjustedTop = top - offsetTop * viewport;
      const adjustedBottom = top + height - (1 - offsetBottom) * viewport;

      let percentage;

      if (scrollY < adjustedTop) {
        // Above the container
        percentage = 0;
      } else if (scrollY > adjustedBottom) {
        // below the container
        percentage = 1;
      } else {
        // compute percentage position
        percentage = toPrecision(
          (scrollY - adjustedTop) / (adjustedBottom - adjustedTop),
          precision
        );
      }

      onChange && onChange(percentage);
      scrollYRef.current = window.scrollY;
    }

    if (enabledRef.current === true) {
      rafRef.current = requestAnimationFrame(animate);
    }
  }, [props]);

  const getSectionBounds = useCallback(() => {
    const viewportHeight = window.innerHeight;
    const sectionHeight = ref.current.offsetHeight;
    const sectionTop = ref.current.offsetTop;
    boundsRef.current = {
      top: sectionTop,
      height: sectionHeight,
      viewport: viewportHeight,
    };
  }, [ref]);

  useEffect(() => {
    if (inView) {
      getSectionBounds();
      enabledRef.current = true;
      rafRef.current = requestAnimationFrame(animate);
    } else {
      enabledRef.current = false;
      cancelAnimationFrame(rafRef.current);
    }
    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [inView, animate, getSectionBounds]);

  useIsomorphicLayoutEffect(() => {
    if (typeof window === "undefined") return;

    window.addEventListener("resize", getSectionBounds);
    return () => {
      window.removeEventListener("resize", getSectionBounds);
    };
  }, []);

  useEffect(() => {
    return () => {
      enabledRef.current = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return { ref };
};
