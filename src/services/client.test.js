import { gql } from '@apollo/client';
import { createClient } from './client';
import queries from '../components/__GraphQL_Queries';
import { pages } from '../data/demo';

const ALL_PAGES = gql`query DemoContract { ${['pages', 'menuItems', 'footerMenuItems', 'homePage', 'weAreTrusted', 'weDeliver', 'theTeam', 'creativeReviews'].map(key => queries.queries[key]).join('\n')} }`;

test('demo answers the original full-site query without using HTTP', async () => {
    const fetcher = jest.fn(() => Promise.reject(new Error('No network permitted')));
    const client = createClient({ demo: true, fetch: fetcher });
    const { data } = await client.query({ query: ALL_PAGES });
    expect(data.pages.nodes).toHaveLength(pages.length);
    expect(data.homePage.homepageExtras.image1.targetUrl).toBe('/fullstack-marketing/');
    expect(data.weDeliver.children.edges).toHaveLength(6);
    expect(data.theTeam.weHaveFacesExtras.tile9.title).toBe('Sam Parker');
    expect(fetcher).not.toHaveBeenCalled();
    client.stop();
});

test('demo resolves dynamic project URIs, database IDs, missing pages and local contact responses', async () => {
    const client = createClient({ demo: true });
    const project = pages.find(page => page.projectsExtras);
    const query = gql`query Detail($uri: ID!, $id: ID!) {
        project: page(id: $uri, idType: URI) { id projectsExtras { client heroImage { sourceUrl } } }
        review: page(id: $id, idType: DATABASE_ID) { id creativeReviewTemplateExtras { frameUrl } }
        missing: page(id: "does-not-exist", idType: URI) { id }
        emailSent(form_name: "Demo", form_email: "demo@example.com", form_message: "Hello")
    }`;
    const review = pages.find(page => page.creativeReviewTemplateExtras);
    const { data } = await client.query({ query, variables: { uri: project.uri.slice(1, -1), id: review.databaseId } });
    expect(data.project.projectsExtras.client).toBe('Gather Collective');
    expect(data.review.creativeReviewTemplateExtras.frameUrl).toBe('/demo/review-1.html');
    expect(data.missing).toBeNull();
    expect(JSON.parse(data.emailSent).message).toMatch(/not sent or stored/);
    client.stop();
});

test('CMS mode uses the configured HTTP transport', async () => {
    const fetcher = jest.fn().mockResolvedValue({ status: 200, headers: { get: () => 'application/json' }, text: () => Promise.resolve(JSON.stringify({ data: { page: { __typename: 'Page', id: 'cms-1', title: 'CMS page' } } })) });
    const client = createClient({ demo: false, uri: 'https://cms.example.com/graphql', fetch: fetcher });
    const { data } = await client.query({ query: gql`query CmsPage { page(id: "homepage", idType: URI) { id title } }` });
    expect(data.page.title).toBe('CMS page');
    expect(fetcher).toHaveBeenCalledWith('https://cms.example.com/graphql', expect.objectContaining({ method: 'POST' }));
    client.stop();
});

test('missing CMS configuration fails clearly instead of requesting the frontend URL', async () => {
    const client = createClient({ demo: false, uri: '' });
    await expect(client.query({ query: gql`query { __typename }`, fetchPolicy: 'network-only' })).rejects.toThrow('REACT_APP_GRAPHQL_URL');
    client.stop();
});


test('an unconfigured public build defaults to demo mode', () => {
    const previous = process.env.REACT_APP_USE_DEMO_DATA;
    delete process.env.REACT_APP_USE_DEMO_DATA;
    try {
        jest.isolateModules(() => {
            expect(require('./config').useDemoData).toBe(true);
        });
    } finally {
        if (previous === undefined) delete process.env.REACT_APP_USE_DEMO_DATA;
        else process.env.REACT_APP_USE_DEMO_DATA = previous;
    }
});
