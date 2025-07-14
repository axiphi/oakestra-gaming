export function catchAbort<T extends Promise<unknown>>(promise: T): T {
  return promise.catch((reason) => {
    if (reason instanceof DOMException && reason.name === "AbortError") {
      return undefined;
    } else {
      throw reason;
    }
  }) as T;
}
