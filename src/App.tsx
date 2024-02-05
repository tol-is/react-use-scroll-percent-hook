import React, { useRef, useState } from "react";
import { useScrollPosition } from "./use-scroll-position";
import { normalize } from "./normalize";

import "./styles.css";

export default function App() {
  const percentRef = useRef<HTMLDivElement>(null!);

  const p1Ref = useRef<HTMLParagraphElement>(null!);
  const bar1Ref = useRef<HTMLDivElement>(null!);

  const p2Ref = useRef<HTMLParagraphElement>(null!);
  const bar2Ref = useRef<HTMLDivElement>(null!);

  const p3Ref = useRef<HTMLParagraphElement>(null!);
  const bar3Ref = useRef<HTMLDivElement>(null!);

  const [activeStep, setActiveStep] = useState(-1);

  const steps = 3;
  const step = 1 / steps;

  const handlePercentChange = (scrollPercent:number) => {
    percentRef.current.innerHTML = scrollPercent.toString();

    const p1 = normalize(scrollPercent, step * 0, step * 1);
    const p2 = normalize(scrollPercent, step * 1, step * 2);
    const p3 = normalize(scrollPercent, step * 2, step * 3);

    p1Ref.current.innerHTML = p1.toString();
    bar1Ref.current.style.transform = `scaleX(${p1})`;

    p2Ref.current.innerHTML = p2.toString();
    bar2Ref.current.style.transform = `scaleX(${p2})`;

    p3Ref.current.innerHTML = p3.toString();
    bar3Ref.current.style.transform = `scaleX(${p3})`;

    setActiveStep(Math.min(Math.floor(scrollPercent / (1 / steps)), steps - 1));
  };

  const { ref } = useScrollPosition({
    offsetTop: -0.1,
    offsetBottom: -0.1,
    onChange: handlePercentChange,
  });

  return (
    <main>
      <section ref={ref} style={{ "--steps": steps } as React.CSSProperties}>
        <article>
          <div className="percent" ref={percentRef} />
          <div>
            <p className="par" ref={p1Ref} />
            <div className="bar">
              <div ref={bar1Ref} />
            </div>
            <p className="par" ref={p2Ref} />
            <div className="bar">
              <div ref={bar2Ref} />
            </div>
            <p className="par" ref={p3Ref} />
            <div className="bar">
              <div ref={bar3Ref} />
            </div>
          </div>
          <div className="active">{activeStep}</div>
        </article>
      </section>
    </main>
  );
}
