import { useCallback } from 'react';

export default function useDebouncedCallback(callback, delay, options = { leading: false }) {
  const { leading } = options;
  let timer = null;

  const cancelCallback = () => {
    clearTimeout(timer);
  };

  const debouncedCallback = useCallback(() => {
    timer = setTimeout(callback, delay);
    return () => clearTimeout(timer);
  }, [callback, delay, leading]);

  return [debouncedCallback, cancelCallback];
}
