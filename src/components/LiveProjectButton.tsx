type LiveProjectButtonProps = {
  href?: string;
  label?: string;
};

export default function LiveProjectButton({
  href = '#contact',
  label = 'Live Project',
}: LiveProjectButtonProps) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-full border-2 border-mist text-mist font-display font-medium uppercase tracking-widest text-sm sm:text-base px-8 py-3 sm:px-10 sm:py-3.5 transition-colors duration-300 hover:bg-mist/10"
    >
      {label}
    </a>
  );
}
