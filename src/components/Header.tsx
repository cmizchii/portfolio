import FadeIn from './FadeIn';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
];

export default function Header() {
  return (
    <FadeIn
      as="header"
      delay={0}
      y={-20}
      className="fixed top-0 left-0 w-full z-[999] px-6 md:px-10 pt-6 md:pt-8"
    >
      <nav className="w-full flex justify-between items-center">
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-mist text-sm md:text-lg lg:text-[1.4rem] font-display font-medium uppercase tracking-wider hover:opacity-70 transition-opacity duration-200"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </FadeIn>
  );
}
