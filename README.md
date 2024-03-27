# React useScrollPosition hook

Attach the ref to a node, and get the scroll distance as a percentage value at 60fps.

```tsx
import React from "react";
import { useScrollPosition } from "./use-scroll-position";

export default function App() {

  const handlePercentChange = (scrollPercent:number) => {
    ... do what you need with the scroll percent value
  };

  const { ref } = useScrollPosition({
    offsetTop: -0.1,
    offsetBottom: -0.1,
    onChange: handlePercentChange,
  });

  return (
    <section ref={ref}>
      ...
    </section>
  );
}
```