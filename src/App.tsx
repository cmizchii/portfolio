import { useEffect, useRef, useState } from 'react';
import shimMemojiVideo from '../images/memoji.mov';

type Tag = { text: string; color: string; top: string; left: string };
type Viewport = { width: number; height: number };
type CursorTag = { id: number; x: number; y: number; tagIndex: number; rotation: number };
type Project = {
  id: string;
  title: string;
  year: string;
  description: string;
  accent: string;
  position: React.CSSProperties;
  focusOffset?: { xVw: number; yVh: number };
  start: number;
  end: number;
};
type ProjectMotion = {
  riseStart: number;
  riseEnd: number;
  enterDistance: number;
  exitStart: number;
  exitEnd: number;
  exitDistance: number;
  driftSpeed: number;
  driftOffset: number;
  driftStart: number;
  driftEnd: number;
  xAmplitude: number;
  floatAmplitude: number;
  exitX: number;
  transitionMs: number;
  opacityMs: number;
};

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
const APPLE_FONT_STACK =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', Inter, system-ui, sans-serif";
const BUMP_RADIUS = 130;
const BUMP_STRENGTH = 32;
const SCROLL_DISTANCE_VH = 286;
const SCROLL_SMOOTHING = 0.14;
const SCROLL_SETTLE_THRESHOLD = 0.0005;
const CARD_START = 0.08;
const CARD_END = 0.74;
const HERO_TEXT_END = 0.29;
const LINE_FADE_START = 0.64;
const LINE_FADE_END = 0.82;
const TAG_MOVE_START_BASE = 0.08;
const TAG_MOVE_START_SPAN = 0.16;
const TAG_MOVE_END_BASE = 0.78;
const TAG_MOVE_END_SPAN = 0.04;
const TAG_FADE_START = 0.45;
const TAG_FADE_END = 0.75;
const SECOND_APPEAR_START = 0.54;
const SECOND_OPACITY_END = 0.72;
const SECOND_BLUR_END = 0.7;
const SECOND_EXIT_START = 0.81;
const SECOND_EXIT_BLUR_START = 0.842;
const SECOND_EXIT_END = 0.97;
const CURSOR_TRAIL_START = SECOND_OPACITY_END;
const CURSOR_TRAIL_END = SECOND_EXIT_START;
const CURSOR_TRAIL_DISTANCE = 34;
const CURSOR_TRAIL_INTERVAL = 70;
const CURSOR_TRAIL_LIFETIME = 920;
const CURSOR_TRAIL_LIMIT = 16;
const ABOUT_TEXT_PARTS = ['im', 'shim', 'a', 'designer', 'who', 'also', 'codes'];
const ABOUT_TEXT_REVEAL_STARTS = [0.08, 0.14, 0.3, 0.38, 0.48, 0.57, 0.66];
const ABOUT_VIDEO_REVEAL_START = 0.22;
const ABOUT_VIDEO_SCROLL_START = 0.02;
const ABOUT_VIDEO_SCROLL_END = 0.92;
const projectMotionProfiles: ProjectMotion[] = [
  {
    riseStart: 0.02,
    riseEnd: 0.18,
    enterDistance: 72,
    exitStart: 0.48,
    exitEnd: 0.78,
    exitDistance: -96,
    driftSpeed: 0.84,
    driftOffset: 0.06,
    driftStart: 14,
    driftEnd: -20,
    xAmplitude: 0.46,
    floatAmplitude: 3.5,
    exitX: -3.2,
    transitionMs: 820,
    opacityMs: 560,
  },
  {
    riseStart: 0.02,
    riseEnd: 0.21,
    enterDistance: 66,
    exitStart: 0.51,
    exitEnd: 0.8,
    exitDistance: -82,
    driftSpeed: 1.08,
    driftOffset: -0.02,
    driftStart: 20,
    driftEnd: -32,
    xAmplitude: 0.3,
    floatAmplitude: 5,
    exitX: 2.4,
    transitionMs: 960,
    opacityMs: 680,
  },
  {
    riseStart: 0.03,
    riseEnd: 0.27,
    enterDistance: 80,
    exitStart: 0.64,
    exitEnd: 0.91,
    exitDistance: -88,
    driftSpeed: 0.72,
    driftOffset: 0.12,
    driftStart: 12,
    driftEnd: -24,
    xAmplitude: 0.58,
    floatAmplitude: 4.2,
    exitX: 1.6,
    transitionMs: 760,
    opacityMs: 620,
  },
  {
    riseStart: 0.04,
    riseEnd: 0.3,
    enterDistance: 90,
    exitStart: 0.7,
    exitEnd: 1,
    exitDistance: -74,
    driftSpeed: 1.18,
    driftOffset: -0.1,
    driftStart: 24,
    driftEnd: -40,
    xAmplitude: 0.36,
    floatAmplitude: 5.6,
    exitX: -1.7,
    transitionMs: 1040,
    opacityMs: 720,
  },
  {
    riseStart: 0.03,
    riseEnd: 0.24,
    enterDistance: 76,
    exitStart: 0.66,
    exitEnd: 0.94,
    exitDistance: -104,
    driftSpeed: 0.96,
    driftOffset: 0.02,
    driftStart: 18,
    driftEnd: -30,
    xAmplitude: 0.42,
    floatAmplitude: 4.8,
    exitX: 2.9,
    transitionMs: 900,
    opacityMs: 640,
  },
  {
    riseStart: 0.025,
    riseEnd: 0.22,
    enterDistance: 84,
    exitStart: 0.64,
    exitEnd: 0.9,
    exitDistance: -78,
    driftSpeed: 0.8,
    driftOffset: 0.09,
    driftStart: 16,
    driftEnd: -28,
    xAmplitude: 0.52,
    floatAmplitude: 4,
    exitX: -2.5,
    transitionMs: 840,
    opacityMs: 600,
  },
  {
    riseStart: 0.045,
    riseEnd: 0.28,
    enterDistance: 92,
    exitStart: 0.72,
    exitEnd: 0.98,
    exitDistance: -92,
    driftSpeed: 1.12,
    driftOffset: -0.06,
    driftStart: 22,
    driftEnd: -38,
    xAmplitude: 0.34,
    floatAmplitude: 5.4,
    exitX: 2,
    transitionMs: 1000,
    opacityMs: 700,
  },
  {
    riseStart: 0.055,
    riseEnd: 0.32,
    enterDistance: 98,
    exitStart: 0.76,
    exitEnd: 1,
    exitDistance: -70,
    driftSpeed: 1.24,
    driftOffset: -0.14,
    driftStart: 28,
    driftEnd: -44,
    xAmplitude: 0.28,
    floatAmplitude: 5.8,
    exitX: -2,
    transitionMs: 1080,
    opacityMs: 760,
  },
];
const aboutDetails = [
  'I build interfaces around how people actually move.',
  'Research, structure, visual polish, and front-end thinking stay connected from the first idea to the final interaction.',
  'The goal is simple: make the next step feel clear, human, and intentional.',
];

const projects: Project[] = [
  {
    id: '01',
    title: 'Lemonmade',
    year: '2026',
    description: 'Meeting flow concept with fast room setup, clear invites, and calm controls.',
    accent: '#8fc7ff',
    position: { left: '-10vw', top: '18%', width: 'min(24vw, 330px)', height: 'min(28vw, 350px)' },
    focusOffset: { xVw: 13, yVh: 0 },
    start: -0.04,
    end: 0.18,
  },
  {
    id: '02',
    title: 'Inside Botanics',
    year: '2025',
    description: 'Editorial product page with quiet spacing, ingredient storytelling, and soft motion.',
    accent: '#d8f26a',
    position: { right: '-4vw', top: '13%', width: 'min(21vw, 305px)', height: 'min(27vw, 355px)' },
    focusOffset: { xVw: -13, yVh: 0 },
    start: -0.03,
    end: 0.2,
  },
  {
    id: '03',
    title: 'Augen Lab',
    year: '2025',
    description: 'Experimental landing page with atmospheric visuals and a focused product path.',
    accent: '#bba0ff',
    position: { left: '39%', top: '-8%', width: 'min(18vw, 260px)', height: 'min(15vw, 218px)' },
    focusOffset: { xVw: 0, yVh: 12 },
    start: -0.02,
    end: 0.22,
  },
  {
    id: '04',
    title: 'Future Fit',
    year: '2024',
    description: 'Fitness dashboard exploration for scanning workouts, progress, and daily goals.',
    accent: '#ff9f72',
    position: { right: '18%', top: '72%', width: 'min(21vw, 315px)', height: 'min(16vw, 235px)' },
    focusOffset: { xVw: 0, yVh: -4 },
    start: -0.01,
    end: 0.24,
  },
  {
    id: '05',
    title: 'Signal Grid',
    year: '2024',
    description: 'System interface study with modular panels, comparison states, and visual hierarchy.',
    accent: '#5dddc8',
    position: { left: '14vw', top: '72%', width: 'min(18vw, 255px)', height: 'min(14vw, 205px)' },
    focusOffset: { xVw: 1, yVh: -6 },
    start: 0,
    end: 0.26,
  },
];

const decorativeProjects: Project[] = [
  {
    id: '06',
    title: 'Orbit',
    year: '2023',
    description: '',
    accent: '#e7e7e7',
    position: { left: '7%', top: '-20%', width: 'min(17vw, 245px)', height: 'min(13vw, 190px)' },
    start: -0.06,
    end: 0.2,
  },
  {
    id: '07',
    title: 'Halo',
    year: '2023',
    description: '',
    accent: '#f2b8ff',
    position: { right: '-11vw', top: '43%', width: 'min(19vw, 270px)', height: 'min(17vw, 240px)' },
    start: -0.04,
    end: 0.24,
  },
  {
    id: '08',
    title: 'Field',
    year: '2022',
    description: '',
    accent: '#bdebdc',
    position: { right: '28%', bottom: '-23%', width: 'min(21vw, 300px)', height: 'min(18vw, 250px)' },
    start: -0.02,
    end: 0.28,
  },
];

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
const easeSoft = (value: number) => {
  const clamped = clamp(value);

  return clamped * clamped * clamped * (clamped * (clamped * 6 - 15) + 10);
};
const getProjectMotion = (index: number) => projectMotionProfiles[index % projectMotionProfiles.length];
const percentValue = (value: string) => Number.parseFloat(value);
const getHexChannels = (hex: string) => {
  const normalizedHex = hex.replace('#', '');

  return {
    red: Number.parseInt(normalizedHex.slice(0, 2), 16),
    green: Number.parseInt(normalizedHex.slice(2, 4), 16),
    blue: Number.parseInt(normalizedHex.slice(4, 6), 16),
  };
};
const getDarkerTagTextColor = (hex: string) => {
  const { red, green, blue } = getHexChannels(hex);
  const intensity = 0.46;
  const saturationBoost = 1.35;
  const average = (red + green + blue) / 3;
  const boostChannel = (channel: number) =>
    clamp(Math.round((average + (channel - average) * saturationBoost) * intensity), 0, 150);

  return `rgb(${boostChannel(red)}, ${boostChannel(green)}, ${boostChannel(blue)})`;
};

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [viewport, setViewport] = useState<Viewport>(() => getViewport());
  const [cursorTags, setCursorTags] = useState<CursorTag[]>([]);
  const scrollRef = useRef<HTMLElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const animatedProgressRef = useRef(0);
  const cursorTagIdRef = useRef(0);
  const lastCursorTagRef = useRef({ x: -9999, y: -9999, time: 0 });
  const cursorTagTimeoutsRef = useRef<number[]>([]);

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

    const addCursorTag = (x: number, y: number) => {
      const progress = scrollProgressRef.current;
      if (progress < CURSOR_TRAIL_START || progress > CURSOR_TRAIL_END) return;

      const now = window.performance.now();
      const last = lastCursorTagRef.current;
      const distance = Math.hypot(x - last.x, y - last.y);
      if (distance < CURSOR_TRAIL_DISTANCE && now - last.time < CURSOR_TRAIL_INTERVAL) return;

      const id = cursorTagIdRef.current;
      cursorTagIdRef.current += 1;
      lastCursorTagRef.current = { x, y, time: now };

      setCursorTags((current) => [
        ...current.slice(-(CURSOR_TRAIL_LIMIT - 1)),
        {
          id,
          x,
          y,
          tagIndex: id % tags.length,
          rotation: ((id % 9) - 4) * 1.8,
        },
      ]);

      const timeout = window.setTimeout(() => {
        setCursorTags((current) => current.filter((tag) => tag.id !== id));
        cursorTagTimeoutsRef.current = cursorTagTimeoutsRef.current.filter(
          (timeoutId) => timeoutId !== timeout,
        );
      }, CURSOR_TRAIL_LIFETIME);

      cursorTagTimeoutsRef.current.push(timeout);
    };

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
      addCursorTag(mx, my);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(frame);
      cursorTagTimeoutsRef.current.forEach((timeout) => window.clearTimeout(timeout));
      cursorTagTimeoutsRef.current = [];
    };
  }, []);

  return (
    <>
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
          <CursorTagTrail points={cursorTags} progress={scrollProgress} />

          {tags.map((tag, i) => (
            <FloatingTag key={tag.text} {...tag} index={i} progress={scrollProgress} />
          ))}
        </div>
      </main>

      <ProjectsSection />
    </>
  );
}

function CursorTagTrail({ points, progress }: { points: CursorTag[]; progress: number }) {
  const enterProgress = easeOut(progressBetween(progress, CURSOR_TRAIL_START, CURSOR_TRAIL_START + 0.06));
  const exitProgress = easeOut(progressBetween(progress, CURSOR_TRAIL_END, SECOND_EXIT_END));
  const opacity = enterProgress * (1 - exitProgress);

  if (points.length === 0) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[65]"
      style={{
        opacity,
        transition: 'opacity 180ms ease',
        willChange: 'opacity',
      }}
      aria-hidden="true"
    >
      {points.map((point) => {
        const tag = tags[point.tagIndex % tags.length];

        return (
          <div
            key={point.id}
            className="cursor-tag-ink absolute select-none whitespace-nowrap px-[10px] py-[4px] text-[11px] font-bold uppercase tracking-[0.04em]"
            style={
              {
                left: `${point.x}px`,
                top: `${point.y}px`,
                backgroundColor: tag.color,
                color: getDarkerTagTextColor(tag.color),
                fontFamily: "'Familjen Grotesk', Inter, system-ui, sans-serif",
                '--ink-rotate': `${point.rotation}deg`,
              } as React.CSSProperties
            }
          >
            {tag.text}
          </div>
        );
      })}
    </div>
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
        className="float-tag select-none whitespace-nowrap px-[10px] py-[4px] text-[11px] font-bold uppercase tracking-[0.04em]"
        style={
          {
            backgroundColor: color,
            color: getDarkerTagTextColor(color),
            fontFamily: "'Familjen Grotesk', Inter, system-ui, sans-serif",
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
      className="pointer-events-none absolute text-[18px] font-semibold leading-[1.25] tracking-[-0.01em] text-black"
      style={{
        zIndex: 35,
        left: viewport.width / 2 - CARD_W / 2 + TEXT_PAD_L,
        top: viewport.height / 2 - CARD_H / 2 + TEXT_PAD_T,
        opacity: 1 - fadeProgress,
        transform: `translateY(${lerp(0, 8, fadeProgress)}px)`,
        fontFamily: APPLE_FONT_STACK,
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
  const exitProgress = easeSoft(progressBetween(progress, SECOND_EXIT_START, SECOND_EXIT_END));
  const exitBlurProgress = easeSoft(progressBetween(progress, SECOND_EXIT_BLUR_START, SECOND_EXIT_END));
  return (
    <div
      className="pointer-events-none absolute inset-0 z-40 flex flex-col items-center justify-center px-6"
      style={{
        opacity: opacityProgress * (1 - exitProgress),
        filter: `blur(${lerp(28, 0, blurProgress) + lerp(0, 24, exitBlurProgress)}px)`,
        transform: `translateY(${-lerp(0, 20, exitProgress)}px)`,
        willChange: 'opacity, filter, transform',
      }}
    >
      <div
        className="mb-7 inline-block bg-black px-3 py-[6px] text-[12px] font-bold uppercase tracking-[0.06em] text-white"
        style={{ fontFamily: "'Familjen Grotesk', Inter, system-ui, sans-serif" }}
      >
        UX/UI DESIGNER &amp; FRONT-END DEV
      </div>
      <h1
        className="max-w-[920px] text-center text-[44px] font-semibold leading-[1.18] tracking-[-0.015em] text-black"
        style={{ fontFamily: APPLE_FONT_STACK }}
      >
        Designing interfaces that feel
        <br />
        right &mdash; clean, human, intentional.
      </h1>
    </div>
  );
}

function ProjectsSection() {
  const [projectProgress, setProjectProgress] = useState(0);
  const [aboutProgress, setAboutProgress] = useState(0);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const projectStageRef = useRef<HTMLDivElement>(null);
  const aboutStageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const getStageProgress = (stage: HTMLElement | null) => {
      if (!stage) return 0;

      const stageTop = stage.getBoundingClientRect().top + window.scrollY;
      const scrollRange = Math.max(1, stage.offsetHeight - window.innerHeight);

      return clamp((window.scrollY - stageTop) / scrollRange);
    };

    const update = () => {
      frame = 0;
      const nextProjectProgress = getStageProgress(projectStageRef.current);
      const nextAboutProgress = getStageProgress(aboutStageRef.current);

      setProjectProgress((current) =>
        Math.abs(current - nextProjectProgress) > 0.001 ? nextProjectProgress : current,
      );
      setAboutProgress((current) =>
        Math.abs(current - nextAboutProgress) > 0.001 ? nextAboutProgress : current,
      );
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    requestUpdate();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      cancelAnimationFrame(frame);
    };
  }, []);

  const sceneEnterProgress = easeSoft(progressBetween(projectProgress, 0, 0.2));
  const introFocusBlur = activeProject ? 4 : 0;
  const introHoverOpacity = activeProject ? 0.72 : 1;
  const introExitProgress = easeInOut(progressBetween(projectProgress, 0.57, 0.81));
  const introExitFadeProgress = easeSoft(progressBetween(projectProgress, 0.67, 0.84));
  const introBlur = lerp(18, 0, sceneEnterProgress) + lerp(0, 20, introExitProgress);
  const introY = lerp(44, 0, sceneEnterProgress) + lerp(0, -72, introExitProgress);
  const introOpacity = sceneEnterProgress * (1 - introExitFadeProgress) * introHoverOpacity;
  const activeIndex = activeProject ? projects.findIndex((project) => project.id === activeProject) : -1;
  const activeFocusOffset = activeIndex >= 0 ? projects[activeIndex].focusOffset : undefined;

  const updateActiveProject = (clientX: number, clientY: number) => {
    const section = sectionRef.current;
    if (!section) return;

    let closestProject: string | null = null;
    let closestDistance = Number.POSITIVE_INFINITY;

    section.querySelectorAll<HTMLElement>('.project-card').forEach((card) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.hypot(clientX - centerX, clientY - centerY);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestProject = card.dataset.projectId ?? null;
      }
    });

    setActiveProject(closestDistance < 280 ? closestProject : null);
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-white text-black"
      aria-label="Selected projects and about"
    >
      <div ref={projectStageRef} className="relative h-[460vh]">
        <div
          className="sticky top-0 h-screen overflow-hidden"
          onMouseMove={(event) => updateActiveProject(event.clientX, event.clientY)}
          onMouseLeave={() => setActiveProject(null)}
        >
          <div
            className="absolute inset-0"
            style={{
              willChange: 'opacity, transform',
            }}
          >
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 z-40 w-[min(86vw,560px)] -translate-x-1/2 -translate-y-1/2 text-center"
              style={{
                opacity: introOpacity,
                filter: `blur(${introBlur + introFocusBlur}px)`,
                transform: `translate3d(-50%, calc(-50% + ${introY}px), 0)`,
                transition: 'filter 260ms ease, opacity 260ms ease, transform 640ms cubic-bezier(0.22, 1, 0.36, 1)',
                willChange: 'opacity, filter, transform',
              }}
            >
              <h2
                className="text-[clamp(48px,7vw,82px)] font-medium leading-none tracking-[0]"
                style={{
                  fontFamily: APPLE_FONT_STACK,
                }}
              >
                MY WORK
              </h2>
              <p
                className="mx-auto mt-8 max-w-[390px] text-[18px] leading-[1.35] text-[#626262]"
              >
                From research to final pixel, every project here is a full design process, not just a
                pretty screen.
              </p>
            </div>

            <div className="absolute inset-0 z-20">
              {decorativeProjects.map((project, index) => (
                <DecorativeProjectCard
                  key={project.id}
                  project={project}
                  index={index + projects.length}
                  progress={projectProgress}
                  activeProject={activeProject}
                />
              ))}

              {projects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  progress={projectProgress}
                  activeProject={activeProject}
                  activeIndex={activeIndex}
                  activeFocusOffset={activeFocusOffset}
                  onFocusProject={setActiveProject}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="h-[21vh]" aria-hidden="true" />

      <div ref={aboutStageRef} className="relative h-[560vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <AboutContent progress={aboutProgress} />
        </div>
      </div>
    </section>
  );
}

function AboutContent({ progress }: { progress: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoWrapRef = useRef<HTMLSpanElement>(null);
  const videoFrameRef = useRef(0);
  const videoTargetTimeRef = useRef(0);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const horizontalProgress = progressBetween(progress, 0, 0.92);
  const verticalProgress = easeInOut(progressBetween(progress, 0.2, 0.94));
  const detailsProgress = easeOut(progressBetween(progress, 0.66, 0.88));
  const videoRevealProgress = easeOut(
    progressBetween(horizontalProgress, ABOUT_VIDEO_REVEAL_START, ABOUT_VIDEO_REVEAL_START + 0.16),
  );
  const videoScrollProgress = easeInOut(
    progressBetween(horizontalProgress, ABOUT_VIDEO_SCROLL_START, ABOUT_VIDEO_SCROLL_END),
  );

  useEffect(() => {
    const video = videoRef.current;
    const videoWrap = videoWrapRef.current;
    if (!video || !videoWrap) return;

    video.pause();

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVideoVisible(Boolean(entry?.isIntersecting));
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.02 },
    );

    observer.observe(videoWrap);

    return () => {
      observer.disconnect();
      video.pause();
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const setTargetTime = () => {
      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      if (!duration) return false;

      videoTargetTimeRef.current = duration * videoScrollProgress;
      return true;
    };

    const smoothToTarget = () => {
      videoFrameRef.current = 0;
      video.pause();

      if (!isVideoVisible) return;

      const targetTime = videoTargetTimeRef.current;
      const delta = targetTime - video.currentTime;

      if (Math.abs(delta) < 0.018) {
        video.currentTime = targetTime;
        return;
      }

      video.currentTime += delta * 0.18;
      videoFrameRef.current = requestAnimationFrame(smoothToTarget);
    };

    const requestSmooth = () => {
      cancelAnimationFrame(videoFrameRef.current);

      if (isVideoVisible && setTargetTime()) {
        videoFrameRef.current = requestAnimationFrame(smoothToTarget);
      } else {
        video.pause();
      }
    };

    requestSmooth();
    video.addEventListener('loadedmetadata', requestSmooth);

    return () => {
      video.removeEventListener('loadedmetadata', requestSmooth);
      cancelAnimationFrame(videoFrameRef.current);
    };
  }, [isVideoVisible, videoScrollProgress]);

  return (
    <div className="pointer-events-none absolute inset-0 z-50 px-5" aria-label="About">
      <div
        className="absolute left-1/2 top-1/2 flex -translate-y-1/2 items-center gap-[0.22em] whitespace-nowrap text-[clamp(48px,7.4vw,120px)] font-medium leading-none tracking-[0]"
        aria-label="im shim, a designer who also codes"
        style={{
          fontFamily: APPLE_FONT_STACK,
          transform: `translate3d(calc(-50% + ${lerp(142, -78, horizontalProgress)}vw), calc(-50% - ${lerp(0, 35, verticalProgress)}vh), 0) rotate(${lerp(-1.8, 0.8, horizontalProgress)}deg)`,
          willChange: 'transform',
        }}
      >
        {ABOUT_TEXT_PARTS.map((word, wordIndex) => {
          const wordRevealStart = ABOUT_TEXT_REVEAL_STARTS[wordIndex] ?? 0.72;

          return (
            <span key={`${word}-${wordIndex}`} className="inline-flex items-center gap-[0.22em]" aria-hidden="true">
              <span className="inline-flex">
                {Array.from(word).map((letter, letterIndex) => {
                  const letterRevealStart = wordRevealStart + letterIndex * 0.018;
                  const letterProgress = easeOut(
                    progressBetween(horizontalProgress, letterRevealStart, letterRevealStart + 0.14),
                  );
                  const fromTop = (wordIndex + letterIndex) % 2 === 0;
                  const yStart = fromTop ? -135 : 135;
                  const rotateStart = fromTop ? -8 : 8;

                  return (
                    <span
                      key={`${word}-${letter}-${letterIndex}`}
                      className="inline-block"
                      style={{
                        opacity: letterProgress,
                        filter: `blur(${lerp(10, 0, letterProgress)}px)`,
                        transform: `translate3d(0, ${lerp(yStart, 0, letterProgress)}%, 0) rotate(${lerp(rotateStart, 0, letterProgress)}deg)`,
                        willChange: 'opacity, filter, transform',
                      }}
                    >
                      {letter}
                    </span>
                  );
                })}
              </span>

              {wordIndex === 1 ? (
                <span
                  ref={videoWrapRef}
                  className="inline-flex h-[2.55em] w-[1.2em] translate-y-[0.06em] items-center justify-center overflow-hidden"
                  style={{
                    opacity: videoRevealProgress,
                    filter: `blur(${lerp(12, 0, videoRevealProgress)}px)`,
                    transform: `translate3d(0, ${lerp(72, 0, videoRevealProgress)}%, 0) scale(${lerp(0.76, 1, videoRevealProgress)})`,
                    willChange: 'opacity, filter, transform',
                  }}
                  >
                  <video
                    ref={videoRef}
                    src={shimMemojiVideo}
                    className="h-[282%] w-[305%] -translate-x-[2.5%] -translate-y-[1%] object-contain"
                    muted
                    playsInline
                    preload="auto"
                    aria-hidden="true"
                  />
                </span>
              ) : null}
            </span>
          );
        })}
      </div>

      <div
        className="absolute left-1/2 top-[55%] w-[min(84vw,760px)] -translate-x-1/2 text-center"
        style={{
          opacity: detailsProgress,
          transform: `translate3d(-50%, ${lerp(58, 0, detailsProgress)}px, 0)`,
          willChange: 'opacity, transform',
        }}
      >
        {aboutDetails.map((line, index) => {
          const lineProgress = easeOut(progressBetween(progress, 0.68 + index * 0.055, 0.82 + index * 0.055));

          return (
            <p
              key={line}
              className={index === 0 ? 'text-[clamp(24px,3vw,44px)] font-semibold leading-[1.05] tracking-[0]' : 'mx-auto mt-6 max-w-[620px] text-[clamp(16px,1.45vw,22px)] font-medium leading-[1.35] tracking-[0] text-[#555]'}
              style={{
                opacity: lineProgress,
                filter: `blur(${lerp(8, 0, lineProgress)}px)`,
                transform: `translateY(${lerp(32, 0, lineProgress)}px)`,
                willChange: 'opacity, filter, transform',
              }}
            >
              {line}
            </p>
          );
        })}
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  index,
  progress,
  activeProject,
  activeIndex,
  activeFocusOffset,
  onFocusProject,
}: {
  project: Project;
  index: number;
  progress: number;
  activeProject: string | null;
  activeIndex: number;
  activeFocusOffset?: { xVw: number; yVh: number };
  onFocusProject: (id: string | null) => void;
}) {
  const motion = getProjectMotion(index);
  const sectionEnterProgress = easeSoft(progressBetween(progress, 0, 0.2));
  const riseProgress = easeOut(progressBetween(progress, motion.riseStart, motion.riseEnd));
  const exitProgress = easeInOut(progressBetween(progress, motion.exitStart, motion.exitEnd));
  const exitFadeProgress = easeSoft(progressBetween(progress, motion.exitStart + 0.1, motion.exitEnd));
  const isActive = activeProject === project.id;
  const isDimmed = activeProject !== null && !isActive;
  const galleryDrift = easeInOut(clamp(progress * motion.driftSpeed + motion.driftOffset));
  const lift = lerp(motion.enterDistance, 0, riseProgress) + lerp(0, motion.exitDistance, exitProgress);
  const parallaxY = lerp(motion.driftStart, motion.driftEnd, galleryDrift);
  const parallaxX =
    Math.sin(progress * Math.PI * (1.08 + motion.driftSpeed * 0.2) + index * 0.7) *
      motion.xAmplitude +
    lerp(0, motion.exitX, exitProgress);
  const opacity = sectionEnterProgress * (1 - exitFadeProgress);
  const scrollBlur = lerp(18, 0, sectionEnterProgress) + lerp(0, 22, exitProgress);
  const focusScale = isActive ? 1.045 : 1;
  const distanceFromActive = activeIndex >= 0 ? Math.abs(index - activeIndex) : 0;
  const activeShiftX = isActive ? project.focusOffset?.xVw ?? 0 : 0;
  const activeShiftY = isActive ? project.focusOffset?.yVh ?? 0 : 0;
  const fieldFollow = isDimmed ? 0.32 + ((index % 3) * 0.11) + distanceFromActive * 0.05 : 0;
  const proximityShiftX = lerp(0, activeFocusOffset?.xVw ?? 0, fieldFollow);
  const proximityShiftY = lerp(0, activeFocusOffset?.yVh ?? 0, fieldFollow);
  const floatY =
    Math.sin(progress * Math.PI * (2.6 + motion.driftSpeed) + index * 0.85) *
    motion.floatAmplitude;

  return (
    <article
      tabIndex={0}
      data-project-id={project.id}
      onFocus={() => onFocusProject(project.id)}
      onBlur={() => onFocusProject(null)}
      className="project-card absolute outline-none"
      style={{
        ...project.position,
        zIndex: isActive ? 30 : 12 + index,
        opacity,
        transform: `translate3d(calc(${parallaxX}vw + ${proximityShiftX + activeShiftX}vw), calc(${lift + activeShiftY}vh + ${parallaxY + proximityShiftY + floatY}px), 0) scale(${focusScale})`,
        transition:
          `filter 520ms cubic-bezier(0.22, 1, 0.36, 1), transform ${motion.transitionMs}ms cubic-bezier(0.22, 1, 0.36, 1), opacity ${motion.opacityMs}ms ease-out`,
        filter: `blur(${Math.max(scrollBlur, isDimmed ? 8 : 0)}px)`,
      }}
    >
      <div
        className="relative h-full overflow-hidden bg-white shadow-[0_18px_60px_rgba(0,0,0,0.08)]"
        style={{
          filter: `${isActive ? 'grayscale(0)' : 'grayscale(1)'} ${isDimmed ? 'contrast(0.82) brightness(1.06)' : 'contrast(0.94) brightness(1.02)'}`,
          transition:
            'filter 520ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 520ms cubic-bezier(0.22, 1, 0.36, 1)',
          boxShadow: isActive
            ? '0 28px 90px rgba(0,0,0,0.18)'
            : '0 18px 60px rgba(0,0,0,0.08)',
        }}
      >
        <ProjectPlaceholder project={project} index={index} />
      </div>

      <div
        className="mt-4 grid grid-cols-[44px_1fr] gap-x-4 text-black"
        style={{
          opacity: isActive ? 1 : 0,
          transform: `translateY(${isActive ? 0 : -8}px)`,
          transition: `opacity ${motion.opacityMs}ms ease, transform ${motion.transitionMs}ms cubic-bezier(0.22, 1, 0.36, 1)`,
        }}
      >
        <div className="text-[15px] leading-none text-[#555]">{project.id}</div>
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-[18px] font-medium leading-none tracking-[0]">{project.title}</h3>
            <div className="text-[12px] leading-none text-[#777]">{project.year}</div>
          </div>
        </div>
      </div>
    </article>
  );
}

function DecorativeProjectCard({
  project,
  index,
  progress,
  activeProject,
}: {
  project: Project;
  index: number;
  progress: number;
  activeProject: string | null;
}) {
  const motion = getProjectMotion(index);
  const sectionEnterProgress = easeSoft(progressBetween(progress, 0, 0.2));
  const riseProgress = easeOut(progressBetween(progress, motion.riseStart, motion.riseEnd));
  const exitProgress = easeInOut(progressBetween(progress, motion.exitStart, motion.exitEnd));
  const exitFadeProgress = easeSoft(progressBetween(progress, motion.exitStart + 0.1, motion.exitEnd));
  const galleryDrift = easeInOut(clamp(progress * motion.driftSpeed + motion.driftOffset));
  const lift = lerp(motion.enterDistance + 6, 0, riseProgress) + lerp(0, motion.exitDistance, exitProgress);
  const parallaxY = lerp(motion.driftStart + 8, motion.driftEnd - 10, galleryDrift);
  const parallaxX =
    Math.sin(progress * Math.PI * (1.18 + motion.driftSpeed * 0.22) + index * 0.6) *
      (motion.xAmplitude + 0.12) +
    lerp(0, motion.exitX, exitProgress);
  const floatY =
    Math.sin(progress * Math.PI * (2.9 + motion.driftSpeed) + index * 0.72) *
    (motion.floatAmplitude + 0.8);
  const opacity = sectionEnterProgress * (1 - exitFadeProgress) * (activeProject ? 0.42 : 0.7);
  const scrollBlur = lerp(18, 0, sectionEnterProgress) + lerp(0, 22, exitProgress);

  return (
    <div
      className="pointer-events-none absolute"
      style={{
        ...project.position,
        zIndex: 4 + index,
        opacity,
        transform: `translate3d(${parallaxX}vw, calc(${lift}vh + ${parallaxY + floatY}px), 0)`,
        filter: `blur(${Math.max(scrollBlur, activeProject ? 10 : 0)}px)`,
        transition: `filter 320ms ease, transform ${motion.transitionMs}ms cubic-bezier(0.22, 1, 0.36, 1), opacity ${motion.opacityMs}ms ease-out`,
      }}
      aria-hidden="true"
    >
      <div
        className="relative h-full overflow-hidden bg-white shadow-[0_18px_60px_rgba(0,0,0,0.06)]"
        style={{
          filter: 'grayscale(1) contrast(0.8) brightness(1.08)',
        }}
      >
        <ProjectPlaceholder project={project} index={index} />
      </div>
    </div>
  );
}

function ProjectPlaceholder({ project, index }: { project: Project; index: number }) {
  const lineCount = index % 2 === 0 ? 4 : 3;

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        background: `linear-gradient(135deg, #ffffff 0%, #f2f2f0 45%, ${project.accent} 140%)`,
      }}
    >
      <div className="absolute left-[7%] right-[7%] top-[7%] flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.08em] text-[#8a8a8a]">
        <span>{project.title}</span>
        <span>{project.year}</span>
      </div>

      <div
        className="absolute rounded-full opacity-80 blur-[2px]"
        style={{
          width: '44%',
          aspectRatio: '1 / 1',
          left: `${18 + index * 4}%`,
          top: `${22 + (index % 3) * 7}%`,
          background: `radial-gradient(circle at 35% 30%, #ffffff 0%, ${project.accent} 48%, #111111 130%)`,
        }}
      />
      <div
        className="absolute rounded-[999px] bg-black/70"
        style={{
          width: '34%',
          height: '7%',
          left: index % 2 === 0 ? '54%' : '12%',
          top: index % 2 === 0 ? '49%' : '58%',
        }}
      />
      <div
        className="absolute rounded-[999px] bg-white/90"
        style={{
          width: '28%',
          height: '6%',
          left: index % 2 === 0 ? '10%' : '58%',
          top: index % 2 === 0 ? '74%' : '28%',
          boxShadow: '0 10px 28px rgba(0,0,0,0.08)',
        }}
      />

      <div className="absolute bottom-[10%] left-[8%] right-[8%]">
        <div className="mb-5 h-px w-full bg-black/10" />
        {Array.from({ length: lineCount }).map((_, lineIndex) => (
          <div
            key={lineIndex}
            className="mb-2 h-[6px] rounded-full bg-black/[0.12]"
            style={{ width: `${82 - lineIndex * 14}%` }}
          />
        ))}
      </div>

      <div className="absolute bottom-[7%] right-[7%] text-[11px] text-[#606060]">
        @{project.id}
      </div>
    </div>
  );
}
