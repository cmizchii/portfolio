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
      className="relative min-h-screen flex flex-col overflow-x-clip overflow-y-visible"
    >
      <div className="flex flex-col flex-1 px-5 sm:px-8 md:px-10 relative z-0">
        <div className="h-[80px] md:h-[100px]" />

        <FadeIn delay={0.15} y={40} className="mt-6 sm:mt-4 md:-mt-2 overflow-hidden">
          <h1 className="hero-heading uppercase whitespace-nowrap w-full text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw]">
            Hi, i&apos;m shaimaa
          </h1>
        </FadeIn>

        <div className="flex-1" />

        <div className="flex justify-between items-end pb-7 sm:pb-8 md:pb-10 gap-6 relative z-20">
          <FadeIn delay={0.35} y={20}>
            <p
              className="text-mist font-light uppercase tracking-wide leading-snug max-w-[180px] sm:max-w-[240px] md:max-w-[300px]"
              style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
            >
              a ux/ui designer &amp; front-end developer driven by attention to detail and over-delivering quality
            </p>
          </FadeIn>

          <FadeIn delay={0.5} y={20}>
            <ContactButton onClick={onOpenInquiry} label="Contact Me" />
          </FadeIn>
        </div>
      </div>

      <Magnet
        padding={150}
        strength={3}
        activeTransition="transform 0.3s ease-out"
        inactiveTransition="transform 0.6s ease-in-out"
        className="absolute left-1/2 -translate-x-1/2 z-10 w-[260px] sm:w-[340px] md:w-[420px] lg:w-[500px] top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0"
      >
        <FadeIn delay={0.6} y={30}>
          <HeroSVG className="w-full h-auto" />
        </FadeIn>
      </Magnet>

      <DrawingCanvas />
    </section>
  );
}
