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
      className="relative min-h-screen flex flex-col overflow-x-clip"
    >
      <div className="h-[80px] md:h-[100px]" />

      <div className="px-5 sm:px-8 md:px-10 overflow-hidden">
        <FadeIn delay={0.15} y={40}>
          <h1 className="hero-heading uppercase whitespace-nowrap w-full text-[14vw] sm:text-[16vw] md:text-[18vw] lg:text-[20vw]">
            Hi, I&apos;m Shim
          </h1>
        </FadeIn>
      </div>

      <div className="flex-1 flex items-center justify-center min-h-0 px-5 py-6 sm:py-8">
        <Magnet
          padding={150}
          strength={3}
          activeTransition="transform 0.3s ease-out"
          inactiveTransition="transform 0.6s ease-in-out"
          className="flex items-center justify-center"
        >
          <FadeIn delay={0.6} y={30}>
            <HeroSVG className="w-[clamp(180px,30vw,500px)] h-auto" />
          </FadeIn>
        </Magnet>
      </div>

      <div className="px-5 sm:px-8 md:px-10 pb-7 sm:pb-8 md:pb-10 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-5 sm:gap-6 relative z-20">
        <FadeIn delay={0.35} y={20}>
          <p
            className="text-mist font-light uppercase tracking-wide leading-snug max-w-[280px] sm:max-w-[220px] md:max-w-[280px]"
            style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
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
