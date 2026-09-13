/* eslint-disable testing-library/no-node-access -- Verify CMS-rendered HTML, local media and script absence. */
import React from 'react';
import { render, screen, waitFor, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ApolloProvider } from '@apollo/client';
import App from './App';
import { createClient } from './services/client';
import { pages } from './data/demo';

jest.mock('gsap', () => ({ __esModule: true, default: { context: () => ({ revert: jest.fn() }) }, gsap: { context: () => ({ revert: jest.fn() }) } }));
jest.mock('gsap/ScrollTrigger', () => ({ __esModule: true, default: {} }));
jest.mock('framer-motion', () => ({ motion: { main: ({ children }) => <main>{children}</main> } }));
let client;
let originalFetch;
beforeEach(() => { originalFetch = global.fetch; global.fetch = jest.fn(() => Promise.reject(new Error('Offline test'))); client = createClient({ demo: true }); });
afterEach(() => { cleanup(); client.stop(); global.fetch = originalFetch; });

const routes = pages.filter(page => page.slug !== '404-2').map(page => [page.uri, page.title, Boolean(page.creativeReviewTemplateExtras)]);
routes.push(['/missing-route/', 'Page not found', false]);
test.each(routes)('demo route %s renders without HTTP', async (uri, title, isReview) => {
    window.history.replaceState({}, '', uri);
    render(<ApolloProvider client={client}><App /></ApolloProvider>);
    if (uri === '/') await screen.findByText('Ideas that move people.');
    else if (isReview) await screen.findByTitle(title);
    else if (uri.startsWith('/we-deliver/') && uri !== '/we-deliver/') await screen.findByText('The idea');
    else await screen.findByRole('heading', { name: title, level: 1 });
    expect(screen.queryByText(/Unable to load the site/)).not.toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(document.querySelector('#g-rec')).toBeNull();
    const imageSources = Array.from(document.images).map(img => img.getAttribute('src'));
    expect(imageSources.every(src => src && !/^https?:/.test(src))).toBe(true);
});

test('demo contact validates and completes without reCAPTCHA or sending a request', async () => {
    window.history.replaceState({}, '', '/contact/');
    render(<ApolloProvider client={client}><App /></ApolloProvider>);
    await screen.findByRole('heading', { name: 'Contact', level: 1 });
    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Jamie Demo' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'demo@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Message'), { target: { value: 'A local demonstration' } });
    fireEvent.submit(screen.getByRole('form', { name: 'Contact form' }));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('not sent or stored'));
    expect(screen.getByPlaceholderText('Name')).toHaveValue('');
    expect(global.fetch).not.toHaveBeenCalled();
    expect(document.querySelector('#g-rec')).toBeNull();
});
