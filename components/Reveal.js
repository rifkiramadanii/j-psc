'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Wraps children in an element that fades/slides into view once it enters
 * the viewport. Mirrors the .reveal / .is-visible CSS classes from the
 * original static site. Pass `as` to change the rendered tag (e.g. "article").
 */
export default function Reveal({ children, className = '', as: Tag = 'div', ...props }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${visible ? 'is-visible' : ''} ${className}`.trim()} {...props}>
      {children}
    </Tag>
  );
}
