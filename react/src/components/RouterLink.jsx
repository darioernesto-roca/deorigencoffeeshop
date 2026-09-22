import { useCallback } from 'react';

export function RouterLink({ href, onNavigate, children, ...props }) {
  const handleClick = useCallback((event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();
    onNavigate(href);
  }, [href, onNavigate]);

  return <a {...props} href={href} onClick={handleClick}>{children}</a>;
}
