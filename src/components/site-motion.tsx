"use client";

import { useEffect, useRef } from "react";

export default function SiteMotion() {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    let observer: IntersectionObserver | undefined;
    let progressFrame = 0;
    const animations = new Set<Animation>();
    const ease = "cubic-bezier(.16, 1, .3, 1)";

    function animate(element: Element, frames: Keyframe[], duration: number, delay = 0) {
      if (preference.matches) return;
      const animation = element.animate(frames, { duration, delay, easing: ease, fill: "backwards" });
      animations.add(animation);
      animation.finished.then(() => animations.delete(animation), () => animations.delete(animation));
    }

    function enter(element: Element, distance = 13, duration = 350, delay = 0) {
      animate(element, [{ opacity: 0, transform: `translateY(${distance}px)` }, { opacity: 1, transform: "translateY(0)" }], duration, delay);
    }

    function updateProgress() {
      if (progressFrame) return;
      progressFrame = requestAnimationFrame(() => {
        progressFrame = 0;
        const range = document.documentElement.scrollHeight - window.innerHeight;
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0})`;
      });
    }

    // Browser-native entrances preserve motion without a custom CSS keyframe sheet.
    function heroEntrance() {
      const image = document.querySelector(".dgs-campus-hero-image");
      if (image) animate(image, [{ transform: "scale(1.035)" }, { transform: "scale(1)" }], 1800);
      document.querySelectorAll(".dgs-campus-hero-titleText").forEach((element, index) => {
        animate(element, [{ opacity: 0, transform: "translateY(75%)", filter: "blur(3px)" }, { opacity: 1, transform: "translateY(0)", filter: "blur(0)" }], 1050, 160 + index * 160);
      });
      for (const [name, duration, delay] of [["eyebrow", 700, 60], ["description", 850, 440], ["recognition", 900, 550], ["actions", 800, 680], ["familyNote", 750, 770], ["campusCaption", 850, 820]] as const) {
        const element = document.querySelector(`.dgs-campus-hero-${name}`);
        if (element) enter(element, 13, duration, delay);
      }
    }

    function setup() {
      observer?.disconnect();
      if (preference.matches) for (const animation of animations) animation.cancel();
      for (const element of elements) delete element.dataset.revealState;
      if (preference.matches || !("IntersectionObserver" in window)) return;

      observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.revealState = "visible";
          observer?.unobserve(entry.target);
        }
      }, { threshold: 0.08, rootMargin: "0px 0px -32px 0px" });

      for (const element of elements) {
        // Keep the initial viewport and restored anchor destinations visible.
        if (element.getBoundingClientRect().top < window.innerHeight * .92) continue;
        element.dataset.revealState = "pending";
        observer.observe(element);
      }
    }

    function revealFocused(event: FocusEvent) {
      if (!(event.target instanceof Element)) return;
      for (const animation of animations) {
        const target = (animation.effect as KeyframeEffect | null)?.target;
        if (target instanceof Element && target.contains(event.target)) animation.cancel();
      }
      const element = event.target.closest<HTMLElement>("[data-reveal]");
      if (element) { element.dataset.revealState = "visible"; observer?.unobserve(element); }
    }

    setup();
    heroEntrance();
    updateProgress();
    const changes = new MutationObserver(records => {
      for (const record of records) {
        if (record.type === "attributes" && record.target instanceof HTMLElement) {
          const target = record.target;
          if (record.attributeName === "open" && target instanceof HTMLDialogElement && target.open) {
            animate(target, [{ opacity: 0, transform: "translateY(14px) scale(.98)" }, { opacity: 1, transform: "translateY(0) scale(1)" }], 350);
          } else if (record.attributeName === "hidden" && !target.hidden && target.matches('[role="region"], [role="tabpanel"], #school-life-details')) enter(target, 5);
        }
        for (const node of record.addedNodes) {
          if (node instanceof HTMLElement && node.id === "mobile-menu") enter(node, -5, 230);
        }
      }
      updateProgress();
    });
    changes.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["open", "hidden"] });
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    preference.addEventListener("change", setup);
    document.addEventListener("focusin", revealFocused);
    return () => {
      observer?.disconnect();
      changes.disconnect();
      for (const animation of animations) animation.cancel();
      cancelAnimationFrame(progressFrame);
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
      preference.removeEventListener("change", setup);
      document.removeEventListener("focusin", revealFocused);
      for (const element of elements) delete element.dataset.revealState;
    };
  }, []);

  return <div ref={progressRef} className="scroll-progress pointer-events-none fixed inset-x-0 top-0 z-60 h-0.5 origin-left scale-x-0 bg-[linear-gradient(90deg,#a98746,#e7c781)] motion-reduce:hidden print:hidden" aria-hidden="true" />;
}
