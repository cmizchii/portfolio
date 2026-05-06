import { useEffect, useRef, useState } from 'react';

type Tag = { text: string; color: string; top: string; left: string };
type Viewport = { width: number; height: number };

const tags: Tag[] = [
  { text: 'INTERACTIVE DESIGN', color: '#FF8862', top: '4%',   left: '6.3%' },
  { text: 'USER FRIENDLY',      color: '#BBA0FF', top: '4.5%', left: '33%' },
  { text: 'CLEAR PATH',          color: '#5DDDC8', top: '3%',   left: '76.4%' },
  { text: 'FIGMA',               color: '#A5D9FF', top: '7%',   left: '92.4%' },
  { text: 'SEAMLESS UX',         color: '#D87BD0', top: '13%',  left: '70.8%' },
  { text: 'AUTO LAYOUT',         color: '#B5E287', top: '24%',  left: '13.9%' },
  { text: 'MINIMALISM',          color: '#88E8A6', top: '30%',  left: '4.2%' },
  { text: 'RESPONSIVE DESIGN',   color: '#FFCC8A', top: '26%',  left: '86.1%' },
  { text: 'INTUITION',           color: '#7DCFFF', top: '46%',  left: '16.7%' },
  { text: 'FLOW',                color: '#C2EE76', top: '43%',  left: '76.4%' },
  { text: 'PERSONA',             color: '#B0EB80', top: '60%',  left: '27.8%' },
  { text: 'WHAT MATTERS',        color: '#EE6FAF', top: '63%',  left: '88.9%' },
  { text: 'DESIGN SYSTEMS',      color: '#FFA858', top: '72%',  left: '6.6%' },
  { text: 'HIERARCHY',           color: '#D7E885', top: '78%',  left: '16.3%' },
  { text: 'WIREFRAMING',         color: '#7DC9E5', top: '80%',  left: '48.6%' },
  { text: 'END-TO-END',          color: '#BFE268', top: '76%',  left: '75.4%' },
  { text: 'PRECISION',           color: '#65DAD0', top: '88%',  left: '88.9%' },
  { text: 'CLEAN UI',            color: '#D7A2FF', top: '92%',  left: '25.7%' },
  { text: 'PROTOTYPING',         color: '#B96FE0', top: '95%',  left: '60.4%' },
];

const CARD_W = 300;
const CARD_H = 400;
const TEXT_PAD_L = 22;
const TEXT_PAD_T = 20;
const LINE_COLOR = '#2a2a2a';
const BUMP_RADIUS = 130;
const BUMP_STRENGTH = 32;
const SCROLL_DISTANCE_VH = 556;
const SCROLL_SMOOTHING = 0.14;
const SCROLL_SETTLE_THRESHOLD = 0.0005;
const CARD_START = 0.08;
const CARD_END = 0.58;
const HERO_TEXT_END = 0.18;
const LINE_FADE_START = 0.5;
const LINE_FADE_END = 0.65;
const TAG_MOVE_START_BASE = 0.08;
const TAG_MOVE_START_SPAN = 0.16;
const TAG_MOVE_END_BASE = 0.66;
const TAG_MOVE_END_SPAN = 0.04;
const TAG_FADE_START = 0.45;
const TAG_FADE_END = 0.75;
const SECOND_APPEAR_START = 0.41;
const SECOND_OPACITY_END = 0.52;
const SECOND_BLUR_END = 0.48;

const getViewport = (): Viewport => ({
  width: typeof window === 'undefined' ? 1440 : window.innerWidth,
  height: typeof window === 'undefined' ? 900 : window.innerHeight,
});

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (from: number, to: number, progress: number) => from + (to - from) * progress;
const progressBetween = (value: number, start: number, end: number) =>
  clamp((value - start) / (end - start));
const easeInOut = (value: number) =>
  value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
const easeOut = (value: number) => 1 - Math.pow(1 - value, 3);
const percentValue = (value: string) => Number.parseFloat(value);

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [viewport, setViewport] = useState<Viewport>(() => getViewport());
  const scrollRef = useRef<HTMLElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const animatedProgressRef = useRef(0);

  useEffect(() => {
    let measureFrame = 0;
    let smoothFrame = 0;

    const resetBumps = () => {
      const root = rootRef.current;
      if (!root) return;
      root.querySelectorAll<HTMLElement>('.bump-tag').forEach((el) => {
        el.style.setProperty('--bump-x', '0px');
        el.style.setProperty('--bump-y', '0px');
      });
    };

    const animateProgress = () => {
      smoothFrame = 0;
      const targetProgress = targetProgressRef.current;
      const currentProgress = animatedProgressRef.current;
      const delta = targetProgress - currentProgress;
      const nextProgress =
        Math.abs(delta) < SCROLL_SETTLE_THRESHOLD
          ? targetProgress
          : currentProgress + delta * SCROLL_SMOOTHING;

      animatedProgressRef.current = nextProgress;
      setScrollProgress((current) =>
        Math.abs(current - nextProgress) > SCROLL_SETTLE_THRESHOLD ? nextProgress : current,
      );

      if (nextProgress !== targetProgress) {
        smoothFrame = requestAnimationFrame(animateProgress);
      }
    };

    const requestSmooth = () => {
      if (smoothFrame) return;
      smoothFrame = requestAnimationFrame(animateProgress);
    };

    const updateScroll = () => {
      measureFrame = 0;
      const section = scrollRef.current;
      if (!section) return;

      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const scrollRange = Math.max(1, section.offsetHeight - window.innerHeight);
      const nextProgress = clamp((window.scrollY - sectionTop) / scrollRange);
      const nextViewport = getViewport();

      targetProgressRef.current = nextProgress;
      scrollProgressRef.current = nextProgress;
      if (nextProgress > 0.02) resetBumps();

      setViewport((current) =>
        current.width === nextViewport.width && current.height === nextViewport.height
          ? current
          : nextViewport,
      );
      requestSmooth();
    };

    const requestUpdate = () => {
      if (measureFrame) return;
      measureFrame = requestAnimationFrame(updateScroll);
    };

    requestUpdate();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      cancelAnimationFrame(measureFrame);
      cancelAnimationFrame(smoothFrame);
    };
  }, []);

  useEffect(() => {
    let mx = -9999;
    let my = -9999;
    let frame = 0;

    const update = () => {
      const root = rootRef.current;
      if (!root) return;
      const els = root.querySelectorAll<HTMLElement>('.bump-tag');
      els.forEach((el) => {
        if (scrollProgressRef.current > 0.02) {
          el.style.setProperty('--bump-x', '0px');
          el.style.setProperty('--bump-y', '0px');
          return;
        }

        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = mx - cx;
        const dy = my - cy;
        const dist = Math.hypot(dx, dy);
        if (dist < BUMP_RADIUS && dist > 0) {
          const force = (BUMP_RADIUS - dist) / BUMP_RADIUS;
          const eased = force * force;
          const pushX = (-dx / dist) * eased * BUMP_STRENGTH;
          const pushY = (-dy / dist) * eased * BUMP_STRENGTH;
          el.style.setProperty('--bump-x', `${pushX.toFixed(2)}px`);
          el.style.setProperty('--bump-y', `${pushY.toFixed(2)}px`);
        } else {
          el.style.setProperty('--bump-x', '0px');
          el.style.setProperty('--bump-y', '0px');
        }
      });
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <main
      ref={scrollRef}
      className="relative bg-[#0c0c0c]"
      style={{ minHeight: `${SCROLL_DISTANCE_VH}vh` }}
    >
      <div ref={rootRef} className="sticky top-0 h-screen w-full overflow-hidden bg-[#0c0c0c]">
        <Lines progress={scrollProgress} viewport={viewport} />

        <Card progress={scrollProgress} viewport={viewport} />
        <CornerSquare side="tl" color="#B85AC8" progress={scrollProgress} viewport={viewport} />
        <CornerSquare side="tr" color="#EE6FAF" progress={scrollProgress} viewport={viewport} />
        <CornerSquare side="bl" color="#5DDDC8" progress={scrollProgress} viewport={viewport} />
        <CornerSquare side="br" color="#FFA858" progress={scrollProgress} viewport={viewport} />

        <HeroText progress={scrollProgress} viewport={viewport} />

        <SecondScreen progress={scrollProgress} />

        {tags.map((tag, i) => (
          <FloatingTag key={tag.text} {...tag} index={i} progress={scrollProgress} />
        ))}
      </div>
    </main>
  );
}

function FloatingTag({
  text,
  color,
  top,
  left,
  index,
  progress,
}: Tag & { index: number; progress: number }) {
  const floatDelay = (index * 0.37) % 4;
  const floatDur = 4 + ((index * 1.13) % 3);
  const tilt = ((index % 5) - 2) * 0.6;

  const moveStart = TAG_MOVE_START_BASE + ((index * 0.317) % TAG_MOVE_START_SPAN);
  const moveEnd = TAG_MOVE_END_BASE + ((index * 0.21) % TAG_MOVE_END_SPAN);
  const rawMoveProgress = progressBetween(progress, moveStart, moveEnd);
  const moveProgress = easeInOut(rawMoveProgress);
  const fadeProgress = easeOut(progressBetween(rawMoveProgress, TAG_FADE_START, TAG_FADE_END));
  const topPercent = lerp(percentValue(top), 50, moveProgress);
  const leftPercent = lerp(percentValue(left), 50, moveProgress);
  const centerOffset = lerp(0, -50, moveProgress);
  const scale = lerp(1, 0.55, moveProgress);
  const transitionIdle =
    'transform 320ms cubic-bezier(0.22, 1, 0.36, 1), top 0.6s ease-out, left 0.6s ease-out, opacity 0.5s ease-out, filter 0.5s ease-out';

  return (
    <div
      className="bump-tag absolute z-50"
      style={{
        top: `${topPercent}%`,
        left: `${leftPercent}%`,
        transform:
          rawMoveProgress <= 0.001
            ? 'translate3d(var(--bump-x, 0px), var(--bump-y, 0px), 0)'
            : `translate(${centerOffset}%, ${centerOffset}%) scale(${scale})`,
        opacity: 1 - fadeProgress,
        filter: `blur(${lerp(0, 18, fadeProgress)}px)`,
        transition: rawMoveProgress <= 0.001 ? transitionIdle : 'none',
      }}
    >
      <div
        className="float-tag select-none whitespace-nowrap px-[10px] py-[4px] text-[11px] font-bold uppercase tracking-[0.04em] text-black"
        style={
          {
            backgroundColor: color,
            '--delay': `${-floatDelay}s`,
            '--dur': `${floatDur}s`,
            '--tilt': `${tilt}deg`,
          } as React.CSSProperties
        }
      >
        {text}
      </div>
    </div>
  );
}

function Lines({ progress, viewport }: { progress: number; viewport: Viewport }) {
  const lineProgress = easeInOut(progressBetween(progress, CARD_START, CARD_END));
  const opacity = 1 - easeOut(progressBetween(progress, LINE_FADE_START, LINE_FADE_END));
  const leftEdge = lerp(viewport.width / 2 - CARD_W / 2, 0, lineProgress);
  const rightEdge = lerp(viewport.width / 2 + CARD_W / 2, viewport.width - 1, lineProgress);
  const topEdge = lerp(viewport.height / 2 - CARD_H / 2, 0, lineProgress);
  const bottomEdge = lerp(viewport.height / 2 + CARD_H / 2, viewport.height - 1, lineProgress);

  return (
    <>
      <div
        className="absolute inset-y-0 z-0 w-px"
        style={{ left: leftEdge, backgroundColor: LINE_COLOR, opacity }}
      />
      <div
        className="absolute inset-y-0 z-0 w-px"
        style={{ left: rightEdge, backgroundColor: LINE_COLOR, opacity }}
      />
      <div
        className="absolute inset-x-0 z-0 h-px"
        style={{ top: topEdge, backgroundColor: LINE_COLOR, opacity }}
      />
      <div
        className="absolute inset-x-0 z-0 h-px"
        style={{ top: bottomEdge, backgroundColor: LINE_COLOR, opacity }}
      />
    </>
  );
}

function Card({ progress, viewport }: { progress: number; viewport: Viewport }) {
  const cardProgress = easeInOut(progressBetween(progress, CARD_START, CARD_END));
  const w = lerp(CARD_W, viewport.width, cardProgress);
  const h = lerp(CARD_H, viewport.height, cardProgress);
  const left = lerp(viewport.width / 2 - CARD_W / 2, 0, cardProgress);
  const top = lerp(viewport.height / 2 - CARD_H / 2, 0, cardProgress);

  return (
    <div
      className="absolute z-30 bg-white"
      style={{
        width: w,
        height: h,
        left,
        top,
        willChange: 'width, height, left, top',
      }}
    />
  );
}

function HeroText({ progress, viewport }: { progress: number; viewport: Viewport }) {
  const fadeProgress = easeOut(progressBetween(progress, 0, HERO_TEXT_END));
  return (
    <div
      className="pointer-events-none absolute text-[18px] font-medium leading-[1.25] tracking-[-0.01em] text-black"
      style={{
        zIndex: 35,
        left: viewport.width / 2 - CARD_W / 2 + TEXT_PAD_L,
        top: viewport.height / 2 - CARD_H / 2 + TEXT_PAD_T,
        opacity: 1 - fadeProgress,
        transform: `translateY(${lerp(0, 8, fadeProgress)}px)`,
      }}
    >
      <p>Have an idea?</p>
      <p>I will make it real.</p>
    </div>
  );
}

function CornerSquare({
  side,
  color,
  progress,
  viewport,
}: {
  side: 'tl' | 'tr' | 'bl' | 'br';
  color: string;
  progress: number;
  viewport: Viewport;
}) {
  const size = 18;
  const moveProgress = easeInOut(progressBetween(progress, CARD_START, CARD_END));
  const fadeProgress = easeOut(progressBetween(progress, LINE_FADE_START, LINE_FADE_END));
  const startLeft = side.endsWith('l')
    ? viewport.width / 2 - CARD_W / 2 - size
    : viewport.width / 2 + CARD_W / 2;
  const endLeft = side.endsWith('l') ? -size : viewport.width;
  const startTop = side.startsWith('t')
    ? viewport.height / 2 - CARD_H / 2 - size
    : viewport.height / 2 + CARD_H / 2;
  const endTop = side.startsWith('t') ? -size : viewport.height;
  const left = lerp(startLeft, endLeft, moveProgress);
  const top = lerp(startTop, endTop, moveProgress);
  return (
    <div
      className="absolute z-30"
      style={{
        width: size,
        height: size,
        left,
        top,
        backgroundColor: color,
        opacity: 1 - fadeProgress,
      }}
    />
  );
}

function SecondScreen({ progress }: { progress: number }) {
  const opacityProgress = easeOut(progressBetween(progress, SECOND_APPEAR_START, SECOND_OPACITY_END));
  const blurProgress = easeOut(progressBetween(progress, SECOND_APPEAR_START, SECOND_BLUR_END));
  return (
    <div
      className="pointer-events-none absolute inset-0 z-40 flex flex-col items-center justify-center px-6"
      style={{
        opacity: opacityProgress,
        filter: `blur(${lerp(28, 0, blurProgress)}px)`,
        willChange: 'opacity, filter',
      }}
    >
      <div className="mb-7 inline-block bg-black px-3 py-[6px] text-[12px] font-bold uppercase tracking-[0.06em] text-white">
        UX/UI DESIGNER &amp; FRONT-END DEV
      </div>
      <h1 className="max-w-[920px] text-center text-[44px] font-bold leading-[1.18] tracking-[-0.015em] text-black">
        Designing interfaces that feel
        <br />
        right &mdash; clean, human, intentional.
      </h1>
    </div>
  );
}
