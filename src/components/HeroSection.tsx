import FadeIn from './FadeIn';
import Magnet from './Magnet';
import HeroSVG from './HeroSVG';
import ContactButton from './ContactButton';
import DrawingCanvas from './DrawingCanvas';

type HeroSectionProps = {
  onOpenInquiry: () => void;
};

export default function HeroSection({ onOpenInquiry }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col overflow-x-clip pt-[140px] md:pt-[180px] pb-12"
    >
      <div className="flex-1 flex flex-col justify-between">
        <div className="px-5 sm:px-8 md:px-10 overflow-hidden">
          <FadeIn delay={0.15} y={40}>
            <h1 className="ink-heading whitespace-nowrap leading-none text-[16vw] md:text-[15vw] lg:text-[14.5vw]">
              Shaimaa Jamal
            </h1>
          </FadeIn>
          <FadeIn delay={0.22} y={20}>
            <p className="font-serif italic text-coral text-[clamp(1rem,2.4vw,2rem)] mt-3 ml-1 leading-tight">
              ux/ui designer &amp; front-end developer
            </p>
          </FadeIn>
        </div>

        <div className="relative flex items-end justify-center mt-6 md:mt-2 mb-2">
          <Magnet
            padding={150}
            strength={3}
            activeTransition="transform 0.3s ease-out"
            inactiveTransition="transform 0.6s ease-in-out"
            className="relative z-10"
          >
            <HeroSVG className="w-[240px] sm:w-[300px] md:w-[360px] lg:w-[420px] h-auto" />
          </Magnet>
        </div>

        <FadeIn
          delay={0.4}
          y={20}
          className="px-5 sm:px-8 md:px-10 flex flex-col md:flex-row md:justify-between md:items-end gap-6"
        >
          <p className="font-body uppercase tracking-wide text-ink leading-snug max-w-[260px] sm:max-w-[300px] text-[clamp(0.75rem,1.4vw,1.1rem)]">
            i design &amp; build websites that help businesses grow — with attention
            to every detail
          </p>

          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            <Tag>UI/UX</Tag>
            <Diamond />
            <Tag>WEBFLOW</Tag>
            <Diamond />
            <Tag>FRONT END</Tag>
          </div>

          <FadeIn delay={0.55} y={20}>
            <ContactButton onClick={onOpenInquiry} label="Start a Project" />
          </FadeIn>
        </FadeIn>
      </div>

      <DrawingCanvas />
    </section>
  );
}

function Tag({ children }: { children: string }) {
  return (
    <span className="pill-tag font-display text-[clamp(10px,1.05vw,14px)] font-normal px-3 py-1">
      {children}
    </span>
  );
}

function Diamond() {
  return <span className="text-ink text-[8px]">◆</span>;
}
