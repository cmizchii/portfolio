import { useEffect, useRef, useState } from 'react';
import shimMemojiVideo from '../images/memoji.mp4';
import whosBlankHtml from './whosBlank.html?raw';
import cosmeticsGrowthHtml from './cosmeticsGrowth.html?raw';
import portfolioCaseHtml from './portfolioCase.html?raw';

type Tag = { text: string; color: string; top: string; left: string };
type Viewport = { width: number; height: number };
type CursorTag = { id: number; x: number; y: number; tagIndex: number; rotation: number };
type Project = {
  id: string;
  title: string;
  year: string;
  description: string;
  accent: string;
  thumb?: string;
  thumbType?: 'phone' | 'desktop';
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
const capabilityCards = [
  {
    eyebrow: 'Experience',
    title: '3 years in, still obsessed.',
    text: 'From first flow to final screen, I keep structure, visuals, and interaction details connected. Every project gets the same energy.',
    visual: '03',
    visualColor: '#ff8862',
    visualSize: 'clamp(50px,4.7vw,72px)',
  },
  {
    eyebrow: 'Availability',
    title: 'Worldwide. Async. Actually replies.',
    text: "Remote-friendly and comfortable moving between design and browser decisions. Time zones haven't stopped me yet.",
    visual: '∞',
    visualColor: '#b5e287',
    visualSize: 'clamp(58px,5.2vw,78px)',
  },
  {
    eyebrow: 'Detail',
    title: 'I notice before you say anything.',
    text: "Spacing, timing, hierarchy, state - the tiny things no one names but everyone feels. That's where I spend the extra time.",
    visual: 'px',
    visualColor: '#5dddc8',
    visualSize: 'clamp(52px,4.9vw,74px)',
  },
  {
    eyebrow: 'Front-End Feel',
    title: 'What you see is what gets built.',
    text: 'I write the code too - so nothing gets watered down in handoff. Responsiveness, motion, and hover states are part of the design.',
    visual: '</>',
    visualColor: '#bba0ff',
    visualSize: 'clamp(46px,4.2vw,64px)',
  },
];
const ABOUT_CARD_LAYOUTS = [
  { x: -1.8, y: 9, rotate: -1.8, drift: -18 },
  { x: -0.6, y: -3, rotate: 1.4, drift: -7 },
  { x: 0.8, y: 7, rotate: -0.9, drift: 9 },
  { x: 2, y: -5, rotate: 1.9, drift: 19 },
];
const serviceItems = [
  {
    number: '01',
    title: 'UX/UI Design',
    type: 'design',
    description:
      'Full visual design of your product or website - screens, components, spacing, the works. You get something that looks intentional, not just assembled.',
    tags: ['Figma', 'design systems', 'auto layout', 'responsive design'],
  },
  {
    number: '02',
    title: 'Prototyping',
    type: 'design',
    description:
      'Clickable, interactive prototypes you can actually test and share before writing a single line of code. Great for validating ideas early or impressing stakeholders.',
    tags: ['Figma prototypes', 'user flows', 'interaction design'],
  },
  {
    number: '03',
    title: 'Front-End Development',
    type: 'code',
    description:
      'I build the designs myself, so the final product actually matches what was designed. No lost details, no awkward dev handoff conversations.',
    tags: ['HTML/CSS', 'React', 'Webflow', 'Framer'],
  },
  {
    number: '04',
    title: 'UX Audit',
    type: 'review',
    description:
      "Already have something live but it feels off? I'll go through your product with fresh eyes, flag what's hurting the experience, and tell you exactly what to fix first.",
    tags: ['heuristic review', 'usability', 'hierarchy', 'UX fixes'],
  },
  {
    number: '05',
    title: 'Design + Code (end-to-end)',
    type: 'both',
    description:
      "The full package: I design it and I build it. One person, one vision all the way through. Best for smaller teams or founders who don't want to manage a designer and a dev separately.",
    tags: ['from idea to live', 'one point of contact', 'fast iteration'],
  },
];
const questionItems = [
  {
    question: 'Are you a one-person studio or... just one person?',
    answer:
      'Just me. You talk to me, I do the work, you get the file. Though I do have a playlist for every project phase, if that counts.',
  },
  {
    question: 'I only have a rough idea. Is that enough to start?',
    answer:
      "More than enough. A vague vision + a few references you like is a fine starting point. I'll ask the right questions to shape it from there.",
  },
  {
    question: 'How long will this actually take?',
    answer:
      "Depends on scope - I'll always give you a real timeline upfront. Deadlines are a love language. Landing page: 1-2 weeks. Full product: 4-6 weeks.",
  },
  {
    question: 'Do you just design, or can you build it too?',
    answer:
      'Both. I design it and build it! What you see in Figma is what actually ends up in the browser.',
  },
  {
    question: 'How much does it cost?',
    answer:
      "Fixed project pricing - quote upfront, no surprises. Send me a brief and I'll get back to you within a day.",
  },
  {
    question: 'What if I hate the first draft?',
    answer:
      "That's what revisions are for. Push back early, not politely later. Honest feedback = better work. Always.",
  },
];
const projects: Project[] = [
  {
    id: '01',
    title: 'Pinterest',
    year: '2026',
    description: 'A concept redesign that lets people explore freely without wrecking their curated feed.',
    accent: '#8fc7ff',
    thumb: '/projects/pinterest/search-desktop-after.png',
    thumbType: 'desktop',
    position: { left: '39%', top: '-8%', width: 'min(18vw, 260px)', height: 'min(15vw, 218px)' },
    focusOffset: { xVw: 0, yVh: 12 },
    start: -0.04,
    end: 0.18,
  },
  {
    id: '02',
    title: 'Dani',
    year: '2025',
    description: 'A mood, journal, and AI-companion concept that folds four daily rituals into one calm space.',
    accent: '#6E66A6',
    thumb: '/projects/dani/01-hero-welcome.png',
    thumbType: 'phone',
    position: { right: '-4vw', top: '13%', width: 'min(21vw, 305px)', height: 'min(27vw, 355px)' },
    focusOffset: { xVw: -13, yVh: 0 },
    start: -0.03,
    end: 0.2,
  },
  {
    id: '03',
    title: "Who's Blank?",
    year: '2025',
    description: 'A pass-and-play party game I designed and built so everyone gets to play, no host, no paper, nobody sitting out.',
    accent: '#6E5499',
    thumb: '/projects/whos-blank/6323e85d-0881-4d4d-86ab-ed9888293373.png',
    thumbType: 'phone',
    position: { left: '-9vw', top: '17%', width: 'min(20vw, 290px)', height: 'min(27vw, 360px)' },
    focusOffset: { xVw: 13, yVh: 0 },
    start: -0.02,
    end: 0.22,
  },
  {
    id: '04',
    title: 'Cosmetics Growth',
    year: '2025',
    description: 'A conversion-driven redesign and build of a cosmetics brand’s marketing site, made to turn browsers into buyers.',
    accent: '#1EA8BA',
    thumb: '/projects/cosmetics-growth/09e47586-4ab4-40ea-8320-d4b1a4338af3.png',
    thumbType: 'desktop',
    position: { right: '18%', top: '72%', width: 'min(21vw, 315px)', height: 'min(16vw, 235px)' },
    focusOffset: { xVw: 0, yVh: -4 },
    start: -0.01,
    end: 0.24,
  },
  {
    id: '05',
    title: 'This Portfolio',
    year: '2026',
    description: 'The making of this site, the cursor-drawing canvas, the inquiry flow, and the small interactions you are using right now.',
    accent: '#0B0B0B',
    thumb: '/projects/portfolio/3161ffc8-19a8-42a2-bfc8-a2ef43f5309d.png',
    thumbType: 'desktop',
    position: { left: '14vw', top: '72%', width: 'min(18vw, 255px)', height: 'min(14vw, 205px)' },
    focusOffset: { xVw: 1, yVh: -6 },
    start: 0,
    end: 0.26,
  },
];

const decorativeProjects: Project[] = [
  {
    id: '06',
    title: 'Halcyon — Brand System',
    year: '2024',
    description: '',
    accent: '#e7e7e7',
    position: { left: '7%', top: '-20%', width: 'min(17vw, 245px)', height: 'min(13vw, 190px)' },
    start: -0.06,
    end: 0.2,
  },
  {
    id: '07',
    title: 'Cobalt — Mobile App',
    year: '2023',
    description: '',
    accent: '#f2b8ff',
    position: { right: '-11vw', top: '43%', width: 'min(19vw, 270px)', height: 'min(17vw, 240px)' },
    start: -0.04,
    end: 0.24,
  },
  {
    id: '08',
    title: 'Meridian — Editorial',
    year: '2023',
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
  const [scrollCueVisible, setScrollCueVisible] = useState(false);
  const scrollRef = useRef<HTMLElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const animatedProgressRef = useRef(0);
  const cursorTagIdRef = useRef(0);
  const lastCursorTagRef = useRef({ x: -9999, y: -9999, time: 0 });
  const cursorTagTimeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    // The cue is a gentle "you can scroll" reminder: it only surfaces after the
    // visitor has been idle for a while, shows for a few seconds, fades out, and
    // re-appears on the next idle stretch. Any real scroll dismisses it instantly.
    const IDLE_DELAY = 5000;
    const VISIBLE_DURATION = 3000;
    let idleTimer = 0;
    let hideTimer = 0;

    const hasMoreToScroll = () => {
      const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
      return scrollMax > 80 && window.scrollY < scrollMax - 96;
    };

    const scheduleShow = () => {
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(show, IDLE_DELAY);
    };

    const show = () => {
      // Nothing left to scroll to — skip this round and try again later.
      if (!hasMoreToScroll()) {
        scheduleShow();
        return;
      }

      setScrollCueVisible(true);
      hideTimer = window.setTimeout(() => {
        setScrollCueVisible(false);
        scheduleShow();
      }, VISIBLE_DURATION);
    };

    const onScroll = () => {
      setScrollCueVisible(false);
      window.clearTimeout(hideTimer);
      scheduleShow();
    };

    scheduleShow();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(idleTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

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
        <div ref={rootRef} className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-[#0c0c0c] md:h-screen">
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
      <ScrollCue visible={scrollCueVisible} />
    </>
  );
}

function ScrollCue({ visible }: { visible: boolean }) {
  return (
    <div className={`scroll-cue ${visible ? 'is-visible' : ''}`} aria-hidden="true">
      <span className="scroll-cue-mouse">
        <span className="scroll-cue-dot" />
      </span>
    </div>
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
        className="mb-7 inline-block bg-black px-3 py-[6px] text-[clamp(10.5px,2.6vw,12px)] font-bold uppercase tracking-[0.06em] text-white"
        style={{ fontFamily: "'Familjen Grotesk', Inter, system-ui, sans-serif" }}
      >
        UX/UI DESIGNER &amp; FRONT-END DEV
      </div>
      <h1
        className="max-w-[920px] text-center text-[clamp(28px,7vw,44px)] font-semibold leading-[1.18] tracking-[-0.015em] text-black"
        style={{ fontFamily: APPLE_FONT_STACK }}
      >
        Designing interfaces that feel
        <br />
        right, clean, human, intentional.
      </h1>
    </div>
  );
}

function useIsMobile(query = '(max-width: 900px)') {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setIsMobile(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return isMobile;
}

function MobileProjects({ onOpenProject }: { onOpenProject: (id: string) => void }) {
  return (
    <section id="work" className="bg-white px-5 pb-16 pt-20 text-black" aria-label="Selected work">
      <div className="mx-auto max-w-[520px]">
        <h2
          className="text-[clamp(40px,13vw,60px)] font-medium leading-none tracking-[0]"
          style={{ fontFamily: APPLE_FONT_STACK }}
        >
          MY WORK
        </h2>
        <p className="mt-5 max-w-[420px] text-[16px] leading-[1.4] text-[#626262]">
          From research to final pixel, every project here is a full design process, not just a pretty screen.
        </p>

        <div className="mt-10 space-y-9">
          {projects.map((project, index) => (
            <button
              key={project.id}
              type="button"
              onClick={() => onOpenProject(project.id)}
              className="block w-full text-left"
              aria-label={`Open ${project.title} case study`}
            >
              <div
                className="relative aspect-[4/3] w-full overflow-hidden rounded-[18px]"
                style={{ boxShadow: '0 14px 40px rgba(0,0,0,0.10)' }}
              >
                <ProjectPlaceholder project={project} index={index} />
              </div>
              <div className="mt-3.5 flex items-baseline justify-between gap-4">
                <h3 className="text-[19px] font-medium leading-none tracking-[0]">{project.title}</h3>
                <span className="shrink-0 text-[13px] leading-none text-[#888]">{project.year}</span>
              </div>
              <p className="mt-2 text-[14px] leading-[1.45] text-[#666]">{project.description}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function MobileAbout() {
  return (
    <section className="bg-white px-5 pb-20 pt-10 text-black" aria-label="About">
      <div className="mx-auto max-w-[520px]">
        <h2
          className="text-[clamp(34px,10.5vw,52px)] font-medium leading-[1.04] tracking-[-0.01em]"
          style={{ fontFamily: APPLE_FONT_STACK }}
        >
          im shim, a designer who also codes.
        </h2>

        <div className="mt-10 grid gap-4">
          {capabilityCards.map((card, index) => (
            <article
              key={card.title}
              className="relative overflow-hidden rounded-[22px] bg-[#f6f6f7] p-6"
              style={{ fontFamily: APPLE_FONT_STACK }}
            >
              <p className="text-[13px] font-semibold text-[#1d1d1f]">{card.eyebrow}</p>
              <h3 className="mt-3 text-[21px] font-semibold leading-[1.1] tracking-[0]">{card.title}</h3>
              <p className="mt-2.5 text-[14.5px] leading-[1.45] text-[#4f4f55]">{card.text}</p>
              <div
                className="about-card-symbol mt-5 font-semibold leading-none tracking-[-0.04em]"
                style={
                  {
                    fontSize: card.visualSize,
                    '--symbol-gradient-start': `${index * 18}%`,
                    '--symbol-gradient-end': `${index * 18 + 38}%`,
                    '--symbol-gradient-delay': `${index * -1.35}s`,
                  } as React.CSSProperties
                }
              >
                {card.visual}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  const isMobile = useIsMobile();
  const [projectProgress, setProjectProgress] = useState(0);
  const [aboutProgress, setAboutProgress] = useState(0);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [openProjectId, setOpenProjectId] = useState<string | null>(null);
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
      const isHovered =
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom;

      if (!isHovered) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.hypot(clientX - centerX, clientY - centerY);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestProject = card.dataset.projectId ?? null;
      }
    });

    setActiveProject(closestProject);
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-white text-black"
      aria-label="Selected projects and about"
    >
      {isMobile ? (
        <>
          <MobileProjects onOpenProject={setOpenProjectId} />
          <MobileAbout />
        </>
      ) : (
      <>
      <div id="work" ref={projectStageRef} className="relative h-[260vh] md:h-[460vh]">
        <div
          className="sticky top-0 h-[100dvh] overflow-hidden md:h-screen"
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
                  onOpenProject={setOpenProjectId}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="h-[4vh]" aria-hidden="true" />

      <div ref={aboutStageRef} className="relative h-[300vh] md:h-[400vh]">
        <div className="sticky top-0 h-[100dvh] overflow-hidden md:h-screen">
          <AboutContent progress={aboutProgress} />
        </div>
      </div>
      </>
      )}

      <PortfolioDetails />

      {openProjectId ? (
        <ProjectModal projectId={openProjectId} onClose={() => setOpenProjectId(null)} />
      ) : null}
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
  const videoRevealProgress = easeOut(
    progressBetween(horizontalProgress, ABOUT_VIDEO_REVEAL_START, ABOUT_VIDEO_REVEAL_START + 0.16),
  );
  const videoScrollProgress = easeInOut(
    progressBetween(horizontalProgress, ABOUT_VIDEO_SCROLL_START, ABOUT_VIDEO_SCROLL_END),
  );
  const videoScrubProgress = Math.round(videoScrollProgress * 240) / 240;
  const textSettleProgress = easeInOut(progressBetween(progress, 0.62, 0.98));
  const textExitProgress = easeInOut(progressBetween(progress, 0.72, 1));
  const cardsGroupProgress = easeSoft(progressBetween(progress, 0.48, 0.68));
  const cardsDriftProgress = easeInOut(progressBetween(progress, 0.7, 1));

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

      videoTargetTimeRef.current = duration * videoScrubProgress;
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
  }, [isVideoVisible, videoScrubProgress]);

  return (
    <div className="pointer-events-none absolute inset-0 z-50 px-5" aria-label="About">
      <div
        className="absolute left-1/2 top-1/2 z-20 flex -translate-y-1/2 items-center gap-[0.22em] whitespace-nowrap text-[clamp(48px,7.4vw,120px)] font-medium leading-none tracking-[0]"
        aria-label="im shim, a designer who also codes"
        style={{
          fontFamily: APPLE_FONT_STACK,
          opacity: 1 - easeSoft(progressBetween(progress, 0.9, 1)),
          transform: `translate3d(calc(-50% + ${lerp(142, -78, horizontalProgress) + lerp(0, -52, textExitProgress)}vw), calc(-50% - ${lerp(0, 35, verticalProgress) + lerp(0, 34, textExitProgress)}vh), 0) rotate(${lerp(-1.8, 0.8, horizontalProgress)}deg) scale(${lerp(1, 0.82, textSettleProgress)})`,
          willChange: 'opacity, transform',
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
                    filter: videoRevealProgress < 0.98 ? `blur(${lerp(12, 0, videoRevealProgress)}px)` : undefined,
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
        className="pointer-events-auto absolute inset-x-0 bottom-[5.5vh] z-30 px-5 md:bottom-[7vh]"
        style={{
          opacity: cardsGroupProgress,
          transform: `translate3d(0, ${lerp(18, 0, cardsGroupProgress) + lerp(0, -24, cardsDriftProgress)}px, 0)`,
          willChange: 'opacity, transform',
        }}
      >
        <div className="about-cards-scroller -mx-5 flex gap-4 overflow-x-auto overflow-y-visible px-5 pb-3 pt-8 md:mx-auto md:max-w-[1080px] md:grid md:grid-cols-4 md:overflow-visible md:px-0">
          {capabilityCards.map((card, index) => {
            const layout = ABOUT_CARD_LAYOUTS[index] ?? ABOUT_CARD_LAYOUTS[0];
            const cardProgress = easeOut(progressBetween(progress, 0.5 + index * 0.028, 0.82 + index * 0.02));
            const cardExitProgress = easeInOut(progressBetween(progress, 0.72 + index * 0.045, 0.91 + index * 0.035));
            const cardFloat = Math.sin(progress * Math.PI * (1.6 + index * 0.12) + index * 0.82) * 2.6;
            const cardY =
              lerp(370 + index * 18, layout.y * 0.35, cardProgress) +
              cardFloat +
              lerp(0, -14 - index * 3, cardsDriftProgress) +
              lerp(0, -115 - index * 18, cardExitProgress);
            const cardX =
              lerp(layout.x * 10, 0, cardProgress) +
              lerp(0, layout.drift * 0.22, cardsDriftProgress) +
              lerp(0, -34 - index * 8, cardExitProgress);
            const cardRotate = lerp(layout.rotate * 0.8, 0, cardProgress) + lerp(0, -1.2 - index * 0.28, cardExitProgress);
            const cardOpacity = clamp(cardProgress * 1.45) * (1 - easeSoft(progressBetween(cardExitProgress, 0.72, 1)));

            return (
              <div
                key={card.title}
                className="about-card-shell min-w-0 shrink-0 md:shrink"
                style={{
                  opacity: cardOpacity,
                  filter: cardProgress < 0.98 ? `blur(${lerp(11, 0, cardProgress)}px)` : undefined,
                  transform: `translate3d(${cardX}px, ${cardY}px, 0) rotate(${cardRotate}deg) scale(${lerp(1, 0.965, cardExitProgress)})`,
                  transition: 'filter 220ms ease, opacity 220ms ease',
                  willChange: 'opacity, filter, transform',
                }}
              >
                <article
                  className="about-capability-card relative flex h-[330px] w-[min(76vw,268px)] flex-col overflow-hidden rounded-[24px] bg-white p-6 shadow-[0_16px_44px_rgba(0,0,0,0.055)] md:h-[360px] md:w-full"
                  style={{ fontFamily: APPLE_FONT_STACK }}
                >
                  <p className="text-[13px] font-semibold text-[#1d1d1f]">{card.eyebrow}</p>
                  <h3 className="mt-4 text-[clamp(21px,1.9vw,27px)] font-semibold leading-[1.08] tracking-[0]">
                    {card.title}
                  </h3>
                  <p className="mt-3 max-w-[240px] text-[14px] leading-[1.4] text-[#4f4f55]">{card.text}</p>

                  <div
                    className="about-card-symbol absolute bottom-7 left-6 font-semibold leading-none tracking-[-0.04em]"
                    style={
                      {
                        fontSize: card.visualSize,
                        '--symbol-gradient-start': `${index * 18}%`,
                        '--symbol-gradient-end': `${index * 18 + 38}%`,
                        '--symbol-gradient-delay': `${index * -1.35}s`,
                      } as React.CSSProperties
                    }
                  >
                    {card.visual}
                  </div>
                  <div className="about-card-plus absolute bottom-6 right-6 rounded-full bg-[#1d1d1f] text-white" aria-hidden="true">
                    <span />
                    <span />
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

function scrollToSection(id: string) {
  if (id === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function PortfolioDetails() {
  const [openQuestion, setOpenQuestion] = useState(-1);
  const [openService, setOpenService] = useState(-1);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <section
        id="services"
        className="service-transition-section relative overflow-hidden bg-[#f5f5f7] px-3 py-9 text-black md:px-6 md:py-14"
        aria-label="Services"
      >
        <div className="service-page-shell mx-auto max-w-[1180px] rounded-[34px] bg-white px-5 py-12 shadow-[0_26px_80px_rgba(0,0,0,0.045)] md:px-10 md:py-16">
          <div className="service-copy relative z-10 mx-auto grid max-w-[1080px] gap-10 md:grid-cols-[0.7fr_1.3fr] md:gap-14">
            <div className="service-intro">
              <p
                className="mb-6 text-[12.6px] font-semibold uppercase tracking-[0.18em] text-[#6e6e73]"
                style={{ fontFamily: APPLE_FONT_STACK }}
              >
                Services
              </p>
              <h2
                className="text-[clamp(29px,3.8vw,52px)] font-medium leading-[1.02] tracking-[0] text-[#1d1d1f]"
                style={{ fontFamily: APPLE_FONT_STACK }}
              >
                What I do.
              </h2>
              <p className="mt-6 max-w-[360px] text-[clamp(16.2px,1.485vw,19.8px)] font-medium leading-[1.42] text-[#6e6e73]">
                Design. Code. Both. Whatever your project calls for.
              </p>
            </div>

            <div className="service-list">
              {serviceItems.map((item, serviceIndex) => {
                const isOpen = openService === serviceIndex;

                return (
                  <button
                    key={item.title}
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenService(isOpen ? -1 : serviceIndex)}
                    className={`service-row group grid w-full gap-3 border-b border-black/12 py-5 text-left outline-none transition duration-500 hover:translate-x-1.5 focus-visible:translate-x-1.5 md:grid-cols-[1fr_48px] md:items-start md:py-6 ${isOpen ? 'is-open' : ''}`}
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3
                          className="text-[clamp(22.5px,2.16vw,30.6px)] font-medium leading-none tracking-[0] text-[#1d1d1f] transition group-hover:text-black"
                          style={{ fontFamily: APPLE_FONT_STACK }}
                        >
                          {item.title}
                        </h3>
                        <span className="rounded-full border border-[#d6d6dc] px-3.5 py-1.5 text-[12.6px] font-semibold leading-none text-[#6e6e73]">
                          {item.type}
                        </span>
                      </div>
                      <div className="service-detail">
                        <p className="max-w-[650px] text-[14px] leading-[1.45] text-black/58">
                          {item.description}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2.5">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-black/18 px-3 py-1 text-[12px] font-semibold leading-none text-black/50 transition group-hover:border-black/26 group-focus-visible:border-black/26"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-[15.3px] font-medium text-[#a1a1a6] md:text-right">{item.number}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="questions" className="deferred-section reveal-section relative bg-white px-5 pb-14 pt-[92px] text-black md:px-10 md:pb-20 md:pt-[132px]" aria-label="Questions">
        <div className="mx-auto max-w-[1180px]">
          <div className="reveal-copy flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p
                className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#777]"
                style={{ fontFamily: APPLE_FONT_STACK }}
              >
                Questions
              </p>
              <h2
                className="mt-4 max-w-[560px] text-[clamp(29px,3.8vw,52px)] font-medium leading-[1.02] tracking-[0]"
                style={{ fontFamily: APPLE_FONT_STACK }}
              >
                The things people usually ask first.
              </h2>
            </div>
          </div>

          <div className="reveal-list mx-auto mt-12 max-w-[1040px]">
            {questionItems.map((item, index) => {
              const isOpen = openQuestion === index;

              return (
                <div key={item.question} className="reveal-row faq-item border-b border-[#d2d2d7]">
                  <button
                    type="button"
                    className="group flex w-full items-center justify-between gap-8 py-7 text-left md:py-10"
                    onClick={() => setOpenQuestion(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                    >
                    <span
                      className="max-w-[880px] text-[clamp(20.25px,1.944vw,27.54px)] font-medium leading-[1.12] tracking-[0] text-[#1d1d1f]"
                      style={{ fontFamily: APPLE_FONT_STACK }}
                    >
                      {item.question}
                    </span>
                    <span
                      className={`faq-chevron relative h-8 w-8 shrink-0 text-[#86868b] transition duration-300 group-hover:text-[#1d1d1f] ${isOpen ? 'is-open' : ''}`}
                      aria-hidden="true"
                    >
                      <span className="faq-chevron-bar faq-chevron-left" />
                      <span className="faq-chevron-bar faq-chevron-right" />
                    </span>
                  </button>
                  <div
                    className="faq-answer-grid grid"
                    style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                  >
                    <div className="overflow-hidden">
                      <p
                        className="faq-answer-copy max-w-[820px] pb-9 text-[17px] leading-[1.55] text-[#6e6e73] md:text-[19px]"
                        style={{
                          opacity: isOpen ? 1 : 0,
                          transform: `translate3d(0, ${isOpen ? 0 : -8}px, 0)`,
                        }}
                      >
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer id="contact" className="deferred-section bg-white px-5 pb-16 pt-28 text-black md:px-10 md:pb-24 md:pt-32" aria-label="Footer contact">
        <div className="mx-auto max-w-[1180px]">
          <nav
            aria-label="Footer navigation"
            className="mb-16 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-b border-black/10 pb-7 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-black/50 md:mb-24"
          >
            <div className="flex flex-wrap gap-x-7 gap-y-3">
              <button type="button" onClick={() => scrollToSection('work')} className="transition hover:text-black">
                Work
              </button>
              <button type="button" onClick={() => scrollToSection('services')} className="transition hover:text-black">
                Services
              </button>
              <button type="button" onClick={() => scrollToSection('questions')} className="transition hover:text-black">
                Questions
              </button>
              <button type="button" onClick={() => setContactOpen(true)} className="transition hover:text-black">
                Start a project
              </button>
            </div>
            <button
              type="button"
              onClick={() => scrollToSection('top')}
              className="inline-flex items-center gap-2 transition hover:text-black"
            >
              Back to top
              <span aria-hidden="true">↑</span>
            </button>
          </nav>

          <h2
            className="text-[clamp(54px,10vw,142px)] font-semibold uppercase leading-[0.88] tracking-[0]"
            style={{ fontFamily: APPLE_FONT_STACK }}
          >
            Get in touch
          </h2>

          <button
            type="button"
            onClick={() => setContactOpen(true)}
            className="footer-email-link mt-12 inline-block cursor-pointer appearance-none border-b border-current bg-transparent pb-2 text-left text-[clamp(26px,4.2vw,54px)] font-medium leading-none tracking-[0] md:mt-16"
            style={{ fontFamily: APPLE_FONT_STACK }}
          >
            shimaa.j.nur@gmail.com
          </button>

          <div className="mt-9 flex flex-wrap items-center gap-3 md:mt-12">
            <a
              href="/resume.html"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[48px] items-center rounded-full bg-[#1d1d1f] px-6 text-[15px] font-semibold text-white transition hover:bg-black"
            >
              View résumé
            </a>
            <a
              href="/Shaimaa_Jamal_Nur_Resume.pdf"
              download
              className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-black/20 px-6 text-[15px] font-semibold text-[#1d1d1f] transition hover:border-black/45"
            >
              Download PDF
              <span aria-hidden="true">↓</span>
            </a>
          </div>

          <div className="mt-20 grid gap-x-12 gap-y-10 text-[15px] font-medium leading-[1.35] text-[#1d1d1f] sm:grid-cols-2 md:mt-44 lg:grid-cols-5">
            <div>
              <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-black/45">Phone</p>
              <a className="inline-flex min-h-[44px] items-center transition hover:opacity-55" href="tel:+19402386273">
                +1-940-238-6273
              </a>
            </div>
            <div>
              <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-black/45">Availability</p>
              <p className="inline-flex min-h-[44px] items-center">Available worldwide</p>
            </div>
            <div>
              <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-black/45">GitHub</p>
              <a className="inline-flex min-h-[44px] items-center transition hover:opacity-55" href="https://github.com/cmizchii" target="_blank" rel="noreferrer">
                @cmizchii
              </a>
            </div>
            <div>
              <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-black/45">LinkedIn</p>
              <a className="inline-flex min-h-[44px] items-center transition hover:opacity-55" href="https://www.linkedin.com/in/shaimaajamal" target="_blank" rel="noreferrer">
                in/shaimaajamal
              </a>
            </div>
            <div>
              <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-black/45">Made</p>
              <p className="inline-flex min-h-[44px] items-center">© 2026 Shaimaa Jamal</p>
            </div>
          </div>
        </div>
      </footer>

      {contactOpen ? (
        <ContactModal email="shimaa.j.nur@gmail.com" onClose={() => setContactOpen(false)} />
      ) : null}
    </>
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
  onOpenProject,
}: {
  project: Project;
  index: number;
  progress: number;
  activeProject: string | null;
  activeIndex: number;
  activeFocusOffset?: { xVw: number; yVh: number };
  onFocusProject: (id: string | null) => void;
  onOpenProject: (id: string) => void;
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
  const scrollBlur = lerp(9, 0, sectionEnterProgress) + lerp(0, 8, exitProgress);
  const visibleBlur = Math.max(scrollBlur, isDimmed ? 4 : 0);
  const blurFilter = visibleBlur > 0.15 ? `blur(${visibleBlur}px) ` : '';
  const colorFilter = isActive
    ? 'grayscale(0) saturate(1.05)'
    : 'grayscale(1) saturate(0.08) contrast(1.04)';
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
      role="button"
      aria-label={`Open ${project.title} case study`}
      data-project-id={project.id}
      onMouseEnter={() => onFocusProject(project.id)}
      onMouseLeave={() => onFocusProject(null)}
      onFocus={() => onFocusProject(project.id)}
      onBlur={() => onFocusProject(null)}
      onClick={() => onOpenProject(project.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpenProject(project.id);
        }
      }}
      className="project-card absolute cursor-pointer outline-none"
      style={{
        ...project.position,
        zIndex: isActive ? 30 : 12 + index,
        opacity,
        transform: `translate3d(calc(${parallaxX}vw + ${proximityShiftX + activeShiftX}vw), calc(${lift + activeShiftY}vh + ${parallaxY + proximityShiftY + floatY}px), 0) scale(${focusScale})`,
        transition:
          `filter 620ms cubic-bezier(0.22, 1, 0.36, 1), transform ${motion.transitionMs}ms cubic-bezier(0.22, 1, 0.36, 1), opacity ${motion.opacityMs}ms ease-out`,
        filter: `${blurFilter}${colorFilter}`,
      }}
    >
      <div
        className="relative h-full overflow-hidden bg-white shadow-[0_18px_60px_rgba(0,0,0,0.08)]"
        style={{
          opacity: isDimmed ? 0.72 : 1,
          transition:
            'opacity 520ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 520ms cubic-bezier(0.22, 1, 0.36, 1)',
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
  const scrollBlur = lerp(9, 0, sectionEnterProgress) + lerp(0, 8, exitProgress);
  const visibleBlur = Math.max(scrollBlur, activeProject ? 4 : 0);
  const blurFilter = visibleBlur > 0.15 ? `blur(${visibleBlur}px) ` : '';
  const colorFilter = 'grayscale(1) saturate(0.08) contrast(1.04)';

  return (
    <div
      className="pointer-events-none absolute"
      style={{
        ...project.position,
        zIndex: 4 + index,
        opacity,
        transform: `translate3d(${parallaxX}vw, calc(${lift}vh + ${parallaxY + floatY}px), 0)`,
        filter: `${blurFilter}${colorFilter}`,
        transition: `filter 520ms ease, transform ${motion.transitionMs}ms cubic-bezier(0.22, 1, 0.36, 1), opacity ${motion.opacityMs}ms ease-out`,
      }}
      aria-hidden="true"
    >
      <div
        className="relative h-full overflow-hidden bg-white shadow-[0_18px_60px_rgba(0,0,0,0.06)]"
      >
        <ProjectPlaceholder project={project} index={index} />
      </div>
    </div>
  );
}

function ProjectPlaceholder({ project, index }: { project: Project; index: number }) {
  if (project.thumb) {
    const isDesktop = project.thumbType === 'desktop';

    return (
      <div
        className="relative h-full w-full overflow-hidden"
        style={{
          background: `radial-gradient(120% 90% at 50% 0%, ${project.accent}26 0%, #f4f2fb 46%, #ffffff 100%)`,
        }}
      >
        <div className="absolute left-[7%] right-[7%] top-[7%] z-10 flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.08em] text-[#8a8a8a]">
          <span>{project.title}</span>
          <span>{project.year}</span>
        </div>

        {isDesktop ? (
          <div
            className="absolute left-1/2 top-1/2 w-[84%] -translate-x-1/2 -translate-y-[44%] overflow-hidden border border-black/[0.06] bg-white"
            style={{
              borderRadius: '12px',
              boxShadow: '0 22px 44px rgba(20,30,55,0.16), 0 6px 14px rgba(20,30,55,0.08)',
            }}
          >
            <div className="flex h-[18px] items-center gap-1.5 bg-[#f3f3f5] px-2.5">
              <span className="h-[5px] w-[5px] rounded-full bg-[#ff5f57]" />
              <span className="h-[5px] w-[5px] rounded-full bg-[#febc2e]" />
              <span className="h-[5px] w-[5px] rounded-full bg-[#28c840]" />
            </div>
            <img
              src={project.thumb}
              alt={`${project.title} — case study preview`}
              loading="lazy"
              draggable={false}
              className="block aspect-[16/10] w-full select-none object-cover object-[center_top]"
            />
          </div>
        ) : (
          <div
            className="absolute left-1/2 top-[24%] h-[110%] w-[60%] -translate-x-1/2 overflow-hidden border border-black/[0.06] bg-white"
            style={{
              borderRadius: '26px',
              boxShadow: '0 28px 50px rgba(46,40,80,0.18), 0 8px 18px rgba(46,40,80,0.10)',
            }}
          >
            <img
              src={project.thumb}
              alt={`${project.title} — case study preview`}
              loading="lazy"
              draggable={false}
              className="block h-auto w-full select-none object-cover object-[center_top]"
            />
          </div>
        )}

        <div className="absolute bottom-[7%] right-[7%] z-10 text-[11px] text-[#606060]">
          @{project.id}
        </div>
      </div>
    );
  }

  const [coverName, coverCategory] = project.title.split('—').map((part) => part.trim());
  const coverTags = (coverCategory ?? 'Case Study').split(' ').slice(0, 2);

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        background: `linear-gradient(157deg, #ffffff 0%, #efefec 60%, ${project.accent} 215%)`,
      }}
    >
      {/* meta row */}
      <div className="absolute left-[8%] right-[8%] top-[8%] z-10 flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.1em] text-[#9a9a9a]">
        <span className="truncate pr-2">{coverCategory ?? 'Case Study'}</span>
        <span>{project.year}</span>
      </div>

      {/* soft accent arc */}
      <div
        className="absolute rounded-full"
        style={{
          width: '60%',
          aspectRatio: '1 / 1',
          right: '-16%',
          top: `${-10 + (index % 3) * 4}%`,
          background: `radial-gradient(circle at 32% 30%, #ffffff 0%, ${project.accent} 56%, #2b2b2b 150%)`,
          opacity: 0.4,
        }}
      />
      {/* thin ring detail */}
      <div
        className="absolute rounded-full border-[5px] border-black/[0.12]"
        style={{
          width: '17%',
          aspectRatio: '1 / 1',
          right: '18%',
          top: index % 2 === 0 ? '36%' : '30%',
        }}
      />

      {/* hero name */}
      <div className="absolute bottom-[31%] left-[8%] right-[10%]">
        <h4
          className="font-semibold leading-[0.94] tracking-[-0.03em] text-[#1d1d1f]"
          style={{ fontFamily: APPLE_FONT_STACK, fontSize: 'clamp(22px,3.4vw,40px)' }}
        >
          {coverName}
        </h4>
      </div>

      {/* baseline: rule + discipline tags */}
      <div className="absolute bottom-[12%] left-[8%] right-[8%]">
        <div className="h-px w-full bg-black/[0.12]" />
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {coverTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-black/[0.14] px-2.5 py-[3px] text-[9px] font-medium uppercase tracking-[0.08em] text-[#8a8a8a]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute bottom-[7%] right-[7%] text-[11px] text-[#9a9a9a]">
        @{project.id}
      </div>
    </div>
  );
}

const PINTEREST_IMG = '/projects/pinterest/';

function CaseImage({
  src,
  alt,
  className = '',
  label,
}: {
  src: string;
  alt: string;
  className?: string;
  label?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-[#f1f1f3] text-center text-[11px] font-medium uppercase tracking-[0.08em] text-[#b3b3b9] ${className}`}
      >
        {label ?? alt}
      </div>
    );
  }

  return (
    <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={className} />
  );
}

function CaseSection({
  eyebrow,
  title,
  children,
  accent = '#E60023',
}: {
  eyebrow: string;
  title?: string;
  children?: React.ReactNode;
  accent?: string;
}) {
  return (
    <section className="case-reveal mt-24 px-6 md:mt-36 md:px-16">
      <p className="text-[12px] font-semibold uppercase tracking-[0.2em]" style={{ color: accent }}>{eyebrow}</p>
      {title ? (
        <h2 className="mt-5 max-w-[760px] text-[clamp(28px,3.8vw,48px)] font-semibold leading-[1.08] tracking-[-0.02em] text-[#1d1d1f]">
          {title}
        </h2>
      ) : null}
      {children ? (
        <div className="mt-7 max-w-[700px] space-y-6 text-[clamp(17px,1.7vw,19px)] leading-[1.75] text-[#56565b]">
          {children}
        </div>
      ) : null}
    </section>
  );
}

const pinterestMeta: [string, string][] = [
  ['Role', 'UX Researcher & Designer'],
  ['Type', 'Self-initiated · Solo'],
  ['Platform', 'Mobile & Desktop'],
  ['Focus', 'Interaction Design · IA'],
];

const originStats: [string, string][] = [
  ['2', 'Core UX problems identified'],
  ['6+', 'Friends consulted in research'],
  ['4', 'Redesigned UI flows'],
];

const discoveryQuotes = [
  {
    initial: 'S',
    name: 'Sara',
    text: "Oh yeah, the board thing. I literally stopped organizing my pins because of it. I had 400 saved pins and nothing was where it should be because I couldn't be bothered to save each one to three different boards. So now I just dump everything into one board and it's a mess.",
  },
  {
    initial: 'N',
    name: 'Nour',
    text: "Honestly the saving thing made me use it way less. It was fine when I had two boards but as I kept going it just became so annoying to save things properly that I kind of stopped caring. And then what's even the point of the app?",
  },
  {
    initial: 'L',
    name: 'Lana',
    text: "Omg the search thing is so frustrating. I searched one time for a men's haircut, literally one search, and then for like three weeks my whole home page was men's haircuts and barber inspo. I had to click 'not interested' on like 50 posts. I just gave up.",
  },
  {
    initial: 'M',
    name: 'Maya',
    text: "I stopped using Pinterest the way I used to, spending hours scrolling for art and fashion. Now I kind of just use it like a Google image search. Search, find what I need, leave. The home page doesn't feel like mine anymore.",
  },
];

const insightCards = [
  {
    emoji: '📌',
    title: 'Users abandon organization',
    text: 'The friction of saving to one board at a time makes users stop organizing altogether, defeating one of Pinterest’s core features.',
  },
  {
    emoji: '🔍',
    title: 'Search feels risky',
    text: 'Users avoid searching out of curiosity because the algorithm cost is too high. Curiosity has become a liability.',
  },
  {
    emoji: '📱',
    title: 'Feed loses trust',
    text: 'When the feed no longer reflects actual taste, users disengage from discovery, the core Pinterest behavior.',
  },
  {
    emoji: '⏱️',
    title: 'Friction compounds',
    text: 'Both issues worsen as usage deepens. New users barely notice; long-term devoted users feel it acutely, the users Pinterest most needs to keep.',
  },
];

const researchStats = [
  {
    emoji: '📊',
    title: '373 upvotes',
    text: '"Pinterest is not the same anymore...", one of the most-engaged threads in r/Pinterest, full of users describing loss of trust.',
  },
  {
    emoji: '🔁',
    title: '"Make a new account"',
    text: 'The top community answer to "how do I search without affecting my feed?", not a workaround, a failure.',
  },
  {
    emoji: '📉',
    title: 'Users are disengaging',
    text: 'From hours of discovery to using Pinterest purely as a search tool, or not at all. Discovery is the core product, and it’s breaking.',
  },
  {
    emoji: '🔒',
    title: 'Pinterest admitted it',
    text: 'Launching the 2019 Feed Tuner, they described fixing feeds "polluted with stuff users don’t want." They built the fix, then hid it.',
  },
];

const multiColorChoices = [
  { swatch: '#34c759', name: 'Green check', text: 'Universal "done" signal, but Pinterest uses green nowhere. Imports meaning from outside.', chosen: false },
  { swatch: '#8a8a8f', name: 'Neutral gray', text: "Safe and quiet, but the selected state reads as maybe, not yes.", chosen: false },
  { swatch: '#111111', name: 'Pure black', text: 'Definite and high-contrast, but pulls the eye away from the red Save button.', chosen: false },
  { swatch: '#E60023', name: 'Pinterest red', text: "Same red as Save. Selection inherits the platform's existing meaning of committed action.", chosen: true },
];

const ghostColorChoices = [
  { swatch: '#E60023', name: 'Pinterest red', text: 'On-brand, but ghost mode looks identical to a normal search. The state change is invisible.', chosen: false },
  { swatch: '#ff8c42', name: 'Warm orange', text: 'Friendly, but orange reads as a warning, it makes ghost mode feel risky.', chosen: false },
  { swatch: '#9a9aa0', name: 'Neutral gray', text: 'Clean, but gray reads as disabled, the opposite of "fully active, just private."', chosen: false },
  { swatch: '#26215C', name: 'Deep navy', text: 'Far from Pinterest red, already linked to incognito privacy. Users decode it on first sight.', chosen: true },
];

type FigureMarker = { x: number; y: number; w: number; h: number; label?: string; labelPos?: 'top' | 'bottom' };

function CaseFigure({
  src,
  caption,
  className,
  markers,
}: {
  src: string;
  caption: string;
  className: string;
  markers?: FigureMarker[];
}) {
  return (
    <figure className="case-reveal">
      <div className="relative">
        <CaseImage src={`${PINTEREST_IMG}${src}`} alt={caption} label={src} className={`w-full rounded-[18px] bg-[#f5f5f7] ${className}`} />
        {markers?.map((marker, index) => (
          <span
            key={index}
            className="case-marker"
            style={{ left: `${marker.x}%`, top: `${marker.y}%`, width: `${marker.w}%`, height: `${marker.h}%` }}
          >
            {marker.label ? (
              <span className={`case-marker-label ${marker.labelPos === 'bottom' ? 'is-bottom' : ''}`}>{marker.label}</span>
            ) : null}
          </span>
        ))}
      </div>
      <figcaption className="mt-4 text-[14px] leading-[1.5] text-[#86868b]">{caption}</figcaption>
    </figure>
  );
}

function FriendQuote({ initial, name, text }: { initial: string; name: string; text: string }) {
  return (
    <div className="case-reveal flex gap-4 rounded-[24px] bg-[#f5f5f7] p-7 md:p-8">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1d1d1f] text-[15px] font-semibold text-white">
        {initial}
      </span>
      <div>
        <p className="text-[15px] font-semibold text-[#1d1d1f]">{name}</p>
        <p className="mt-2.5 text-[16px] leading-[1.65] text-[#4f4f55]">&ldquo;{text}&rdquo;</p>
      </div>
    </div>
  );
}

function RedditQuote({ user, votes, text }: { user: string; votes: string; text: string }) {
  return (
    <div className="case-reveal rounded-[20px] border border-black/[0.08] p-6">
      <div className="flex items-center gap-2 text-[14px]">
        <span className="font-semibold text-[#1d1d1f]">{user}</span>
        <span className="text-[#ff6b4a]">▲ {votes}</span>
      </div>
      <p className="mt-3 text-[16px] leading-[1.6] text-[#4f4f55]">&ldquo;{text}&rdquo;</p>
    </div>
  );
}

function InfoCard({ emoji, title, text }: { emoji: string; title: string; text: string }) {
  return (
    <div className="case-reveal rounded-[24px] bg-[#f5f5f7] p-7">
      <div className="text-[30px]">{emoji}</div>
      <h3 className="mt-4 text-[17px] font-semibold leading-[1.25] text-[#1d1d1f]">{title}</h3>
      <p className="mt-2.5 text-[15px] leading-[1.55] text-[#6e6e73]">{text}</p>
    </div>
  );
}

function BigStat({ value, label, accent = '#E60023' }: { value: string; label: string; accent?: string }) {
  return (
    <div className="case-reveal">
      <div className="text-[clamp(48px,7vw,76px)] font-semibold leading-none tracking-[-0.03em]" style={{ color: accent }}>{value}</div>
      <p className="mt-4 text-[15px] leading-[1.45] text-[#6e6e73]">{label}</p>
    </div>
  );
}

function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <div className="case-reveal mt-20 px-6 md:mt-32 md:px-16">
      <p className="max-w-[920px] text-[clamp(24px,3.6vw,42px)] font-medium leading-[1.28] tracking-[-0.015em] text-[#1d1d1f]">
        {children}
      </p>
    </div>
  );
}

function Choice({ chosen, label, children }: { chosen: boolean; label: string; children: React.ReactNode }) {
  return (
    <div className={`case-reveal rounded-[24px] border p-7 md:p-8 ${chosen ? 'border-[#34c759]/40 bg-[#f1faf3]' : 'border-black/10 bg-white'}`}>
      <p className={`text-[12px] font-semibold uppercase tracking-[0.08em] ${chosen ? 'text-[#1d9c43]' : 'text-[#c0392b]'}`}>
        {chosen ? '✓ Chosen' : '✗ Rejected'},{label}
      </p>
      <p className="mt-3.5 text-[16px] leading-[1.6] text-[#4f4f55]">{children}</p>
    </div>
  );
}

function ColorSwatch({ swatch, name, text, chosen }: { swatch: string; name: string; text: string; chosen: boolean }) {
  return (
    <div className={`case-reveal rounded-[20px] border p-6 ${chosen ? 'border-[#1d1d1f]' : 'border-black/10'}`}>
      <div className="h-16 w-full rounded-[12px]" style={{ background: swatch }} />
      <p className="mt-5 text-[15px] font-semibold text-[#1d1d1f]">{name}</p>
      <p className="mt-2 text-[14px] leading-[1.5] text-[#6e6e73]">{text}</p>
      <p className={`mt-4 text-[12px] font-semibold ${chosen ? 'text-[#1d9c43]' : 'text-[#c0392b]'}`}>
        {chosen ? '✓ Chosen' : '✗ Rejected'}
      </p>
    </div>
  );
}

function ProcessStep({ n, label, title, children, accent = '#E60023' }: { n: string; label: string; title: string; children: React.ReactNode; accent?: string }) {
  return (
    <div className="case-reveal border-t border-black/10 pt-10">
      <div className="flex items-baseline gap-3">
        <span className="text-[14px] font-semibold" style={{ color: accent }}>{n}</span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a1a1a6]">{label}</span>
      </div>
      <h3 className="mt-4 max-w-[720px] text-[clamp(22px,2.6vw,32px)] font-semibold leading-[1.15] tracking-[-0.015em] text-[#1d1d1f]">
        {title}
      </h3>
      <div className="mt-5 max-w-[700px] space-y-5 text-[17px] leading-[1.7] text-[#56565b]">{children}</div>
    </div>
  );
}

function PinterestCaseStudy() {
  return (
    <article className="pb-32">
      {/* ===== Hero ===== */}
      <header className="px-6 pt-12 md:px-16 md:pt-16">
        <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#E60023]">UX Case Study · Pinterest</p>
        <h1 className="mt-5 max-w-[760px] text-[clamp(30px,4.4vw,58px)] font-semibold leading-[1.04] tracking-[-0.03em] text-[#1d1d1f]">
          When a platform you love starts working against you
        </h1>
        <p className="mt-6 max-w-[560px] text-[clamp(15px,1.5vw,18px)] leading-[1.55] text-[#6e6e73]">
          A personal investigation into two friction points that quietly erode the Pinterest experience, and the
          redesign solutions that give users back control.
        </p>

        <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-7 border-t border-black/10 pt-10 md:grid-cols-4">
          {pinterestMeta.map(([key, value]) => (
            <div key={key}>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a1a1a6]">{key}</dt>
              <dd className="mt-2 text-[15px] font-medium text-[#1d1d1f]">{value}</dd>
            </div>
          ))}
        </dl>
      </header>

      {/* ===== Hero visual ===== */}
      <div className="mt-14 px-6 md:mt-16 md:px-16">
        <figure className="mx-auto max-w-[1000px]">
          <div
            className="overflow-hidden rounded-[16px] border border-black/[0.08] bg-white"
            style={{ boxShadow: '0 34px 80px rgba(20,30,55,0.18), 0 10px 22px rgba(20,30,55,0.10)' }}
          >
            <div className="flex h-9 items-center gap-2 border-b border-black/[0.06] bg-[#f4f4f6] px-4">
              <span className="h-[10px] w-[10px] rounded-full bg-[#ff5f57]" />
              <span className="h-[10px] w-[10px] rounded-full bg-[#febc2e]" />
              <span className="h-[10px] w-[10px] rounded-full bg-[#28c840]" />
              <span className="ml-3 hidden h-[20px] flex-1 items-center rounded-full bg-white px-3 text-[11px] text-[#a1a1a6] sm:flex">
                pinterest.com
              </span>
            </div>
            <CaseImage
              src={`${PINTEREST_IMG}search-desktop-after.png`}
              alt="Pinterest home feed after the redesign"
              label="search-desktop-after.png"
              className="block aspect-[16/10] w-full object-cover object-top"
            />
          </div>
          <figcaption className="mx-auto mt-5 max-w-[620px] text-center text-[14px] leading-[1.5] text-[#86868b]">
            The redesign in one view: a quick search no longer hijacks your home feed, so the
            curation you built stays yours.
          </figcaption>
        </figure>
      </div>

      {/* ===== The Origin ===== */}
      <CaseSection eyebrow="The Origin" title="I didn't set out to do a case study. I just got annoyed.">
        <p>
          I&rsquo;ve been using Pinterest since I was around fourteen, almost a decade of saving outfits,
          collecting art references, and building mood boards for rooms I&rsquo;d never actually decorate. At its
          best, Pinterest feels less like social media and more like a personal archive of who you are and who you
          want to become.
        </p>
        <p>
          So when it started feeling frustrating, not dramatically, but in that quiet, persistent way where you
          notice you&rsquo;re enjoying something a little less every time, I paid attention. Design is rarely
          about dramatic failures; it&rsquo;s about the accumulation of small frictions that slowly make a product
          feel like it&rsquo;s working against you. This case study focuses on two such issues, both rooted in the
          same problem: the user has lost control of their own experience.
        </p>
      </CaseSection>

      <PullQuote>
        I wasn&rsquo;t trying to fix Pinterest. I was just trying to understand{' '}
        <span className="text-[#a1a1a6]">why I&rsquo;d started using it less.</span>
      </PullQuote>

      <div className="mt-14 grid gap-y-10 px-6 md:grid-cols-3 md:gap-x-12 md:px-16">
        {originStats.map(([value, label]) => (
          <BigStat key={label} value={value} label={label} />
        ))}
      </div>

      {/* ===== Discovery ===== */}
      <CaseSection eyebrow="Discovery" title="It wasn't just me, and that made it interesting.">
        <p>
          My first instinct was that I was being too critical. So I asked friends, over voice notes, casual
          messages, late-night calls. Not formal interviews. Just: &ldquo;does anything about Pinterest annoy
          you?&rdquo; What came back was the same frustrations, word for word, from people who&rsquo;d never
          thought about UX a day in their lives.
        </p>
      </CaseSection>

      <div className="mt-8 grid gap-4 px-6 md:grid-cols-2 md:px-16">
        {discoveryQuotes.map((quote) => (
          <FriendQuote key={quote.name} {...quote} />
        ))}
      </div>

      <PullQuote>
        The home page doesn&rsquo;t feel like mine anymore.{' '}
        <span className="text-[#a1a1a6]">For a platform whose entire value is personalization, that&rsquo;s a fundamental failure.</span>
      </PullQuote>

      <div className="mt-12 grid gap-4 px-6 sm:grid-cols-2 md:grid-cols-4 md:px-16">
        {insightCards.map((card) => (
          <InfoCard key={card.title} {...card} />
        ))}
      </div>

      {/* ===== Secondary Research ===== */}
      <CaseSection eyebrow="Secondary Research" title="It's all over Reddit, and has been for years.">
        <p>
          On r/Pinterest the same two frustrations recur for years, from users with no connection to each other,
          the same words, the same workarounds, the same defeated conclusions. The most telling sign wasn&rsquo;t
          the complaints. It was the answer people kept getting: &ldquo;just make a new account.&rdquo; That&rsquo;s
          not a workaround. That&rsquo;s a platform failing so completely the fix is to abandon what you built.
        </p>
      </CaseSection>

      <div className="mt-8 space-y-4 px-6 md:px-16">
        <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#a1a1a6]">
          Thread,&ldquo;Is there some way to explore pins without affecting my home feed?&rdquo;
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <RedditQuote user="greendolphinfeet" votes="1" text="Should I just create a new account for fashion related pins? That's what I'd do." />
          <RedditQuote user="Alternative_Tell_781" votes="1" text="Unfortunately I believe the only option right now is to make a separate account." />
        </div>
        <CaseFigure src="reddit-explore.png" caption="r/Pinterest · QueenMackeral · 3 years ago, still no solution from Pinterest." className="aspect-[16/10] object-contain" />
      </div>

      <div className="mt-12 space-y-4 px-6 md:px-16">
        <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#a1a1a6]">
          Thread,&ldquo;Pinterest is not the same anymore...&rdquo; · 373 upvotes · 79 comments
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <RedditQuote user="aeconic" votes="16" text="FOR REAL. If I search up something on Pinterest, the first like 20 pins are ALL ADS. It takes me four swipes to get past them. Absolutely ridiculous." />
          <RedditQuote user="njomw" votes="15" text="As an artist, Pinterest was a great source of inspiration. I had 7k followers. Then they commercialized it, my views dropped into the low 100s, and it became impossible to find new artists or inspiration." />
          <RedditQuote user="AcceptableBee1592" votes="35" text="If I didn't have my Pinterest boards the way I wanted them I'd probably delete the app now. Pinterest is going to have to make some really hard rules soon or die out." />
          <RedditQuote user="lbhall06757" votes="2" text="I even tried using quotes like other searches and it still brings up items that have little or nothing to do with what I am searching for. Losing interest in Pinterest!" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <CaseFigure src="reddit-artists.png" caption="The comment thread, artists & long-term users on the algorithm shift." className="aspect-[16/10] object-contain" />
          <CaseFigure src="reddit-disengaging.png" caption="More responses, users describing how they've disengaged." className="aspect-[16/10] object-contain" />
        </div>
      </div>

      <PullQuote>
        Pinterest itself acknowledged the feed problem in 2019 with &ldquo;Tune Your Home Feed.&rdquo; Early testing
        cut complaints by over 50%.{' '}
        <span className="text-[#a1a1a6]">They built the fix, then buried it five layers deep in settings where nobody would find it.</span>
      </PullQuote>

      <div className="mt-12 grid gap-4 px-6 sm:grid-cols-2 md:grid-cols-4 md:px-16">
        {researchStats.map((card) => (
          <InfoCard key={card.title} {...card} />
        ))}
      </div>

      {/* ===== Problem 01 ===== */}
      <CaseSection eyebrow="Problem 01" title="Saving to boards is a one-at-a-time chore.">
        <p>
          Saving a pin to multiple boards means repeating the entire save flow from scratch for each one. Tap save.
          Pick a board. Sheet closes. Reopen the pin. Tap save again. Repeat indefinitely. In isolation it sounds
          minor; in practice it&rsquo;s a compounding tax on organization. The more boards you have, devoted users
          often have twenty or thirty, the more painful it gets. So most users stop. They pick one board, or
          don&rsquo;t save at all.
        </p>
      </CaseSection>

      <div className="mt-8 px-6 md:px-16">
        <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#a1a1a6]">
          Real user evidence, my own Pinterest · mobile
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <CaseFigure src="save-1.png" caption="Step 1: one save button. Tapping it opens a board picker, one board at a time." className="aspect-[9/19] object-contain" />
          <CaseFigure src="save-2.png" caption="Step 2: pick a board and the sheet closes immediately. Want another? Start over." className="aspect-[9/19] object-contain" />
          <CaseFigure src="save-3.png" caption="Step 3: repeat for a second board. Two saves = two full actions." className="aspect-[9/19] object-contain" />
        </div>
      </div>

      <div className="mt-10 px-6 md:px-16">
        <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#a1a1a6]">Desktop, same issue</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <CaseFigure src="save-desktop-1.png" caption="Save modal, selecting one board confirms and dismisses immediately." className="aspect-[16/10] object-contain" />
          <CaseFigure src="save-desktop-2.png" caption="Had to reopen the entire modal to save to a second board." className="aspect-[16/10] object-contain" />
          <CaseFigure src="save-desktop-3.png" caption="The 'Saved' state shows just one board, repeat for every other." className="aspect-[16/10] object-contain" />
        </div>
      </div>

      <CaseSection eyebrow="The Redesign, Multi-select save" title="Check multiple boards, confirm once.">
        <p>
          One action instead of many. Before opening Figma there were napkin sketches, friend reviews, and
          back-and-forth. I started phone-first, most saves happen on mobile, and small screens force sharp
          decisions about hierarchy. If it works thumb-first, desktop is downhill.
        </p>
      </CaseSection>

      <div className="mt-10 space-y-10 px-6 md:px-16">
        <ProcessStep n="01" label="The spark" title="The night I saved the same pin five times.">
          <p>
            Building a mood board at midnight, a linen dress kept showing up that I wanted in summer fits, florals,
            and wedding guest. After the third &ldquo;reopen → save → pick → confirm → close&rdquo; loop for the
            same pin, I just stopped. I&rsquo;d been doing this for nine years. Why wasn&rsquo;t this already how it
            works?
          </p>
        </ProcessStep>

        <ProcessStep n="02" label="Sketch" title="The first sketch took 90 seconds.">
          <p>
            Almost embarrassingly small: a checkbox next to every board, one save button at the bottom. I sketched
            both surfaces but spent most of the time on mobile, because that&rsquo;s where the friction is loudest.
          </p>
        </ProcessStep>

        <ProcessStep n="03" label="Friend test #1" title="I showed two friends. They poked holes in it.">
          <div className="grid gap-4 md:grid-cols-2">
            <FriendQuote initial="S" name="Sara" text="Wait, when I tap the first board, does the sheet just close like it does now? Or does it stay so I can keep picking?" />
            <FriendQuote initial="N" name="Nour" text="I'd want to know how many I've picked before I hit save. If I check four and meant three, I'd want to catch it." />
          </div>
          <p>
            <span className="font-medium text-[#1d1d1f]">Insight:</span> the sketch had no live state. The user is
            making decisions in their head but the UI gives no feedback until they commit. That&rsquo;s a trust gap.
          </p>
        </ProcessStep>

        <ProcessStep n="04" label="Iteration" title="Made the state visible.">
          <p>
            Two changes. A persistent Save button locked to the bottom with the count baked into its label,
            &ldquo;Save to 3 boards&rdquo;, updating the instant you tap a checkbox. And the sheet no longer
            auto-closes until you hit Save. The flow is the user&rsquo;s job now, not a script Pinterest runs on
            them.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[14px] border border-black/10 px-5 py-4 text-center text-[14px] font-medium text-[#b3b3b9]">Select boards above</div>
            <div className="rounded-[14px] bg-[#1d1d1f] px-5 py-4 text-center text-[14px] font-semibold text-white">Save to 1 board</div>
            <div className="rounded-[14px] bg-[#E60023] px-5 py-4 text-center text-[14px] font-semibold text-white">Save to 3 boards</div>
          </div>
        </ProcessStep>

        <ProcessStep n="05" label="Color" title="What color should the selected state be?">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {multiColorChoices.map((choice) => (
              <ColorSwatch key={choice.name} {...choice} />
            ))}
          </div>
          <p>
            The red checkbox does double duty: it shows a board is selected, and it pre-tells you what the Save
            button will look like on confirm. The visual chain is unbroken from checkbox → button → commit.
          </p>
        </ProcessStep>

        <ProcessStep n="06" label="Friend test #2" title="Same friends. A quiet 'oh.'">
          <div className="grid gap-4 md:grid-cols-2">
            <FriendQuote initial="S" name="Sara" text="Oh wait. Yeah. Of course it should work this way. I don't even need to think about it." />
            <FriendQuote initial="N" name="Nour" text="The little count on the button is the part I'd actually trust. I always want to know what I'm about to do." />
          </div>
          <p>The flow felt invisible, like infrastructure. That&rsquo;s the green light to move into hi-fi.</p>
        </ProcessStep>
      </div>

      <div className="mt-12 px-6 md:px-16">
        <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#a1a1a6]">Proposed solution, designed in Figma</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <CaseFigure src="multi-pin.png" caption="One pin, three boards, this banana toast could live in food, vibes, and ig feed at once." className="aspect-[9/19] object-contain" />
          <CaseFigure src="multi-before.png" caption="Before, tap a board, it saves and closes. No selection state." className="aspect-[9/19] object-contain" />
          <CaseFigure src="multi-after.png" caption="After: check, check, check, one save. A checkbox per row, persistent red Save button with a live count." className="aspect-[9/19] object-contain" />
        </div>
      </div>

      <CaseSection eyebrow="Design rationale" title="Multi-board save, decision by decision." />
      <div className="mt-8 grid gap-4 px-6 md:grid-cols-2 md:px-16">
        <Choice chosen label="Checkboxes, right of each row">
          The most universally understood multi-select pattern, anyone who&rsquo;s filled in a form gets it. Round
          to match Pinterest&rsquo;s soft visual language; right-aligned so users read the board name, decide, then check.
        </Choice>
        <Choice chosen={false} label="Long-press or drag-to-select">
          Discoverable but invisible, users who don&rsquo;t know the gesture exists never find it, and it doesn&rsquo;t
          translate to desktop at all.
        </Choice>
        <Choice chosen label="Live count above the button">
          A constant summary of state so users don&rsquo;t scroll back to verify. It acts as a final preview:
          &ldquo;you&rsquo;re about to save to 2 boards, confirm?&rdquo;
        </Choice>
        <Choice chosen label='Dynamic label: "Save to N boards"'>
          The button confirms intent so there&rsquo;s no mental tracking. Static &ldquo;Save&rdquo; caused a beat of
          hesitation in testing, and friction at the final step risks abandoned actions.
        </Choice>
        <Choice chosen label="Replaces 'Create new board' as the primary CTA">
          Users save 50× before creating a board. The primary action should always be one tap away, where the thumb
          already goes. Create-new-board moves into the list, where it belongs.
        </Choice>
        <Choice chosen label="Safe under Pinterest's anti-spam rules">
          One deliberate save selecting 2–3 boards is the opposite of a bot blasting 40 boards. The design models
          exactly the thoughtful, intentional pinning Pinterest says it wants (and respects the 10-board cap).
        </Choice>
      </div>

      {/* ===== Problem 02 ===== */}
      <CaseSection eyebrow="Problem 02" title="One search. Your feed is never the same again.">
        <p>
          Pinterest&rsquo;s algorithm learns from everything, including searches. On the surface that sounds good.
          In practice, a single exploratory search permanently alters your feed. I searched &ldquo;room decor&rdquo;
          once, out of curiosity, and within minutes my home page surfaced interior content that had nothing to do
          with what I use Pinterest for. I hadn&rsquo;t asked it to. I had no way to prevent it.
        </p>
      </CaseSection>

      <div className="mt-8 px-6 md:px-16">
        <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#a1a1a6]">
          Algorithm contamination, captured minutes apart · mobile
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <CaseFigure src="search-mobile-before.png" caption="Home feed before any search, cute doodles, dolls, JoJo fanart. Months of curation." className="aspect-[9/19] object-contain" />
          <CaseFigure src="search-mobile-search.png" caption="One quick search for 'room decor.' Note the wire shoe-rack at the top." className="aspect-[9/19] object-contain" />
          <CaseFigure
            src="search-mobile-after.png"
            caption="One minute later, the same shoe-rack now lives in the home feed. The algorithm acted immediately."
            className="aspect-[9/19] object-contain"
            markers={[{ x: 51, y: 24, w: 47, h: 21, label: 'Same pin, now in your feed', labelPos: 'bottom' }]}
          />
        </div>
      </div>

      <div className="mt-10 px-6 md:px-16">
        <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#a1a1a6]">Desktop, the same contamination</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <CaseFigure src="search-desktop-before.png" caption="Clean, curated feed, design content, fonts, UI references." className="aspect-[16/10] object-contain" />
          <CaseFigure src="search-desktop-search.png" caption="One search query entered, no saving, no clicking through." className="aspect-[16/10] object-contain" />
          <CaseFigure src="search-desktop-after.png" caption="Room decor and home content now appear in the home feed, from one search." className="aspect-[16/10] object-contain" />
        </div>
      </div>

      <CaseSection eyebrow="The fix that exists but nobody finds">
        <p>
          Pinterest does have a buried &ldquo;Tune your home feed&rdquo; page. On paper the control exists. In
          practice it&rsquo;s invisible, reaching it takes five separate screens: Home → Profile → Settings →
          Privacy &amp; Data → Tune your home feed. I&rsquo;ve used Pinterest for nearly a decade and didn&rsquo;t
          know it existed until I went looking. That&rsquo;s not user error, it&rsquo;s an information architecture
          failure.
        </p>
      </CaseSection>

      <CaseSection eyebrow="The Redesign, Ghost Search" title="Search freely. Your feed stays exactly as you left it.">
        <p>
          The save flow was a structural problem with a clean answer. Ghost Search is a trust problem, and trust
          lives in details users can&rsquo;t articulate. The path from sketch to final ran through one uncomfortable
          round of feedback that almost made me start over.
        </p>
      </CaseSection>

      <div className="mt-10 space-y-10 px-6 md:px-16">
        <ProcessStep n="01" label="The spark" title="I caught myself not using the search bar.">
          <p>
            Twice in one week I opened Pinterest, hovered over the search bar, and closed the app instead, once for
            tattoo ideas, once for a recipe. I was protecting my feed. The platform had trained me to treat its
            primary discovery surface as a liability.
          </p>
        </ProcessStep>

        <ProcessStep n="02" label="Sketch" title="Started with the same instinct as Chrome incognito.">
          <p>
            Incognito works because the entry point is at the moment of action. So I put the toggle inside the search
            bar itself, phone-first again, since most sessions are mobile and the search bar is high-pressure UI on
            small screens.
          </p>
        </ProcessStep>

        <ProcessStep n="03" label="Friend test #1" title="They didn't understand it.">
          <div className="grid gap-4 md:grid-cols-2">
            <FriendQuote initial="L" name="Lana" text="What does ghost mean? Like… is it deleting my searches? I'd be scared to tap it." />
            <FriendQuote initial="M" name="Maya" text="Wait, does this hide me from other people? Like an invisible mode?" />
          </div>
          <p>
            <span className="font-medium text-[#1d1d1f]">Insight:</span> the metaphor only works after you know what
            it does. The first-time user needs plain language at the exact moment of activation, in the interface
            itself, not a help doc.
          </p>
        </ProcessStep>

        <ProcessStep n="04" label="Iteration" title="Added a banner that explains in plain English.">
          <p>
            Right under the bar, visible the moment ghost mode turns on: &ldquo;ghost mode, feed won&rsquo;t
            change.&rdquo; Six words, no icons doing language&rsquo;s job. The banner carries the first few uses;
            after that, the bar&rsquo;s color is enough.
          </p>
          <div className="overflow-hidden rounded-[14px]" style={{ background: '#26215C' }}>
            <div className="px-5 py-4 text-[14px] font-medium" style={{ color: '#CECBF6' }}>
              👻 &nbsp;ghost mode, feed won&rsquo;t change
            </div>
          </div>
        </ProcessStep>

        <ProcessStep n="05" label="Color" title="An entire afternoon picking a color.">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {ghostColorChoices.map((choice) => (
              <ColorSwatch key={choice.name} {...choice} />
            ))}
          </div>
          <p>
            With Pinterest red, ghost mode and normal search were indistinguishable, that was the bug. The whole
            point of a private mode is that the user can see they&rsquo;re in it. Color is the cheapest signal, and
            it had to be one Pinterest uses nowhere else.
          </p>
        </ProcessStep>

        <ProcessStep n="06" label="Friend test #2" title="This time they got it instantly.">
          <div className="grid gap-4 md:grid-cols-2">
            <FriendQuote initial="L" name="Lana" text="Oh, this is incognito! Like Chrome. Yeah, I'd actually use this, I'd use it constantly." />
            <FriendQuote initial="M" name="Maya" text="The little message under the bar is what sells it. I'd trust that. I wouldn't trust just the icon." />
          </div>
          <p>The color is the recognition. The banner is the contract. Round 01 saved the entire design.</p>
        </ProcessStep>
      </div>

      <div className="mt-12 px-6 md:px-16">
        <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#a1a1a6]">Proposed solution, designed in Figma</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <CaseFigure src="ghost-before.png" caption="Before, one bar, one mode. Every search trains the feed, with no way to opt out." className="aspect-[9/19] object-contain" />
          <CaseFigure src="ghost-active.png" caption="After: tap the ghost and the bar goes deep navy, banner reads 'feed won't change.' Impossible to miss." className="aspect-[9/19] object-contain" />
        </div>
      </div>

      <CaseSection eyebrow="Design rationale" title="Ghost Search, decision by decision." />
      <div className="mt-8 grid gap-4 px-6 md:grid-cols-2 md:px-16">
        <Choice chosen label="One bar, one toggle, not a second search bar">
          Ghost mode is a state of the search, not a separate product. Two bars overstate the difference and clutter
          the nav; one bar with a toggle keeps the right mental model and lets users decide at the moment of searching.
        </Choice>
        <Choice chosen label="Compact pill on the right of the bar">
          Always visible, never intrusive, the natural home for mode-modifiers (filters, camera, voice already live
          there). Inside the bar competes with the cursor; a tab above implies equal, everyday frequency.
        </Choice>
        <Choice chosen label="Deep navy (#26215C), not red/gray/black">
          Red reads as urgent action and blends with Save; gray reads as disabled; black mimics device-level
          incognito. Navy feels intentional and distinct, and pairs with soft lavender (#CECBF6) for a slightly
          otherworldly, on-metaphor palette.
        </Choice>
        <Choice chosen label="The whole bar changes color, not a small badge">
          A dot or badge is too easy to miss. Trust requires the user to feel the mode they&rsquo;re in, same
          principle as Chrome&rsquo;s incognito window, where the entire chrome changes.
        </Choice>
        <Choice chosen label='Persistent banner: "feed won’t change"'>
          Testing showed people misread ghost mode as hiding history from other people. The banner names the actual
          promise, privacy from the algorithm, in scannable plain language for first-time users.
        </Choice>
        <Choice chosen label="A ghost 👻, not a lock or shield">
          A lock implies encryption and over-promises; an eye-slash implies nobody&rsquo;s watching. A ghost lands
          the real promise, this leaves no trace, and keeps Pinterest&rsquo;s soft, playful tone.
        </Choice>
        <Choice chosen label="Saving still works in ghost mode">
          A save is an intentional preference signal, not a search signal, different things, treated differently.
          Ghost mode should be consequence-free exploration, not a restricted zone.
        </Choice>
        <Choice chosen label="Lavender text (#CECBF6), not pure white">
          White on navy passes AA but reads harsh and clinical. Lavender keeps a 4.8:1 contrast ratio while feeling
          warmer and reinforcing that you&rsquo;re in a shifted, different universe.
        </Choice>
      </div>

      {/* ===== Reflection ===== */}
      <CaseSection eyebrow="Reflection & Next Steps" title="What I'd do next.">
        <p>
          This is a focused redesign of two flows. A full product cycle would add structured testing, edge cases,
          and engineering scope: moderated usability tests (especially for ghost mode, which lives on trust); edge
          cases like accidentally exiting ghost mid-search or undoing a multi-save; and accessibility, WCAG 2.1 AA
          touch targets, ghost-mode contrast in low-vision scenarios, and screen-reader labels for every count and
          dynamic button.
        </p>
      </CaseSection>

      <PullQuote>
        The best redesigns don&rsquo;t add features. They remove friction from the ones that already matter.
      </PullQuote>

      <CaseSection eyebrow="Closing">
        <p>
          Both solutions are intentionally minimal, no rebuilds, just one key addition each: selection state for
          boards, and session scope for search. Low engineering lift, high user impact. That ratio is the clearest
          signal that these are the right problems to solve, and the right level to solve them at.
        </p>
        <p className="text-[14px] text-[#a1a1a6]">Pinterest UX Case Study · Self-initiated · 2026 · Research · Interaction Design · UI Redesign</p>
      </CaseSection>
    </article>
  );
}

const DANI_ACCENT = '#6E66A6';
const DANI_INK = '#2A2640';
const DANI_IMG = '/projects/dani/';

const daniMeta: [string, string][] = [
  ['Role', 'Solo · UX, UI & front-end'],
  ['Timeline', 'Self-initiated · 2025'],
  ['Tools', 'Figma · React'],
  ['Platform', 'iOS + Web'],
];

const daniProblemCards: { emoji: string; title: string; text: string; highlight?: boolean }[] = [
  { emoji: '🙂', title: 'Mood, flattened', text: 'One app reduces a whole day to a single tappable emoji.' },
  { emoji: '📷', title: 'Memories, elsewhere', text: 'Another is just a photo journal, disconnected from how you felt.' },
  { emoji: '😴', title: 'Sleep, in a silo', text: 'A third tracks rest and steps but never asks why.' },
  { emoji: '💬', title: 'Nobody to talk to', text: 'And when you need to be heard, there’s no one on the other side.', highlight: true },
];

const daniOpportunityCards = [
  {
    n: '01',
    title: 'One ritual, many signals',
    text: 'Mood, sleep, a reflection and a photo, captured in one gentle daily check-in instead of four apps.',
  },
  {
    n: '02',
    title: 'A companion you own',
    text: "Dani isn’t a faceless chatbot. You choose its tone, set boundaries, and grow it over time.",
  },
  {
    n: '03',
    title: 'Gentle, never clinical',
    text: 'Soft color, a round friendly mascot and warm copy make checking in feel like care, not homework.',
  },
];

const daniOnboardingItems = [
  {
    emoji: '🎭',
    title: 'Personality presets',
    text: 'Playful, Friendly or Calm, the voice you find easiest to hear.',
  },
  {
    emoji: '🔔',
    title: 'Check-in mode',
    text: "Dani can reach out when you’ve been away or down, only if you want it to.",
  },
  {
    emoji: '🔒',
    title: 'Privacy by default',
    text: 'A clear toggle keeps chats on-device. Trust is the product.',
  },
];

const daniCheckinSteps = [
  {
    n: '1',
    label: 'Mood',
    img: '03-checkin-mood.png',
    text: 'A draggable mood dial reads as feeling, not a checkbox, and the color shifts with you.',
  },
  {
    n: '2',
    label: 'Sleep',
    img: '04-checkin-sleep.png',
    text: 'Quality and hours in one vertical slider, each tier anchored by a face.',
  },
  {
    n: '3',
    label: 'Reflect',
    img: '05-checkin-reflect.png',
    text: 'Write it down, or tap “use voice instead.” No pressure to perform.',
  },
  {
    n: '4',
    label: 'Capture',
    img: '06-checkin-capture.png',
    text: 'A photo anchors the entry to a real moment: the dog, the sky, the coffee.',
  },
];

const daniRewardCards = [
  { emoji: '⏳', title: 'More talk-time', text: 'Extend sessions when you need longer.' },
  { emoji: '🧭', title: 'Deeper topics', text: 'Open new subjects to explore together.' },
  { emoji: '✨', title: 'New traits', text: 'Add personality and features over time.' },
];

const daniPalette: [string, string][] = [
  ['Dani', '#6E66A6'],
  ['Ink', '#2A2640'],
  ['Lavender', '#EFECFA'],
  ['Bubble', '#E4E1F1'],
  ['Canvas', '#FFFFFF'],
];

const daniMoodScale: [string, string, string][] = [
  ['Excellent', '7–9 hrs', '#50A850'],
  ['Good', '6–7 hrs', '#8DC73F'],
  ['Fair', '5 hrs', '#F3C12D'],
  ['Poor', '3–4 hrs', '#54B6D9'],
  ['Worst', '<3 hrs', '#6E8FE0'],
];

const daniNextSteps: [string, string][] = [
  ['Next: validate the ritual', 'Test the 4-step flow with real users to confirm it stays under a minute.'],
  ['Next: close the loop', 'Show how logged mood, sleep and photos resurface as gentle insights over time.'],
  ['Next: responsible AI', 'Define crisis hand-offs and clear limits, since Dani supports rather than diagnoses.'],
];

const DANI_PHONE_SHADOW = '0 38px 70px rgba(46, 40, 80, 0.18), 0 12px 24px rgba(46, 40, 80, 0.12)';
const DANI_PHONE_SHADOW_SOFT = '0 24px 48px rgba(46, 40, 80, 0.14), 0 6px 14px rgba(46, 40, 80, 0.08)';
const DANI_PHONE_RADIUS = '28px';
const DANI_DESKTOP_RADIUS = '18px';

function DaniPhone({
  src,
  alt,
  className = '',
  shadow = DANI_PHONE_SHADOW,
  float = false,
}: {
  src: string;
  alt: string;
  className?: string;
  shadow?: string;
  float?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden ${float ? 'dani-float' : ''} ${className}`}
      style={{ borderRadius: DANI_PHONE_RADIUS, boxShadow: shadow }}
    >
      <img
        src={`${DANI_IMG}${src}`}
        alt={alt}
        loading="lazy"
        className="block h-auto w-full object-contain"
      />
    </div>
  );
}

function DaniSectionHeader({
  eyebrow,
  title,
  intro,
  align = 'left',
}: {
  eyebrow: string;
  title?: string;
  intro?: string;
  align?: 'left' | 'center';
}) {
  return (
    <header
      className={`case-reveal mx-auto max-w-[860px] px-6 md:px-16 ${align === 'center' ? 'text-center' : ''}`}
    >
      <p
        className="text-[11px] font-semibold uppercase tracking-[0.22em]"
        style={{ color: DANI_ACCENT }}
      >
        {eyebrow}
      </p>
      {title ? (
        <h2
          className="mt-5 text-[clamp(28px,4.2vw,52px)] font-semibold leading-[1.06] tracking-[-0.025em]"
          style={{ color: DANI_INK }}
        >
          {title}
        </h2>
      ) : null}
      {intro ? (
        <p
          className={`mt-6 text-[clamp(17px,1.85vw,20px)] leading-[1.6] text-[#56565b] ${
            align === 'center' ? 'mx-auto max-w-[620px]' : 'max-w-[640px]'
          }`}
        >
          {intro}
        </p>
      ) : null}
    </header>
  );
}

function DaniCaseStudy() {
  return (
    <article
      className="pb-32 text-[#1d1d1f]"
      style={{ fontFamily: APPLE_FONT_STACK, background: '#fbfaf8' }}
    >
      {/* ===== Hero ===== */}
      <header className="relative overflow-hidden px-6 pt-12 md:px-16 md:pt-16">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[520px]"
          style={{
            background:
              'radial-gradient(120% 70% at 78% 22%, rgba(110,102,166,0.18) 0%, rgba(110,102,166,0.06) 38%, rgba(255,255,255,0) 70%)',
          }}
        />
        <div className="relative grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.24em]"
              style={{ color: DANI_ACCENT }}
            >
              UX / UI Case Study · Dani
            </p>
            <h1
              className="mt-5 max-w-[620px] text-[clamp(30px,4.4vw,58px)] font-semibold leading-[1.04] tracking-[-0.03em]"
              style={{ color: DANI_INK }}
            >
              Your mood, your day, and someone to talk to.
            </h1>
            <p className="mt-6 max-w-[500px] text-[clamp(15px,1.5vw,18px)] leading-[1.55] text-[#56565b]">
              A concept app that folds mood, sleep, journaling and photos into one daily ritual,
              with a customizable AI companion you can shape into the listener you actually need.
            </p>
          </div>
          <div className="relative flex justify-center md:justify-end">
            <DaniPhone
              src="01-hero-welcome.png"
              alt="Dani welcome screen"
              float
              className="max-w-[280px]"
            />
          </div>
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-x-10 gap-y-8 border-t border-black/[0.08] pt-10 md:grid-cols-4">
          {daniMeta.map(([key, value]) => (
            <div key={key}>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9b9ba2]">
                {key}
              </dt>
              <dd className="mt-3 text-[15px] font-medium text-[#1d1d1f]">{value}</dd>
            </div>
          ))}
        </dl>
      </header>

      {/* ===== 01 Problem ===== */}
      <section className="mt-32 md:mt-44">
        <DaniSectionHeader
          eyebrow="01 · The problem"
          title="Your inner life is scattered across a dozen apps."
          intro="Most wellness apps each own one tiny slice of how you feel. You bounce between them, the data never connects, and when a hard moment actually hits, none of them can hold a conversation."
        />
        <div className="mx-auto mt-16 grid max-w-[1080px] gap-x-12 gap-y-12 px-6 sm:grid-cols-2 md:grid-cols-4 md:px-16">
          {daniProblemCards.map((card) => (
            <div key={card.title} className="case-reveal">
              <div className="text-[32px]">{card.emoji}</div>
              <p className="mt-4 text-[17px] font-semibold tracking-[-0.005em]" style={{ color: DANI_INK }}>
                {card.title}
              </p>
              <p className="mt-2 text-[15px] leading-[1.6] text-[#6e6e73]">{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 02 Opportunity ===== */}
      <section className="mt-32 md:mt-44">
        <DaniSectionHeader
          eyebrow="02 · The opportunity"
          title="What if one space could hold all of it, and talk back?"
        />
        <div className="mx-auto mt-16 grid max-w-[1080px] gap-12 px-6 md:grid-cols-3 md:px-16">
          {daniOpportunityCards.map((card) => (
            <div key={card.n} className="case-reveal">
              <p
                className="text-[13px] font-semibold tracking-[0.18em]"
                style={{ color: DANI_ACCENT }}
              >
                {card.n}
              </p>
              <p
                className="mt-4 text-[20px] font-semibold leading-[1.25] tracking-[-0.01em]"
                style={{ color: DANI_INK }}
              >
                {card.title}
              </p>
              <p className="mt-3 text-[15px] leading-[1.65] text-[#6e6e73]">{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 03 Meet Dani — Onboarding ===== */}
      <section className="mt-32 md:mt-44">
        <div className="mx-auto grid max-w-[1180px] items-center gap-16 px-6 md:grid-cols-[0.95fr_1fr] md:gap-x-24 md:px-16">
          <div className="case-reveal order-2 md:order-1">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.22em]"
              style={{ color: DANI_ACCENT }}
            >
              03 · Meet Dani
            </p>
            <h2
              className="mt-5 text-[clamp(28px,3.8vw,46px)] font-semibold leading-[1.05] tracking-[-0.02em]"
              style={{ color: DANI_INK }}
            >
              A friend, shaped before the first hello.
            </h2>
            <p className="mt-6 max-w-[500px] text-[17px] leading-[1.65] text-[#56565b]">
              Onboarding leads with personality, not permissions. Before chatting, you tell Dani how it
              should talk and how present it should be, so support arrives in your language from day one.
            </p>
            <ul className="mt-10 space-y-7">
              {daniOnboardingItems.map((item) => (
                <li key={item.title} className="flex gap-5">
                  <span className="mt-1 text-[20px]">{item.emoji}</span>
                  <div>
                    <p className="text-[16px] font-semibold tracking-[-0.005em]" style={{ color: DANI_INK }}>
                      {item.title}
                    </p>
                    <p className="mt-1.5 text-[15px] leading-[1.6] text-[#6e6e73]">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="case-reveal order-1 flex justify-center md:order-2">
            <DaniPhone
              src="02-onboarding.png"
              alt="Onboarding, personality and privacy"
              className="max-w-[320px]"
            />
          </div>
        </div>
      </section>

      {/* ===== 04 Daily check-in ===== */}
      <section className="mt-32 md:mt-44">
        <DaniSectionHeader
          eyebrow="04 · The daily check-in"
          title="Four small steps that capture a whole day."
          intro="Each step is one tactile gesture: a dial, a slider, a few words, a photo. The progress pill (1 of 4) keeps it short and finishable, so the ritual sticks."
        />
        <div className="mx-auto mt-20 grid max-w-[1200px] gap-x-10 gap-y-16 px-6 sm:grid-cols-2 md:grid-cols-4 md:px-16">
          {daniCheckinSteps.map((step) => (
            <div key={step.n} className="case-reveal flex flex-col items-center text-center">
              <DaniPhone
                src={step.img}
                alt={`${step.label} step`}
                shadow={DANI_PHONE_SHADOW_SOFT}
                className="max-w-[240px]"
              />
              <div className="mt-7 flex items-center gap-2">
                <span
                  className="text-[11px] font-semibold tracking-[0.18em]"
                  style={{ color: DANI_ACCENT }}
                >
                  STEP {step.n}
                </span>
                <span className="text-[11px] tracking-[0.14em] text-[#c6c6cb]">·</span>
                <span
                  className="text-[11px] font-semibold uppercase tracking-[0.18em]"
                  style={{ color: DANI_INK }}
                >
                  {step.label}
                </span>
              </div>
              <p className="mt-4 max-w-[240px] text-[14px] leading-[1.6] text-[#6e6e73]">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="case-reveal mx-auto mt-32 max-w-[920px] px-6 text-center md:mt-44 md:px-16">
        <p
          className="text-[clamp(26px,3.6vw,40px)] font-medium leading-[1.22] tracking-[-0.018em]"
          style={{ color: DANI_INK }}
        >
          Mood, sleep, reflection, photo, captured in under a minute.
          <span className="block text-[#9b9ba2]">
            A ritual short enough to actually keep, deep enough to mean something.
          </span>
        </p>
      </div>

      {/* ===== 05 AI companion ===== */}
      <section className="mt-32 md:mt-44">
        <div className="mx-auto grid max-w-[1180px] items-center gap-16 px-6 md:grid-cols-[1fr_0.95fr] md:gap-x-24 md:px-16">
          <div className="case-reveal flex justify-center">
            <DaniPhone
              src="07-chat-companion.png"
              alt="Chat with Dani"
              className="max-w-[320px]"
            />
          </div>
          <div className="case-reveal">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.22em]"
              style={{ color: DANI_ACCENT }}
            >
              05 · An AI companion you can shape
            </p>
            <h2
              className="mt-5 text-[clamp(28px,3.8vw,46px)] font-semibold leading-[1.05] tracking-[-0.02em]"
              style={{ color: DANI_INK }}
            >
              Talking it through, earned a little at a time.
            </h2>
            <p className="mt-6 max-w-[520px] text-[17px] leading-[1.65] text-[#56565b]">
              The check-in feeds the conversation: Dani already knows you slept badly or had a heavy day,
              so the chat opens with context, not a blank box. Rather than an endless feed, showing up
              earns points you spend on going deeper.
            </p>
            <div className="mt-9 flex items-baseline justify-between border-t border-black/[0.08] pt-7">
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#9b9ba2]">
                Points unlock more of Dani
              </p>
              <p className="text-[14px] font-semibold" style={{ color: DANI_ACCENT }}>⭑ 530 pts</p>
            </div>
            <ul className="mt-7 grid gap-6 sm:grid-cols-3">
              {daniRewardCards.map((card) => (
                <li key={card.title}>
                  <div className="text-[22px]">{card.emoji}</div>
                  <p className="mt-3 text-[15px] font-semibold tracking-[-0.005em]" style={{ color: DANI_INK }}>
                    {card.title}
                  </p>
                  <p className="mt-1.5 text-[13.5px] leading-[1.55] text-[#6e6e73]">{card.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ===== 06 Home base ===== */}
      <section className="mt-32 md:mt-44">
        <DaniSectionHeader
          eyebrow="06 · A home that pulls it together"
          title="Mood, habits and to-dos, side by side."
          intro="The dashboard greets you by name, surfaces today’s mood, and nudges small habits beside a light to-do timeline. It scales from a glanceable phone home to a calm desktop overview."
        />
        <div className="case-reveal mx-auto mt-20 max-w-[1200px] px-6 md:px-16">
          <div
            className="overflow-hidden"
            style={{ borderRadius: DANI_DESKTOP_RADIUS, boxShadow: DANI_PHONE_SHADOW }}
          >
            <img
              src={`${DANI_IMG}08-dashboard-desktop.png`}
              alt="Dani desktop dashboard"
              loading="lazy"
              className="block w-full"
            />
          </div>
        </div>
        <div className="case-reveal mx-auto mt-20 flex max-w-[1200px] justify-center px-6 md:px-16">
          <DaniPhone src="09-home-mobile.png" alt="Dani mobile home" className="max-w-[300px]" />
        </div>
      </section>

      {/* ===== 07 Visual language ===== */}
      <section className="mt-32 md:mt-44">
        <DaniSectionHeader
          eyebrow="07 · Visual language"
          title="Soft, rounded and unmistakably calm."
        />

        <div className="mx-auto mt-20 grid max-w-[1080px] gap-16 px-6 md:grid-cols-2 md:px-16">
          <div className="case-reveal">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9b9ba2]">
              Palette
            </p>
            <div className="mt-7 space-y-4">
              {daniPalette.map(([name, hex]) => (
                <div key={hex} className="flex items-center gap-4">
                  <span
                    className="h-11 w-11 rounded-[12px]"
                    style={{
                      background: hex,
                      boxShadow:
                        hex === '#FFFFFF'
                          ? 'inset 0 0 0 1px rgba(0,0,0,0.06)'
                          : 'inset 0 0 0 1px rgba(0,0,0,0.04)',
                    }}
                  />
                  <div className="flex flex-1 items-baseline justify-between">
                    <p className="text-[15px] font-medium" style={{ color: DANI_INK }}>{name}</p>
                    <p className="font-mono text-[12px] tracking-wide text-[#9b9ba2]">{hex}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="case-reveal">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9b9ba2]">
              Type
            </p>
            <div className="mt-7">
              <p
                className="text-[34px] leading-[1.05] tracking-[-0.015em]"
                style={{ color: DANI_INK, fontFamily: '"Bricolage Grotesque", Georgia, serif' }}
              >
                Bricolage Grotesque
              </p>
              <p className="mt-2 text-[13px] uppercase tracking-[0.14em] text-[#9b9ba2]">
                Display · headlines &amp; mood prompts
              </p>
            </div>
            <div className="mt-9 border-t border-black/[0.08] pt-8">
              <p
                className="text-[26px] leading-[1.1]"
                style={{ color: DANI_INK, fontFamily: '"DM Sans", -apple-system, system-ui, sans-serif' }}
              >
                DM Sans
              </p>
              <p className="mt-2 text-[13px] uppercase tracking-[0.14em] text-[#9b9ba2]">
                Text · UI, captions &amp; reflections
              </p>
            </div>
          </div>
        </div>

        <div className="case-reveal mx-auto mt-20 max-w-[1080px] px-6 md:px-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9b9ba2]">
            Mood scale · one color story across the app
          </p>
          <div className="mt-7 grid gap-5 sm:grid-cols-5">
            {daniMoodScale.map(([label, hours, color]) => (
              <div key={label}>
                <span
                  className="block h-14 w-full rounded-[14px]"
                  style={{ background: color, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.04)' }}
                />
                <p className="mt-4 text-[14px] font-semibold" style={{ color: DANI_INK }}>{label}</p>
                <p className="mt-1 text-[12.5px] text-[#9b9ba2]">{hours}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Reflection ===== */}
      <section className="mt-32 md:mt-44">
        <DaniSectionHeader
          eyebrow="Reflection &amp; next steps"
          title="What I’d carry forward."
        />
        <div className="mx-auto mt-10 max-w-[760px] space-y-6 px-6 text-[17px] leading-[1.75] text-[#56565b] md:px-16">
          <p>
            Combining four “single-purpose” app ideas into one ritual forced a lot of hard editing. The
            win was making each step a single gesture, so the whole check-in still feels light.
          </p>
          <p>
            Framing the AI as a companion you customize and unlock, rather than an always-on chatbot,
            kept the tone caring and gave the gamification a reason to exist beyond streaks. Prototyping
            the front-end myself also kept those design decisions honest about what was actually buildable.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-[1080px] gap-x-10 gap-y-10 px-6 md:grid-cols-3 md:px-16">
          {daniNextSteps.map(([title, text]) => (
            <div key={title} className="case-reveal border-t border-black/[0.08] pt-6">
              <p className="text-[15px] font-semibold tracking-[-0.005em]" style={{ color: DANI_INK }}>
                {title}
              </p>
              <p className="mt-3 text-[15px] leading-[1.65] text-[#6e6e73]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-32 px-6 md:mt-44 md:px-16">
        <div className="mx-auto max-w-[760px] border-t border-black/[0.08] pt-10 text-center">
          <p className="text-[15px] leading-[1.7] text-[#56565b]">
            Dani isn’t a tracker, and it isn’t a therapist. It’s the in-between, a calm space that
            listens, remembers, and grows with you, designed so the smallest day still has somewhere to land.
          </p>
          <p className="mt-8 text-[12px] uppercase tracking-[0.18em] text-[#9b9ba2]">
            Dani · UX / UI Case Study · Self-initiated · 2025
          </p>
        </div>
      </footer>
    </article>
  );
}

function WhosBlankCaseStudy() {
  return <div className="wb-case" dangerouslySetInnerHTML={{ __html: whosBlankHtml }} />;
}

function CosmeticsGrowthCaseStudy() {
  return <div className="cg-case" dangerouslySetInnerHTML={{ __html: cosmeticsGrowthHtml }} />;
}

function PortfolioCaseStudy() {
  return <div className="pf-case" dangerouslySetInnerHTML={{ __html: portfolioCaseHtml }} />;
}

const CONTACT_NEED = ['Design', 'Build', 'Design + build', 'Not sure yet'];
const CONTACT_TYPE = ['Website', 'Web app', 'Mobile app', 'Branding', 'Other'];
const CONTACT_BUDGET = ['Under $1k', '$1k–3k', '$3k–8k', '$8k+', 'Not sure'];
const CONTACT_TIMELINE = ['ASAP', '2–4 weeks', '1–2 months', 'Flexible'];

function ChipGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div>
      <p className="mb-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#86868b]">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = value === option;

          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(selected ? '' : option)}
              className={`rounded-full border px-3.5 py-2 text-[13.5px] font-medium transition duration-200 ${
                selected
                  ? 'border-[#1d1d1f] bg-[#1d1d1f] text-white'
                  : 'border-black/15 text-[#1d1d1f] hover:border-black/40'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ContactModal({ email, onClose }: { email: string; onClose: () => void }) {
  const [need, setNeed] = useState('');
  const [projectType, setProjectType] = useState('');
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const buildMailto = () => {
    const subjectBits = [need, projectType].filter(Boolean).join(' · ');
    const subject = `New project inquiry${subjectBits ? ` — ${subjectBits}` : ''}`;
    const intro =
      need || projectType
        ? `I'm interested in ${need ? need.toLowerCase() : 'working with you'}${
            projectType ? ` for a ${projectType.toLowerCase()}` : ''
          }.`
        : "I'd love to talk about a project.";
    const lines = [
      'Hi Shaimaa,',
      '',
      intro,
      budget ? `Budget: ${budget}` : '',
      timeline ? `Timeline: ${timeline}` : '',
      message ? `\n${message}` : '',
      '',
      name ? `— ${name}` : '',
    ].filter((line) => line !== '');

    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
  };

  const submit = () => {
    window.location.href = buildMailto();
    onClose();
  };

  const inputClass =
    'w-full rounded-[14px] border border-black/[0.12] bg-[#fafafa] px-4 py-3 text-[14.5px] text-[#1d1d1f] outline-none transition placeholder:text-[#a1a1a6] focus:border-black/40 focus:bg-white';

  return (
    <div
      className="project-modal-backdrop fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Start a project"
      onClick={onClose}
    >
      <div
        className="project-modal-panel relative flex max-h-[92vh] w-full max-w-[540px] flex-col overflow-hidden rounded-[28px] bg-white text-black shadow-[0_40px_120px_rgba(0,0,0,0.4)]"
        onClick={(event) => event.stopPropagation()}
        style={{ fontFamily: APPLE_FONT_STACK }}
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-6 md:px-8 md:pt-8">
          <div>
            <h2 className="text-[clamp(22px,3vw,26px)] font-semibold tracking-[-0.02em] text-[#1d1d1f]">
              Start a project
            </h2>
            <p className="mt-1.5 text-[14.5px] leading-[1.45] text-[#6e6e73]">
              A few quick taps and your email writes itself.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f0f0f2] text-[#1d1d1f] transition hover:bg-[#e3e3e6]"
          >
            <span className="modal-x" aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6 md:px-8">
          <ChipGroup label="What do you need" options={CONTACT_NEED} value={need} onChange={setNeed} />
          <ChipGroup label="Project type" options={CONTACT_TYPE} value={projectType} onChange={setProjectType} />
          <ChipGroup label="Budget" options={CONTACT_BUDGET} value={budget} onChange={setBudget} />
          <ChipGroup label="Timeline" options={CONTACT_TIMELINE} value={timeline} onChange={setTimeline} />

          <div className="grid gap-4">
            <div>
              <label htmlFor="contact-name" className="mb-2.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-[#86868b]">
                Your name
              </label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Jane Doe"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="mb-2.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-[#86868b]">
                Anything else <span className="font-medium normal-case tracking-normal text-[#a1a1a6]">(optional)</span>
              </label>
              <textarea
                id="contact-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="A sentence or two about the idea…"
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-black/[0.06] bg-white/80 px-6 py-5 backdrop-blur-xl md:px-8">
          <button
            type="button"
            onClick={submit}
            className="w-full rounded-full bg-[#1d1d1f] py-3.5 text-[15px] font-semibold text-white transition hover:bg-black"
          >
            Compose email →
          </button>
          <p className="mt-3 text-center text-[13px] text-[#86868b]">
            or{' '}
            <a href={`mailto:${email}`} className="font-medium text-[#1d1d1f] underline underline-offset-2">
              email me directly
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

function ProjectModal({ projectId, onClose }: { projectId: string; onClose: () => void }) {
  const project = projects.find((item) => item.id === projectId);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div
      className="project-modal-backdrop fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-2.5 backdrop-blur-md md:p-5"
      role="dialog"
      aria-modal="true"
      aria-label={project ? `${project.title} case study` : 'Project case study'}
      onClick={onClose}
    >
      <div
        className="project-modal-panel relative flex h-[96vh] w-full max-w-[1180px] flex-col overflow-hidden rounded-[26px] bg-white text-black shadow-[0_40px_120px_rgba(0,0,0,0.45)] md:h-[94vh] md:rounded-[34px]"
        onClick={(event) => event.stopPropagation()}
        style={{ fontFamily: APPLE_FONT_STACK }}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-black/[0.06] bg-white/80 px-5 py-4 backdrop-blur-xl md:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#a1a1a6]">
              {project ? `Case ${project.id}` : 'Case study'}
            </span>
            {project ? (
              <>
                <span className="h-3.5 w-px shrink-0 bg-black/10" aria-hidden="true" />
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: project.accent }}
                    aria-hidden="true"
                  />
                  <span className="truncate text-[13.5px] font-semibold tracking-[-0.01em] text-[#1d1d1f]">
                    {project.title}
                  </span>
                </span>
              </>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0f0f2] text-[#1d1d1f] transition hover:bg-[#e3e3e6]"
          >
            <span className="modal-x" aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>

        <div className="case-scroll flex-1 overflow-y-auto overflow-x-hidden">
          {projectId === '01' ? (
            <PinterestCaseStudy />
          ) : projectId === '02' ? (
            <DaniCaseStudy />
          ) : projectId === '03' ? (
            <WhosBlankCaseStudy />
          ) : projectId === '04' ? (
            <CosmeticsGrowthCaseStudy />
          ) : projectId === '05' ? (
            <PortfolioCaseStudy />
          ) : (
            <div className="px-6 py-32 text-center md:px-10">
              <h2 className="text-[clamp(28px,4vw,44px)] font-semibold tracking-[-0.01em] text-[#1d1d1f]">
                {project?.title}
              </h2>
              <p className="mx-auto mt-4 max-w-[440px] text-[16px] leading-[1.5] text-[#6e6e73]">
                Full case study coming soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
