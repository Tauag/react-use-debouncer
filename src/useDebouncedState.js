import { useState, useEffect } from 'react';

export default function useDebouncedState(initialValue, delay = 500) {
  const [state, setState] = useState(initialValue);
  const [debouncedState, setDebouncedState] = useState(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      setState(debouncedState);
    }, delay);

    return () => clearTimeout(timer);
  }, [debouncedState, delay]);

  return [state, setDebouncedState];
}
