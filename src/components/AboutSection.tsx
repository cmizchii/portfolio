import FadeIn from './FadeIn';
import AnimatedText from './AnimatedText';
import ContactButton from './ContactButton';

const ABOUT_TEXT =
  "Three+ years designing and building digital experiences for brands that demand more than templates. My obsession is the detail others overlook — the one pixel out of place, the timing curve that makes a transition feel right, the typography rhythm that earns attention. I don't ship until it's beyond what was asked. Let's build something worth showing off.";

type Props = {
  onOpenInquiry: () => void;
};

export default function AboutSection({ onOpenInquiry }: Props) {
  return (
    <section
      id="about"
      className="relative min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-24 md:py-32 overflow-hidden"
    >
      <FadeIn delay={0.1} x={-80} duration={0.9} y={0}>
        <Decoration
          position="top-left"
          shape="moon"
          className="absolute top-[6%] left-[3%] sm:left-[5%] md:left-[7%] w-[80px] sm:w-[120px] md:w-[170px]"
        />
      </FadeIn>
      <FadeIn delay={0.15} x={80} duration={0.9} y={0}>
        <Decoration
          position="top-right"
          shape="cluster"
          className="absolute top-[8%] right-[3%] sm:right-[5%] md:right-[7%] w-[80px] sm:w-[120px] md:w-[170px]"
        />
      </FadeIn>
      <FadeIn delay={0.25} x={-80} duration={0.9} y={0}>
        <Decoration
          position="bottom-left"
          shape="diamond"
          className="absolute bottom-[10%] left-[5%] sm:left-[8%] md:left-[10%] w-[70px] sm:w-[100px] md:w-[140px]"
        />
      </FadeIn>
      <FadeIn delay={0.3} x={80} duration={0.9} y={0}>
        <Decoration
          position="bottom-right"
          shape="ring"
          className="absolute bottom-[10%] right-[5%] sm:right-[8%] md:right-[10%] w-[80px] sm:w-[110px] md:w-[160px]"
        />
      </FadeIn>

      <div className="relative z-10 flex flex-col items-center gap-10 sm:gap-14 md:gap-16 max-w-[600px]">
        <FadeIn delay={0} y={40}>
          <h2 className="ink-heading uppercase text-center text-[clamp(3rem,12vw,160px)] leading-none tracking-tight">
            About me
          </h2>
        </FadeIn>

        <AnimatedText
          text={ABOUT_TEXT}
          className="font-body font-medium text-center leading-relaxed max-w-[560px] text-[clamp(1rem,1.6vw,1.25rem)] text-ink"
        />
      </div>

      <div className="relative z-10 mt-16 sm:mt-20 md:mt-24">
        <FadeIn delay={0.1} y={20}>
          <ContactButton onClick={onOpenInquiry} label="Let's Work Together" />
        </FadeIn>
      </div>
    </section>
  );
}

function Decoration({
  shape,
  className,
}: {
  position: string;
  shape: 'moon' | 'cluster' | 'diamond' | 'ring';
  className: string;
}) {
  return (
    <div className={className} aria-hidden>
      {shape === 'moon' && (
        <svg viewBox="0 0 200 200" className="w-full h-auto">
          <defs>
            <linearGradient id="moonG" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2B2B2B" />
              <stop offset="100%" stopColor="#C9735B" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="78" fill="url(#moonG)" />
          <circle cx="135" cy="80" r="58" fill="#FFFFFF" />
        </svg>
      )}
      {shape === 'cluster' && (
        <svg viewBox="0 0 200 200" className="w-full h-auto">
          <rect x="20" y="20" width="60" height="60" rx="10" fill="#2B2B2B" />
          <circle cx="140" cy="50" r="32" fill="#C9735B" />
          <rect
            x="50"
            y="110"
            width="120"
            height="60"
            rx="30"
            fill="#2B2B2B"
            opacity="0.15"
          />
        </svg>
      )}
      {shape === 'diamond' && (
        <svg viewBox="0 0 200 200" className="w-full h-auto">
          <polygon points="100,20 180,100 100,180 20,100" fill="#C9735B" />
          <polygon
            points="100,50 150,100 100,150 50,100"
            fill="#FFFFFF"
            opacity="0.85"
          />
        </svg>
      )}
      {shape === 'ring' && (
        <svg viewBox="0 0 200 200" className="w-full h-auto">
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="#2B2B2B"
            strokeWidth="2"
          />
          <circle
            cx="100"
            cy="100"
            r="50"
            fill="none"
            stroke="#C9735B"
            strokeWidth="14"
          />
          <circle cx="100" cy="100" r="14" fill="#2B2B2B" />
        </svg>
      )}
    </div>
  );
}
