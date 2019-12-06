import { useState, useEffect } from 'react';

/**
 * State hook that outputs state and a setState function that debounces on call
 * @param {*} initialValue initial value set to state
 * @param {number} delay delay in ms, defaults to 500ms
 * @returns [ state, debounced setState function ]
 */
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
