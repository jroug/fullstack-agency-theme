import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, Observable } from '@apollo/client';
import { useDemoData, cmsUrl } from './config';

// Keep the same Apollo cache, queries and hooks for both data sources.
export function createClient({ demo = useDemoData, uri = cmsUrl, fetch: fetcher } = {}) {
    const link = demo
        ? new ApolloLink(operation => new Observable(observer => {
            let cancelled = false;
            import('../data/executeDemo').then(({ executeDemo }) => executeDemo(operation))
                .then(result => { if (!cancelled) { observer.next(result); observer.complete(); } })
                .catch(error => { if (!cancelled) observer.error(error); });
            return () => { cancelled = true; };
        }))
        : uri
            ? new HttpLink({ uri, ...(fetcher ? { fetch: fetcher } : {}) })
            : new ApolloLink(() => new Observable(observer => {
                observer.error(new Error('CMS mode requires REACT_APP_GRAPHQL_URL. See .env.example.'));
            }));
    return new ApolloClient({ link, cache: new InMemoryCache() });
}
