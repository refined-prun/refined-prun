import { userDataStore } from '@src/infrastructure/prun-api/data/user-data';
import { sleep } from '@src/utils/sleep';

interface GifRequestCache {
  query: string;
  pages: number;
  nextPage: number;
  maxPages: number;
  urls: string[];
  nextUrls: string[];
  isFetching: boolean;
  pending: (() => void)[];
}

const pageSize = 50;
const newPageThreshold = 20;
const maxPages = 5;

const requestCache = new Map<string, GifRequestCache>();
const requestCacheList = [] as GifRequestCache[];
const cacheSize = 10;

export async function getGifUrl(query?: string) {
  query ??= '';
  query = query.toLowerCase();
  let isFirst = false;
  let cache = requestCache.get(query);
  if (!cache) {
    isFirst = true;
    cache = {
      query,
      pages: 0,
      nextPage: 1,
      maxPages,
      urls: [],
      nextUrls: [],
      isFetching: false,
      pending: [],
    };
    requestCache.set(query, cache);
    requestCacheList.push(cache);
    if (requestCacheList.length > cacheSize) {
      const removed = requestCacheList.shift()!;
      requestCache.delete(removed.query);
    }
  }

  if (cache.urls.length === 0) {
    await new Promise<void>(resolve => {
      cache.pending.push(resolve);
      if (cache.pending.length === 1) {
        void fetchNextPage(cache);
      }
    });
  }

  if (cache.nextUrls.length === 0) {
    cache.nextUrls = cache.urls.slice();
    shuffleArray(cache.nextUrls);
    // Show the most relevant GIF on the first request.
    if (isFirst) {
      cache.nextUrls = cache.nextUrls.filter(x => x !== cache.urls[0]);
      return cache.urls[0];
    }
  }

  if (cache.nextUrls.length < newPageThreshold) {
    void fetchNextPage(cache);
  }

  return cache.nextUrls.pop()!;
}

function shuffleArray(array: unknown[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

async function fetchNextPage(cache: GifRequestCache) {
  if (cache.pages >= cache.maxPages || cache.isFetching) {
    return;
  }

  cache.isFetching = true;
  const rawUrl =
    'https://api.klipy.com/api/v1/HFkvjwWPt47cp0zCerj4szfgdWMbXJt8VV9V19XETIEy6FOw4Yy4rVZVOPH2eF1g/gifs/search?page=' +
    cache.nextPage +
    '&per_page=' +
    pageSize +
    '&q=' +
    cache.query +
    '&customer_id=' +
    userDataStore.id +
    '&format_filter=webp';
  cache.nextPage++;
  try {
    const response = await (await fetch(encodeURI(rawUrl))).json();
    if (!response.result) {
      throw new Error('No result');
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cache.urls.push(...response.data.data.map((x: any) => x.file.hd.webp.url));
    cache.pages++;
    if (!response.data.has_next) {
      cache.maxPages = cache.pages;
    }
    cache.isFetching = false;
    for (const resolve of cache.pending) {
      resolve();
    }
    cache.pending.length = 0;
  } catch (e) {
    console.error(e);
    await sleep(60000);
    void fetchNextPage(cache);
  }
}
