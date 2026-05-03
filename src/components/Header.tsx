import FadeIn from './FadeIn';

export default function Header() {
  return (
    <FadeIn
      as="header"
      delay={0}
      y={-20}
      className="fixed top-0 left-0 w-full z-[999] blend-difference px-5 sm:px-8 md:px-10 pt-7 md:pt-9"
    >
      <div className="flex justify-between items-start">
        <div className="flex">
          <div>
            <h1 className="font-display text-[18px] md:text-[24px] font-semibold mb-1.5">
              Shaimaa Jamal
            </h1>
            <p className="font-body text-[14px] font-medium ml-6 hidden md:block leading-tight">
              ux/ui designer <br />
              available worldwide | GMT+7
            </p>
          </div>
        </div>

        <nav>
          <ul className="flex gap-7 md:gap-8 list-none">
            <li>
              <a
                href="#about"
                className="font-body text-[14px] font-medium uppercase tracking-wider hover:opacity-60 transition-opacity duration-300"
              >
                about
              </a>
            </li>
            <li>
              <a
                href="#work"
                className="font-body text-[14px] font-medium uppercase tracking-wider hover:opacity-60 transition-opacity duration-300"
              >
                work
              </a>
            </li>
            <li>
              <a
                href="#services"
                className="font-body text-[14px] font-medium uppercase tracking-wider hover:opacity-60 transition-opacity duration-300"
              >
                services
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="font-body text-[14px] font-medium uppercase tracking-wider hover:opacity-60 transition-opacity duration-300"
              >
                contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </FadeIn>
  );
}
