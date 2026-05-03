import FadeIn from './FadeIn';
import AnimatedText from './AnimatedText';
import ContactButton from './ContactButton';

const ABOUT_TEXT =
  "With more than three years of experience designing and building digital products, i focus on UX, UI systems, and clean front-end execution. My obsession is the detail others overlook — and i don't ship until it's beyond what was asked. Let's build something incredible together!";

type Props = {
  onOpenInquiry: () => void;
};

export default function AboutSection({ onOpenInquiry }: Props) {
  return (
    <section
      id="about"
      className="min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-20 relative bg-ink"
    >
      <FadeIn
        delay={0.1}
        x={-80}
        y={0}
        duration={0.9}
        className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] z-0"
      >
        <DecoMoon className="w-[120px] sm:w-[160px] md:w-[210px]" />
      </FadeIn>
      <FadeIn
        delay={0.25}
        x={-80}
        y={0}
        duration={0.9}
        className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] z-0"
      >
        <DecoDiamond className="w-[100px] sm:w-[140px] md:w-[180px]" />
      </FadeIn>
      <FadeIn
        delay={0.15}
        x={80}
        y={0}
        duration={0.9}
        className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] z-0"
      >
        <DecoCluster className="w-[120px] sm:w-[160px] md:w-[210px]" />
      </FadeIn>
      <FadeIn
        delay={0.3}
        x={80}
        y={0}
        duration={0.9}
        className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] z-0"
      >
        <DecoRing className="w-[130px] sm:w-[170px] md:w-[220px]" />
      </FadeIn>

      <div className="flex flex-col items-center gap-16 sm:gap-20 md:gap-24 max-w-4xl w-full relative z-10">
        <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16 w-full">
          <FadeIn delay={0} y={40}>
            <h2
              className="hero-heading uppercase text-center w-full"
              style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
            >
              About me
            </h2>
          </FadeIn>

          <AnimatedText
            text={ABOUT_TEXT}
            className="text-mist font-medium text-center leading-relaxed max-w-[560px]"
          />
        </div>

        <FadeIn delay={0.3} y={20}>
          <ContactButton onClick={onOpenInquiry} label="Contact Me" />
        </FadeIn>
      </div>
    </section>
  );
}

function DecoMoon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <defs>
        <radialGradient id="moonG" cx="0.35" cy="0.35" r="0.7">
          <stop offset="0%" stopColor="#BBCCD7" />
          <stop offset="100%" stopColor="#646973" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="80" fill="url(#moonG)" />
      <circle cx="125" cy="80" r="55" fill="#0C0C0C" />
    </svg>
  );
}

function DecoCluster({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <defs>
        <linearGradient id="clusterG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#B600A8" />
          <stop offset="50%" stopColor="#7621B0" />
          <stop offset="100%" stopColor="#BE4C00" />
        </linearGradient>
      </defs>
      <rect x="20" y="20" width="60" height="60" rx="10" fill="url(#clusterG)" />
      <circle cx="140" cy="50" r="32" fill="#BBCCD7" opacity="0.9" />
      <rect x="50" y="110" width="120" height="60" rx="30" fill="#646973" opacity="0.4" />
    </svg>
  );
}

function DecoDiamond({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <defs>
        <linearGradient id="diamG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#BBCCD7" />
          <stop offset="100%" stopColor="#646973" />
        </linearGradient>
      </defs>
      <polygon points="100,20 180,100 100,180 20,100" fill="url(#diamG)" />
      <polygon points="100,55 145,100 100,145 55,100" fill="#0C0C0C" />
    </svg>
  );
}

function DecoRing({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <circle cx="100" cy="100" r="82" fill="none" stroke="#646973" strokeWidth="2" />
      <circle cx="100" cy="100" r="50" fill="none" stroke="#B600A8" strokeWidth="14" />
      <circle cx="100" cy="100" r="14" fill="#BBCCD7" />
    </svg>
  );
}
