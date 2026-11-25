export function createSceneScope() {
  const controller = new AbortController();
  const cleanups: Array<() => void> = [];
  function track<T extends { disconnect(): void }>(observer: T): T {
    cleanups.push(() => observer.disconnect());
    return observer;
  }
  return {
    signal: controller.signal,
    onDispose(cleanup: () => void) {
      cleanups.push(cleanup);
    },
    listen(
      target: EventTarget | undefined,
      name: string,
      handler: EventListener,
      options?: AddEventListenerOptions,
    ) {
      target?.addEventListener(name, handler, {
        ...options,
        signal: controller.signal,
      });
    },
    resize(callback: ResizeObserverCallback) {
      return track(new ResizeObserver(callback));
    },
    intersection(
      callback: IntersectionObserverCallback,
      options?: IntersectionObserverInit,
    ) {
      return track(new IntersectionObserver(callback, options));
    },
    dispose() {
      controller.abort();
      for (const cleanup of cleanups.reverse()) cleanup();
      cleanups.length = 0;
    },
  };
}
