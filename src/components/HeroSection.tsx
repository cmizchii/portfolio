import FadeIn from './FadeIn';
import Magnet from './Magnet';
import HeroSVG from './HeroSVG';
import ContactButton from './ContactButton';

type HeroSectionProps = {
  onOpenInquiry: () => void;
};

export default function HeroSection({ onOpenInquiry }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative h-screen min-h-[640px] flex flex-col overflow-x-clip overflow-y-hidden"
    >
      <div className="h-[64px] sm:h-[72px] md:h-[88px] shrink-0" />

      <div className="px-5 sm:px-8 md:px-10 overflow-hidden shrink-0 relative z-20">
        <FadeIn delay={0.15} y={40}>
          <h1 className="hero-heading uppercase w-full flex justify-between items-baseline whitespace-nowrap text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw]">
            <span>HI,</span>
            <span>I&apos;M</span>
            <span>SHIM</span>
          </h1>
        </FadeIn>
      </div>

      <div className="flex-1" />

      <div className="px-5 sm:px-8 md:px-10 pb-5 sm:pb-6 md:pb-8 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 sm:gap-6 relative z-20 shrink-0">
        <FadeIn delay={0.35} y={20}>
          <p
            className="text-mist font-light uppercase tracking-wide leading-snug max-w-[260px] sm:max-w-[220px] md:max-w-[280px]"
            style={{ fontSize: 'clamp(0.7rem, 1.2vw, 1.25rem)' }}
          >
            a ux/ui designer &amp; front-end developer driven by attention to detail and over-delivering quality
          </p>
        </FadeIn>

        <FadeIn delay={0.5} y={20} className="self-start sm:self-auto">
          <ContactButton onClick={onOpenInquiry} label="Contact Me" />
        </FadeIn>
      </div>

      <Magnet
        padding={150}
        strength={5}
        activeTransition="transform 0.3s ease-out"
        inactiveTransition="transform 0.6s ease-in-out"
        className="absolute left-1/2 -translate-x-1/2 bottom-[80px] sm:bottom-[96px] md:bottom-[112px] z-10 pointer-events-none"
      >
        <FadeIn delay={0.6} y={30}>
          <HeroSVG className="h-[min(72vh,820px)] w-auto" />
        </FadeIn>
      </Magnet>
    </section>
  );
}
