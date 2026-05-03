import FadeIn from './FadeIn';

const SERVICES = [
  {
    number: '01',
    name: 'UI/UX Design',
    desc: 'End-to-end product design — research, user flows, wireframes, and polished UI systems built around clarity, usability, and a clear point of view.',
  },
  {
    number: '02',
    name: 'Front-End Development',
    desc: 'Hand-coded HTML, CSS, JavaScript and Webflow builds that ship fast, scale cleanly, and preserve every pixel of the design intent.',
  },
  {
    number: '03',
    name: 'Website Redesign',
    desc: 'Refreshing existing sites that look dated or convert poorly — without losing the brand DNA — through targeted UX, visual, and performance upgrades.',
  },
  {
    number: '04',
    name: 'UX Audit & Consultation',
    desc: 'A clear-eyed read on your current product: where users get stuck, what to fix first, and the smallest changes that make the biggest difference.',
  },
  {
    number: '05',
    name: 'Branding',
    desc: 'Visual identity systems — logo, type, color, and the rules around how it all gets used — so your brand feels consistent everywhere it shows up.',
  },
];

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="relative bg-soft text-ink rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 z-[2]"
    >
      <FadeIn delay={0} y={40}>
        <h2 className="ink-heading uppercase text-center text-[clamp(3rem,12vw,160px)] leading-none mb-16 sm:mb-20 md:mb-28">
          Services
        </h2>
      </FadeIn>

      <div className="max-w-5xl mx-auto">
        {SERVICES.map((s, i) => (
          <FadeIn key={s.number} delay={i * 0.1} y={30}>
            <div
              className={`flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-10 md:gap-16 py-8 sm:py-10 md:py-12 ${
                i === 0 ? 'border-t' : ''
              } border-b border-ink/15`}
            >
              <span className="font-display font-extrabold leading-none text-ink text-[clamp(2.5rem,10vw,140px)] tabular-nums">
                {s.number}
              </span>
              <div className="flex-1 sm:pt-4 md:pt-6">
                <h3 className="font-display font-medium uppercase tracking-tight text-[clamp(1rem,2.2vw,2.1rem)] mb-3 md:mb-4">
                  {s.name}
                </h3>
                <p className="font-body font-light leading-relaxed max-w-2xl opacity-60 text-[clamp(0.85rem,1.4vw,1.15rem)]">
                  {s.desc}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
