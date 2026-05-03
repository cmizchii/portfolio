import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import FadeIn from './FadeIn';
import LiveProjectButton from './LiveProjectButton';

type Project = {
  number: string;
  category: string;
  name: string;
  href: string;
};

const PROJECTS: Project[] = [
  {
    number: '01',
    category: 'Client',
    name: 'Dental Marketing Agency',
    href: '#contact',
  },
];

export default function ProjectsSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      id="work"
      ref={containerRef}
      className="relative px-5 sm:px-8 md:px-10 rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 z-10 bg-ink"
    >
      <div className="flex flex-col items-center py-20 sm:py-24 md:py-32">
        <FadeIn delay={0} y={40}>
          <h2
            className="hero-heading uppercase text-center w-full"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            Project
          </h2>
        </FadeIn>
      </div>

      {PROJECTS.map((project, index) => (
        <ProjectCard
          key={project.number}
          project={project}
          index={index}
          totalCards={PROJECTS.length}
          progress={scrollYProgress}
        />
      ))}
    </section>
  );
}

function ProjectCard({
  project,
  index,
  totalCards,
  progress,
}: {
  project: Project;
  index: number;
  totalCards: number;
  progress: MotionValue<number>;
}) {
  const rangeStart = index / totalCards;
  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const scale = useTransform(progress, [rangeStart, 1], [1, targetScale]);

  return (
    <div className="h-[85vh] flex items-start justify-center sticky top-24 md:top-32">
      <motion.div
        style={{
          scale,
          top: `${index * 28}px`,
          transformOrigin: 'top center',
        }}
        className="absolute w-full max-w-[1760px] rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-mist bg-ink p-4 sm:p-6 md:p-8 flex flex-col gap-6 sm:gap-8 md:gap-10"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 sm:gap-4 px-2 sm:px-4 pt-2 sm:pt-4">
          <div className="flex items-center gap-6 sm:gap-8 md:gap-10">
            <span
              className="text-mist font-display font-black uppercase leading-none"
              style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
            >
              {project.number}
            </span>
            <div className="flex flex-col gap-2 sm:gap-4 md:gap-6">
              <span
                className="text-mist font-display font-medium uppercase"
                style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
              >
                {project.category}
              </span>
              <span
                className="text-mist font-display font-light tracking-wide"
                style={{ fontSize: 'clamp(0.9rem, 2vw, 2rem)' }}
              >
                {project.name}
              </span>
            </div>
          </div>

          <LiveProjectButton href={project.href} label="Live Project" />
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:gap-5 w-full">
          <div className="flex flex-col gap-4 md:gap-5 w-full md:w-[40%]">
            <Placeholder
              accent="mist"
              className="rounded-[40px] sm:rounded-[50px] md:rounded-[60px]"
              style={{ height: 'clamp(130px, 16vw, 230px)' }}
            />
            <Placeholder
              accent="magenta"
              className="rounded-[30px] sm:rounded-[40px] md:rounded-[60px]"
              style={{ height: 'clamp(160px, 22vw, 340px)' }}
            />
          </div>
          <Placeholder
            accent="steel"
            className="rounded-[30px] sm:rounded-[40px] md:rounded-[60px] w-full md:w-[60%] md:h-auto self-stretch min-h-[280px]"
          />
        </div>
      </motion.div>
    </div>
  );
}

function Placeholder({
  accent,
  className,
  style,
}: {
  accent: 'mist' | 'magenta' | 'steel';
  className?: string;
  style?: React.CSSProperties;
}) {
  const bg =
    accent === 'mist'
      ? 'bg-mist/10 border border-mist/20'
      : accent === 'magenta'
        ? ''
        : 'bg-steel/30 border border-mist/10';

  const inlineStyle: React.CSSProperties =
    accent === 'magenta'
      ? {
          ...style,
          background:
            'linear-gradient(135deg, #18011F 0%, #B600A8 40%, #7621B0 70%, #BE4C00 100%)',
        }
      : style ?? {};

  return (
    <div
      className={`relative w-full overflow-hidden flex items-end p-5 sm:p-6 ${bg} ${className ?? ''}`}
      style={inlineStyle}
    >
      <span className="font-display uppercase tracking-[0.2em] text-[10px] sm:text-xs text-mist/70">
        Coming soon
      </span>
    </div>
  );
}
