import { useEffect, useState, useCallback, useRef } from 'react';

const defaultOptions = {
  cancelOnUnmount: true,
};

/**
 * An async-utility hook that accepts a callback function and a delay time (in milliseconds), then repeats the
 * execution of the given function by the defined milliseconds.
 */
export const useInterval = (fn: () => void, milliseconds: number, options = defaultOptions) => {
  const opts = { ...defaultOptions, ...(options || {}) };
  const timeout = useRef<number>();
  const callback = useRef(fn);
  const [isCleared, setIsCleared] = useState(false);

  // the clear method
  const clear = useCallback(() => {
    if (timeout.current) {
      clearInterval(timeout.current);
      setIsCleared(true);
    }
  }, []);

  // if the provided function changes, change its reference
  useEffect(() => {
    if (typeof fn === 'function') {
      callback.current = fn;
    }
  }, [fn]);

  // when the milliseconds change, reset the timeout
  useEffect(() => {
    if (milliseconds && typeof milliseconds === 'number') {
      clear();
      // @ts-ignore
      timeout.current = setInterval(() => {
        callback.current();
      }, milliseconds);
    }
  }, [milliseconds, clear]);

  // when component unmount clear the timeout
  useEffect(
    () => () => {
      if (opts.cancelOnUnmount) {
        clear();
      }
    },
    []
  );

  return [isCleared, clear];
};

export default useInterval;
