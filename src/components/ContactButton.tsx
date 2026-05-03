type ContactButtonProps = {
  onClick?: () => void;
  label?: string;
  href?: string;
};

export default function ContactButton({
  onClick,
  label = 'Start a Project',
  href,
}: ContactButtonProps) {
  const className =
    'inline-flex items-center justify-center font-display font-medium uppercase tracking-[0.18em] ' +
    'text-xs sm:text-sm md:text-base text-white bg-ink ' +
    'px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 ' +
    'transition-all duration-300 ease-out hover:bg-coral hover:tracking-[0.25em]';

  if (href) {
    return (
      <a href={href} className={className}>
        [ {label} ]
      </a>
    );
  }

  return (
    <button onClick={onClick} className={className}>
      [ {label} ]
    </button>
  );
}
