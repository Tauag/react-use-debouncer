import { useCallback, useRef } from 'react';

// options will be implemented in later version
export default function useDebouncedCallback(
  callback,
  delay = 500,
  options = { leading: false, trailing: true }
) {
  const timeout = useRef(null);
  const allowLeadingCall = useRef(true);

  const cancelCallback = useCallback(() => clearTimeout(timeout.current), []);
  const immediate = options.leading;
  const postpone = options.trailing === undefined ? true : options.trailing;

  const wrappedCallback = () => {
    if (postpone) callback();
    allowLeadingCall.current = true;
  };

  const debouncedCallback = useCallback(() => {
    if (immediate && allowLeadingCall.current) {
      callback();
      allowLeadingCall.current = false;
    }

    timeout.current = setTimeout(wrappedCallback, delay);
    return () => clearTimeout(timeout.current);
  }, [callback, delay, cancelCallback]);

  return [debouncedCallback, cancelCallback];
}
