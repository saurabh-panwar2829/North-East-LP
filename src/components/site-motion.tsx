"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function SiteMotion() {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    // Sections marked data-no-split run their own text entrances.
    const headings = Array.from(document.querySelectorAll<HTMLElement>("main h2, footer h2")).filter(element => !element.closest("[data-no-split]"));
    const eyebrows = Array.from(document.querySelectorAll<HTMLElement>("main .eyebrow, main [class*='-eyebrow'], footer [class*='-eyebrow']")).filter(element => !element.closest(".dgs-campus-hero-hero, [data-no-split]"));
    const frames = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    const route = document.querySelector<SVGPathElement>(".region-art .route-shadow");
    const plane = document.querySelector<SVGSVGElement>(".region-art .route-plane");
    const ticker = document.querySelector<HTMLElement>(".dgs-admission-drive-tickerTrack");
    const heroImage = document.querySelector<HTMLElement>(".dgs-campus-hero-image");
    let observer: IntersectionObserver | undefined;
    let textObserver: IntersectionObserver | undefined;
    let tickerObserver: IntersectionObserver | undefined;
    let lenis: Lenis | undefined;
    let scrollFrame = 0;
    let tickerFrame = 0;
    let tickerX = 0;
    let tickerTime = 0;
    let tickerScroll = window.scrollY;
    const animations = new Set<Animation>();
    const splits: Array<() => void> = [];
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

    const clamp = (value: number) => Math.min(1, Math.max(0, value));

    // Scroll-linked effects: reading progress, the hero photo card, image parallax and the Siliguri → Dehradun flight.
    function updateScroll() {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0;
        const viewport = window.innerHeight;
        const range = document.documentElement.scrollHeight - viewport;
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${range > 0 ? clamp(window.scrollY / range) : 0})`;
        if (preference.matches) return;

        // The full-bleed hero photograph draws in to a rounded card as the page moves on.
        if (heroImage) {
          const shrink = clamp(window.scrollY / (heroImage.offsetHeight * .8));
          heroImage.style.clipPath = `inset(0% ${(shrink * 4).toFixed(2)}% ${(shrink * 9).toFixed(2)}% ${(shrink * 4).toFixed(2)}% round ${(shrink * 28).toFixed(1)}px)`;
          heroImage.style.scale = (1 + shrink * .06).toFixed(4);
        }

        for (const frame of frames) {
          const box = frame.getBoundingClientRect();
          if (box.bottom < -100 || box.top > viewport + 100) continue;
          const image = frame.querySelector<HTMLElement>("img");
          if (!image) continue;
          const offset = Math.max(-1, Math.min(1, (box.top + box.height / 2 - viewport / 2) / viewport));
          image.style.scale = "1.12";
          image.style.translate = `0 ${(offset * -5).toFixed(2)}%`;
        }

        if (route && plane) {
          const art = route.closest<HTMLElement>(".region-art");
          const matrix = route.getScreenCTM();
          if (art && matrix && art.offsetWidth) {
            const box = art.getBoundingClientRect();
            const scale = box.width / art.offsetWidth;
            const progress = clamp((viewport * .92 - box.top) / (viewport * .62));
            const length = route.getTotalLength();
            const point = route.getPointAtLength(progress * length);
            const ahead = route.getPointAtLength(Math.min(length, progress * length + 2));
            const behind = route.getPointAtLength(Math.max(0, progress * length - 2));
            const at = new DOMPoint(point.x, point.y).matrixTransform(matrix);
            const angle = Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180 / Math.PI;
            route.style.strokeDasharray = `${length}`;
            route.style.strokeDashoffset = `${(length * (1 - progress)).toFixed(1)}`;
            plane.style.top = "0";
            plane.style.left = "0";
            plane.style.transform = `translate(${((at.x - box.left) / scale - 14).toFixed(1)}px, ${((at.y - box.top) / scale - 14).toFixed(1)}px) rotate(${(angle + 45).toFixed(1)}deg)`;
          }
        }
      });
    }

    function resetScrollEffects() {
      if (heroImage) { heroImage.style.clipPath = ""; heroImage.style.scale = ""; }
      for (const frame of frames) {
        const image = frame.querySelector<HTMLElement>("img");
        if (image) { image.style.scale = ""; image.style.translate = ""; }
      }
      if (route) { route.style.strokeDasharray = ""; route.style.strokeDashoffset = ""; }
      if (plane) { plane.style.top = ""; plane.style.left = ""; plane.style.transform = ""; }
    }

    // The drive ticker drifts on its own and picks up speed (or reverses) with the scroll.
    function runTicker(time: number) {
      if (!ticker) return;
      const width = (ticker.firstElementChild as HTMLElement | null)?.offsetWidth || 1;
      const elapsed = tickerTime ? Math.min(time - tickerTime, 64) : 16;
      const delta = window.scrollY - tickerScroll;
      tickerTime = time;
      tickerScroll = window.scrollY;
      tickerX = (((tickerX - elapsed * .045 - delta * .4) % width) - width) % width;
      ticker.style.transform = `translate3d(${tickerX.toFixed(1)}px, 0, 0)`;
      tickerFrame = requestAnimationFrame(runTicker);
    }

    function stopTicker() {
      cancelAnimationFrame(tickerFrame);
      tickerFrame = 0;
      tickerTime = 0;
    }

    // Headings split at their authored line breaks; each line rises out of its own mask.
    function splitHeading(heading: HTMLElement) {
      const groups: Node[][] = [[]];
      for (const node of Array.from(heading.childNodes)) {
        if (node instanceof HTMLBRElement) groups.push([]);
        else groups[groups.length - 1].push(node);
      }
      const lines: HTMLElement[] = [];
      for (const group of groups) {
        if (!group.some(node => node.textContent?.trim())) continue;
        const mask = document.createElement("span");
        mask.className = "dgs-line-mask inline-block overflow-clip align-bottom pt-[.04em] pb-[.14em] -mt-[.04em] -mb-[.14em] pl-[.08em] pr-[.08em] -ml-[.08em] -mr-[.08em]";
        const line = document.createElement("span");
        line.className = "dgs-line inline-block";
        heading.insertBefore(mask, group[0]);
        for (const node of group) line.append(node);
        mask.append(line);
        lines.push(line);
      }
      heading.dataset.split = "lines";
      splits.push(() => {
        for (const line of lines) line.parentElement?.replaceWith(...Array.from(line.childNodes));
        delete heading.dataset.split;
      });
      return lines;
    }

    // Eyebrow labels type in letter by letter; screen readers keep the plain text.
    function splitEyebrow(eyebrow: HTMLElement) {
      const text = Array.from(eyebrow.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent?.trim());
      if (!text) return [];
      // Custom inline elements: eyebrow styles treat every direct child <span> as their decorative rule.
      const label = document.createElement("dgs-label");
      label.className = "sr-only";
      label.textContent = text.textContent;
      const visual = document.createElement("dgs-letters");
      visual.setAttribute("aria-hidden", "true");
      const characters: HTMLElement[] = [];
      for (const [index, word] of (text.textContent ?? "").trim().split(/\s+/).entries()) {
        if (index) visual.append(" ");
        const wrapper = document.createElement("span");
        wrapper.className = "inline-block whitespace-nowrap";
        for (const character of word) {
          const glyph = document.createElement("span");
          glyph.className = "inline-block";
          glyph.textContent = character;
          wrapper.append(glyph);
          characters.push(glyph);
        }
        visual.append(wrapper);
      }
      text.replaceWith(label, visual);
      splits.push(() => { label.replaceWith(text); visual.remove(); });
      return characters;
    }

    function playText(element: HTMLElement) {
      if (element.dataset.split === "lines") {
        element.querySelectorAll(".dgs-line").forEach((line, index) => {
          (line as HTMLElement).style.transform = "";
          animate(line, [{ transform: "translateY(115%) rotate(2deg)" }, { transform: "translateY(0) rotate(0)" }], 1150, 60 + index * 130);
        });
      } else {
        element.querySelectorAll<HTMLElement>("dgs-letters > span > span").forEach((glyph, index) => {
          glyph.style.opacity = "";
          animate(glyph, [{ opacity: 0, transform: "translateY(.55em)" }, { opacity: 1, transform: "translateY(0)" }], 650, index * 18);
        });
        const rule = element.firstElementChild as HTMLElement | null;
        if (rule && !rule.textContent && rule.offsetWidth > rule.offsetHeight * 2) animate(rule, [{ transform: "scaleX(0)", transformOrigin: "left" }, { transform: "scaleX(1)", transformOrigin: "left" }], 800);
      }
    }

    // Large images open from a smaller window as they arrive.
    function playFrame(frame: HTMLElement) {
      animate(frame, [{ clipPath: "inset(14% 9% 14% 9% round 8px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)" }], 1300, 80);
    }

    function startSmoothScroll() {
      if (lenis || preference.matches) return;
      lenis = new Lenis({ autoRaf: true, lerp: .09 });
      lenis.on("scroll", updateScroll);
    }

    function stopSmoothScroll() {
      lenis?.destroy();
      lenis = undefined;
    }

    function anchorClick(event: MouseEvent) {
      if (!lenis || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href^='#']") : null;
      const hash = link?.getAttribute("href");
      const target = hash && hash.length > 1 ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { duration: 1.25 });
      history.pushState(null, "", hash);
    }

    function setup() {
      observer?.disconnect();
      textObserver?.disconnect();
      tickerObserver?.disconnect();
      stopTicker();
      if (preference.matches) for (const animation of animations) animation.cancel();
      for (const element of elements) delete element.dataset.revealState;
      while (splits.length) splits.pop()?.();
      if (preference.matches) {
        stopSmoothScroll();
        resetScrollEffects();
        if (ticker) ticker.style.transform = "";
        return;
      }
      startSmoothScroll();
      if (!("IntersectionObserver" in window)) return;

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

      textObserver = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const target = entry.target as HTMLElement;
          if (target.matches("[data-parallax]")) playFrame(target); else playText(target);
          textObserver?.unobserve(target);
        }
      }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });

      const below = (element: HTMLElement) => element.getBoundingClientRect().top > window.innerHeight * .9;
      for (const heading of headings) {
        if (!below(heading)) continue;
        for (const line of splitHeading(heading)) line.style.transform = "translateY(115%)";
        textObserver.observe(heading);
      }
      for (const eyebrow of eyebrows) {
        if (!below(eyebrow)) continue;
        for (const glyph of splitEyebrow(eyebrow)) glyph.style.opacity = "0";
        textObserver.observe(eyebrow);
      }
      for (const frame of frames) if (below(frame) && !frame.closest(".dgs-campus-hero-hero")) textObserver.observe(frame);

      if (ticker) {
        tickerObserver = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting && !tickerFrame) tickerFrame = requestAnimationFrame(runTicker);
          else if (!entry.isIntersecting) stopTicker();
        });
        tickerObserver.observe(ticker);
      }
      updateScroll();
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
    updateScroll();
    const changes = new MutationObserver(records => {
      for (const record of records) {
        if (record.type === "attributes" && record.target instanceof HTMLElement) {
          const target = record.target;
          if (record.attributeName === "open" && target instanceof HTMLDialogElement) {
            // Pause smooth scrolling behind open dialogs so only the dialog scrolls.
            if (document.querySelector("dialog[open]")) lenis?.stop(); else lenis?.start();
            if (target.open) animate(target, [{ opacity: 0, transform: "translateY(14px) scale(.98)" }, { opacity: 1, transform: "translateY(0) scale(1)" }], 350);
          } else if (record.attributeName === "hidden" && !target.hidden && target.matches('[role="region"], [role="tabpanel"], #school-life-details')) enter(target, 5);
        }
        for (const node of record.addedNodes) {
          if (node instanceof HTMLElement && node.id === "mobile-menu") enter(node, -5, 230);
        }
      }
      updateScroll();
    });
    changes.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["open", "hidden"] });
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll);
    preference.addEventListener("change", setup);
    document.addEventListener("focusin", revealFocused);
    document.addEventListener("click", anchorClick);
    return () => {
      observer?.disconnect();
      textObserver?.disconnect();
      tickerObserver?.disconnect();
      changes.disconnect();
      stopTicker();
      stopSmoothScroll();
      for (const animation of animations) animation.cancel();
      while (splits.length) splits.pop()?.();
      resetScrollEffects();
      cancelAnimationFrame(scrollFrame);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
      preference.removeEventListener("change", setup);
      document.removeEventListener("focusin", revealFocused);
      document.removeEventListener("click", anchorClick);
      for (const element of elements) delete element.dataset.revealState;
    };
  }, []);

  return <div ref={progressRef} className="scroll-progress pointer-events-none fixed inset-x-0 top-0 z-60 h-0.5 origin-left scale-x-0 bg-[linear-gradient(90deg,#a98746,#e7c781)] motion-reduce:hidden print:hidden" aria-hidden="true" />;
}
