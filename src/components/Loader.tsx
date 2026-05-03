import { useEffect, useState } from 'react';

export default function Loader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`loader${done ? ' done' : ''}`}>
      <div className="loader-bar" />
    </div>
  );
}
