import { useEffect, useRef } from 'react';

/**
 * Focus trap hook for modal dialogs.
 *
 * - Focuses the first focusable element when `active` becomes true.
 * - Cycles Tab / Shift+Tab between first and last focusable elements.
 *
 * WCAG 2.1.1 (Keyboard) / 2.4.3 (Focus Order) compliance helper.
 *
 * Usage:
 *   const trapRef = useFocusTrap(isOpen);
 *   return <div ref={trapRef} role="dialog" aria-modal="true">...</div>;
 */
export function useFocusTrap<T extends HTMLElement = HTMLDivElement>(active: boolean) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!active || !ref.current) return;

    const node = ref.current;
    const focusable = node.querySelectorAll<HTMLElement>(
      'button:not([disabled]),[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    // Focus first focusable element on mount
    if (first) first.focus();

    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || focusable.length === 0) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    node.addEventListener('keydown', trap);
    return () => {
      node.removeEventListener('keydown', trap);
    };
  }, [active]);

  return ref;
}
