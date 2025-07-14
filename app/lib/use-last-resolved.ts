import { useEffect, useRef, useState } from "react";

const EMPTY_SYMBOL: unique symbol = Symbol();

export function useLastResolved<T>(promise: Promise<T>): Promise<T> | T {
  const lastResolved = useRef<T | typeof EMPTY_SYMBOL>(EMPTY_SYMBOL);
  const [_, setRenderTick] = useState<number>(0);

  const startedPromiseCounter = useRef<number>(0);
  const finishedPromiseCounter = useRef<number>(0);

  useEffect(() => {
    const promiseIdx = startedPromiseCounter.current;
    startedPromiseCounter.current = promiseIdx + 1;

    promise
      .then((resolved) => {
        const finishedPromiseIdx = finishedPromiseCounter.current;
        // if a newer promise finished faster than this one, we shouldn't override lastResolved
        if (finishedPromiseIdx > promiseIdx) {
          return;
        }
        finishedPromiseCounter.current = promiseIdx;

        const prevResolved = lastResolved.current;
        lastResolved.current = resolved;
        // we don't need to trigger a re-render when lastResolved was previously empty
        if (prevResolved !== EMPTY_SYMBOL) {
          setRenderTick((prevTick) => prevTick + 1);
        }
      })
      .catch(() => {
        const finishedPromiseIdx = finishedPromiseCounter.current;
        // if a newer promise finished faster than this one, we shouldn't override lastResolved
        if (finishedPromiseIdx > promiseIdx) {
          return;
        }
        finishedPromiseCounter.current = promiseIdx;

        const prevResolved = lastResolved.current;
        lastResolved.current = EMPTY_SYMBOL;
        // we don't need to trigger a re-render when lastResolved was previously empty
        if (prevResolved !== EMPTY_SYMBOL) {
          setRenderTick((prevTick) => prevTick + 1);
        }
      });
  }, [promise]);

  return lastResolved.current === EMPTY_SYMBOL ? promise : lastResolved.current;
}
