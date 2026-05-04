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

      <div className="px-5 sm:px-8 md:px-10 overflow-hidden shrink-0">
        <FadeIn delay={0.15} y={40}>
          <h1 className="hero-heading uppercase w-full flex justify-between items-baseline whitespace-nowrap text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw]">
            <span>HI,</span>
            <span>I&apos;M</span>
            <span>SHIM</span>
          </h1>
        </FadeIn>
      </div>

      <div className="flex-1 flex items-center justify-center min-h-0 px-5 py-2">
        <Magnet
          padding={150}
          strength={5}
          activeTransition="transform 0.3s ease-out"
          inactiveTransition="transform 0.6s ease-in-out"
          className="flex items-center justify-center max-h-full"
        >
          <FadeIn delay={0.6} y={30} className="max-h-full flex items-center justify-center">
            <HeroSVG className="h-auto w-auto max-h-[min(40vh,460px)] max-w-[min(34vw,460px)]" />
          </FadeIn>
        </Magnet>
      </div>

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
    </section>
  );
}
