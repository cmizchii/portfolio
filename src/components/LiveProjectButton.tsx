type LiveProjectButtonProps = {
  href?: string;
  label?: string;
};

export default function LiveProjectButton({
  href = '#contact',
  label = 'Case Study →',
}: LiveProjectButtonProps) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-full border-2 border-ink/80 text-ink font-display font-medium uppercase tracking-[0.18em] text-sm sm:text-base px-8 py-3 sm:px-10 sm:py-3.5 transition-colors duration-300 hover:bg-ink hover:text-white"
    >
      {label}
    </a>
  );
}
