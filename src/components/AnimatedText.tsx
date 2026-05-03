import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

type AnimatedTextProps = {
  text: string;
  className?: string;
};

export default function AnimatedText({ text, className }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });

  const chars = text.split('');

  return (
    <p ref={ref} className={className}>
      {chars.map((char, i) => (
        <Char key={i} progress={scrollYProgress} index={i} total={chars.length}>
          {char}
        </Char>
      ))}
    </p>
  );
}

function Char({
  children,
  progress,
  index,
  total,
}: {
  children: string;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  index: number;
  total: number;
}) {
  const start = index / total;
  const end = start + 1 / total;
  const opacity = useTransform(progress, [start, end], [0.2, 1]);

  return (
    <span style={{ position: 'relative', display: 'inline' }}>
      <span style={{ opacity: 0 }}>{children}</span>
      <motion.span
        style={{
          opacity,
          position: 'absolute',
          left: 0,
          top: 0,
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}
