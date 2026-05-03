type ContactButtonProps = {
  onClick?: () => void;
  label?: string;
  href?: string;
  className?: string;
};

export default function ContactButton({
  onClick,
  label = 'Contact Me',
  href,
  className = '',
}: ContactButtonProps) {
  const base =
    'contact-pill inline-flex items-center justify-center rounded-full font-display font-medium uppercase tracking-widest ' +
    'text-xs sm:text-sm md:text-base text-white whitespace-nowrap ' +
    'px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 ' +
    'transition-opacity duration-200 hover:opacity-90 active:opacity-75 ' +
    className;

  if (href) {
    return (
      <a href={href} className={base}>
        {label}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={base}>
      {label}
    </button>
  );
}
