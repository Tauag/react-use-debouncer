import { useCallback, useRef } from 'react';

// options will be implemented in later version
export default function useDebouncedCallback(callback, delay, options = { leading: false }) {
  const { leading } = options;
  const timeout = useRef(null);

  const cancelCallback = useCallback(() => {
    clearTimeout(timeout.current);
  }, []);

  const debouncedCallback = useCallback(() => {
    timeout.current = setTimeout(callback, delay);
    return () => clearTimeout(timeout.current);
  }, [callback, delay, leading]);

  return [debouncedCallback, cancelCallback];
}
