"use client";

import { useEffect, useRef, useState } from "react";

// Cycles through words in place; assistive technology reads the steady label instead.
export default function RotatingWord({ words, label, interval = 2400 }: { words: string[]; label: string; interval?: number }) {
  const [index, setIndex] = useState(0);
  const wordRef = useRef<HTMLSpanElement>(null);
  const turned = useRef(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer = 0;
    function tick() {
      const word = wordRef.current;
      if (word && !motion.matches && !document.hidden) {
        word.animate([{ transform: "translateY(0)", opacity: 1 }, { transform: "translateY(-80%)", opacity: 0 }], { duration: 340, easing: "cubic-bezier(.7, 0, .84, 0)", fill: "forwards" })
          .finished.then(() => { turned.current = true; setIndex(current => (current + 1) % words.length); }, () => {});
      }
      timer = window.setTimeout(tick, interval);
    }
    timer = window.setTimeout(tick, interval);
    return () => window.clearTimeout(timer);
  }, [interval, words.length]);

  useEffect(() => {
    const word = wordRef.current;
    if (!word || !turned.current) return;
    for (const animation of word.getAnimations()) animation.cancel();
    word.animate([{ transform: "translateY(80%)", opacity: 0 }, { transform: "translateY(0)", opacity: 1 }], { duration: 620, easing: "cubic-bezier(.16, 1, .3, 1)" });
  }, [index]);

  return <><span className="sr-only">{label}</span><span aria-hidden="true" className="inline-block overflow-clip align-bottom pb-[.14em] -mb-[.14em]"><span ref={wordRef} className="inline-block">{words[index]}</span></span></>;
}
