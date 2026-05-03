import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import FadeIn from './FadeIn';
import LiveProjectButton from './LiveProjectButton';

type Project = {
  number: string;
  category: string;
  name: string;
  href: string;
  images: { col1Top: string; col1Bottom: string; col2: string };
};

const PROJECTS: Project[] = [
  {
    number: '01',
    category: 'Client',
    name: 'Dental Marketing Agency',
    href: '#contact',
    images: {
      col1Top: 'placeholder',
      col1Bottom: 'placeholder',
      col2: 'placeholder',
    },
  },
];

export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="work"
      className="relative bg-canvas text-ink rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 z-[3] pt-20 sm:pt-24 md:pt-28 pb-32 px-5 sm:px-8 md:px-10"
    >
      <FadeIn delay={0} y={40}>
        <h2 className="ink-heading uppercase text-center text-[clamp(3rem,12vw,160px)] leading-none mb-16 sm:mb-20">
          Project
        </h2>
      </FadeIn>

      <div ref={containerRef} className="relative">
        {PROJECTS.map((p, i) => (
          <ProjectCard
            key={p.number}
            project={p}
            index={i}
            total={PROJECTS.length}
            container={containerRef}
          />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  total,
  container,
}: {
  project: Project;
  index: number;
  total: number;
  container: React.RefObject<HTMLDivElement | null>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    container,
    offset: ['start end', 'start start'],
  });

  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]) as MotionValue<number>;

  return (
    <div
      ref={ref}
      className="sticky-card top-24 md:top-32 h-[85vh] flex items-start justify-center"
      style={{ top: `${index * 28}px` }}
    >
      <motion.div
        style={{ scale }}
        className="w-full max-w-6xl rounded-[32px] sm:rounded-[44px] md:rounded-[56px] border-2 border-ink bg-canvas p-4 sm:p-6 md:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.06)]"
      >
        <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-8 mb-6 md:mb-8 px-2 sm:px-4">
          <span className="font-display font-extrabold leading-none text-ink text-[clamp(3rem,8vw,110px)] tabular-nums">
            {project.number}
          </span>
          <div className="flex-1 flex flex-col gap-1">
            <span className="font-body uppercase tracking-[0.2em] text-xs sm:text-sm text-ink/50">
              {project.category}
            </span>
            <h3 className="font-display font-medium uppercase text-[clamp(1.25rem,2.5vw,2.25rem)] leading-tight">
              {project.name}
            </h3>
          </div>
          <div>
            <LiveProjectButton href={project.href} label="Case Study →" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-4">
          <div className="md:col-span-2 flex flex-col gap-3 md:gap-4">
            <Placeholder
              label="01 / Hero"
              accent="ink"
              className="rounded-[28px] sm:rounded-[36px] md:rounded-[44px]"
              style={{ height: 'clamp(130px, 16vw, 230px)' }}
            />
            <Placeholder
              label="02 / Detail"
              accent="coral"
              className="rounded-[28px] sm:rounded-[36px] md:rounded-[44px]"
              style={{ height: 'clamp(160px, 22vw, 340px)' }}
            />
          </div>
          <div className="md:col-span-3">
            <Placeholder
              label="03 / Full Case"
              accent="soft"
              className="rounded-[28px] sm:rounded-[36px] md:rounded-[44px] h-full min-h-[300px] md:min-h-0"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Placeholder({
  label,
  accent,
  className,
  style,
}: {
  label: string;
  accent: 'ink' | 'coral' | 'soft';
  className?: string;
  style?: React.CSSProperties;
}) {
  const bg =
    accent === 'ink'
      ? 'bg-ink text-canvas'
      : accent === 'coral'
        ? 'bg-coral text-canvas'
        : 'bg-soft text-ink';
  return (
    <div
      className={`relative w-full overflow-hidden flex items-end p-5 sm:p-6 ${bg} ${className ?? ''}`}
      style={style}
    >
      <div className="absolute inset-0 opacity-20" aria-hidden>
        <svg
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern
              id={`p-${label}`}
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path d="M0 40L40 0" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#p-${label})`} />
        </svg>
      </div>
      <span className="relative font-body uppercase tracking-[0.2em] text-[10px] sm:text-xs">
        {label}
      </span>
    </div>
  );
}
