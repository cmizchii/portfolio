import FadeIn from './FadeIn';

const SERVICES = [
  {
    number: '01',
    name: 'UI/UX Design',
    description:
      'End-to-end product design — research, user flows, wireframes, and polished UI systems built around clarity, usability, and a clear point of view.',
  },
  {
    number: '02',
    name: 'Front-End Development',
    description:
      'Hand-coded HTML, CSS, JavaScript and Webflow builds that ship fast, scale cleanly, and preserve every pixel of the design intent.',
  },
  {
    number: '03',
    name: 'Website Redesign',
    description:
      'Refreshing existing sites that look dated or convert poorly — without losing the brand DNA — through targeted UX, visual, and performance upgrades.',
  },
  {
    number: '04',
    name: 'UX Audit & Consultation',
    description:
      'A clear-eyed read on your current product: where users get stuck, what to fix first, and the smallest changes that make the biggest difference.',
  },
  {
    number: '05',
    name: 'Branding',
    description:
      'Visual identity systems — logo, type, color, and the rules around how it all gets used — so your brand feels consistent everywhere it shows up.',
  },
];

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="flex flex-col px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] bg-canvas relative z-[2]"
    >
      <FadeIn delay={0} y={40}>
        <h2
          className="font-display font-black uppercase leading-none tracking-tight text-center w-full mb-16 sm:mb-20 md:mb-28 text-ink"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Services
        </h2>
      </FadeIn>

      <div className="flex flex-col w-full items-center">
        {SERVICES.map((service, i) => (
          <FadeIn
            key={service.number}
            delay={i * 0.1}
            y={30}
            className="flex flex-col items-center w-full max-w-5xl"
          >
            {i > 0 && <div className="w-full border-t border-ink/15" />}
            <div className="flex items-start gap-6 sm:gap-8 md:gap-10 py-8 sm:py-10 md:py-12 w-full">
              <span
                className="font-display font-black uppercase leading-none flex-shrink-0 text-ink"
                style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
              >
                {service.number}
              </span>
              <div className="flex flex-col gap-2 sm:gap-4 md:gap-5 pt-1">
                <span
                  className="font-display font-medium uppercase text-ink"
                  style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
                >
                  {service.name}
                </span>
                <span
                  className="font-display font-light leading-relaxed max-w-2xl text-ink/60"
                  style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}
                >
                  {service.description}
                </span>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
