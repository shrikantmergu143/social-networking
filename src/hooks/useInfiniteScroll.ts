import { useEffect, useRef } from 'react';

interface UseInfiniteScrollOptions {
  currentPage: number;
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: (nextPage: number) => void;
  threshold?: number;
}

/** Calls onLoadMore with the next page when the document is scrolled near its bottom. */
export function useInfiniteScroll({
  currentPage,
  hasMore,
  isLoading,
  onLoadMore,
  threshold = 200,
}: UseInfiniteScrollOptions) {
  const requestedPage = useRef<number | null>(null);

  useEffect(() => {
    if (requestedPage.current !== null && currentPage >= requestedPage.current) {
      requestedPage.current = null;
    }

    const getScrollMetrics = (eventTarget: EventTarget | null) => {
      let element = eventTarget instanceof HTMLElement ? eventTarget : null;

      while (element && element !== document.body) {
        const { overflowY } = window.getComputedStyle(element);
        if (/(auto|scroll|overlay)/.test(overflowY) && element.scrollHeight > element.clientHeight) {
          return {
            scrollTop: element.scrollTop,
            clientHeight: element.clientHeight,
            scrollHeight: element.scrollHeight,
          };
        }
        element = element.parentElement;
      }

      const scrollingElement = document.scrollingElement ?? document.documentElement;
      return {
        scrollTop: window.scrollY || scrollingElement.scrollTop,
        clientHeight: window.innerHeight,
        scrollHeight: scrollingElement.scrollHeight,
      };
    };

    const loadNextPageIfNeeded = (event: Event) => {
      const { scrollTop, clientHeight, scrollHeight } = getScrollMetrics(event.target);
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - threshold;

      if (
        isNearBottom &&
        hasMore &&
        !isLoading &&
        requestedPage.current === null
      ) {
        const nextPage = currentPage + 1;
        requestedPage.current = nextPage;
        onLoadMore(nextPage);
      }
    };

    window.addEventListener('scroll', loadNextPageIfNeeded, { passive: true });
    window.addEventListener('wheel', loadNextPageIfNeeded, { passive: true });
    document.addEventListener('scroll', loadNextPageIfNeeded, { passive: true, capture: true });
    document.addEventListener('wheel', loadNextPageIfNeeded, { passive: true, capture: true });

    return () => {
      window.removeEventListener('scroll', loadNextPageIfNeeded);
      window.removeEventListener('wheel', loadNextPageIfNeeded);
      document.removeEventListener('scroll', loadNextPageIfNeeded, true);
      document.removeEventListener('wheel', loadNextPageIfNeeded, true);
    };
  }, [currentPage, hasMore, isLoading, onLoadMore, threshold]);
}
