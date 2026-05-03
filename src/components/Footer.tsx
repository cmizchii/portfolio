import { useEffect, useRef, useState } from 'react';
import FadeIn from './FadeIn';

export default function Footer() {
  const bigRef = useRef<HTMLHeadingElement>(null);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = bigRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const within =
        Math.abs(dx) < rect.width / 2 + 200 &&
        Math.abs(dy) < rect.height / 2 + 200;
      if (within) {
        setTranslate({ x: dx / 8, y: dy / 8 });
      } else {
        setTranslate({ x: 0, y: 0 });
      }
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer id="contact" className="relative bg-canvas pt-24 md:pt-32 px-5 sm:px-8 md:px-10">
      <FadeIn delay={0.1} y={20}>
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8 md:gap-0 pt-10 pb-14 border-t border-ink/15">
          <div className="flex flex-col gap-2">
            <a
              onClick={scrollTop}
              className="font-body text-sm font-medium hover:opacity-60 transition-opacity"
              href="#"
            >
              back to top
            </a>
            <span className="font-body text-sm font-medium opacity-60">
              created by @shaimaa
            </span>
          </div>
          <div>
            <a
              href="mailto:shimaa.j.nur@gmail.com"
              className="font-body text-sm font-medium hover:opacity-60 transition-opacity"
            >
              contact
            </a>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2">
            <a
              href="mailto:shimaa.j.nur@gmail.com"
              className="font-body text-sm font-medium hover:opacity-60 transition-opacity"
            >
              shimaa.j.nur@gmail.com
            </a>
            <span className="font-body text-sm font-medium opacity-60">
              +1-940-238-6273
            </span>
          </div>
        </div>
      </FadeIn>

      <a
        href="mailto:shimaa.j.nur@gmail.com"
        className="block py-12 md:py-16 overflow-hidden text-center group"
      >
        <h2
          ref={bigRef}
          className="font-display font-extrabold uppercase whitespace-nowrap leading-[0.85] text-ink group-hover:text-transparent transition-colors duration-500"
          style={{
            fontSize: '16.6vw',
            transform: `translate3d(${translate.x}px, ${translate.y}px, 0)`,
            transition: 'transform 0.3s ease-out, color 0.5s ease',
            WebkitTextStroke: '0px transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.setProperty('-webkit-text-stroke', '2px #2B2B2B');
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.setProperty('-webkit-text-stroke', '0px transparent');
          }}
        >
          Let&rsquo;s talk
        </h2>
      </a>
    </footer>
  );
}
