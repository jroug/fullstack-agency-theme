/* eslint-disable testing-library/no-node-access -- These regressions verify script cleanup and CMS DOM input. */
import React from 'react';
import { fireEvent, render, screen, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './_Header';

import Slider from './Widget_HomeSliderBootstrap';

jest.mock('../services/config', () => ({ useDemoData: false, recaptchaSiteKey: 'test' }));

jest.mock('gsap', () => ({ __esModule: true, default: { context: () => ({ revert: jest.fn() }) } }));
jest.mock('@apollo/client', () => ({ useApolloClient: () => ({ query: jest.fn() }), gql: jest.fn() }));

process.env.REACT_APP_GOOGLE_RECAPTCHA_SITE_KEY = 'test';
const Contact = require('./Page_Contact').default;

afterEach(() => { cleanup(); document.body.innerHTML = ''; delete window.grecaptcha; });

test('navigation links close the mobile menu and update its accessible state', () => {
    render(<MemoryRouter><Header menuNodes={[{ uri: '/contact', label: 'Contact' }]} preloadingArray={{}} /></MemoryRouter>);
    const toggle = screen.getByRole('button', { name: 'Toggle navigation' });
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(screen.getByText('Contact'));
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(screen.getByText('Contact'));
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test.each(['missing', 'rejected'])('contact form recovers when reCAPTCHA is %s', async failure => {
    process.env.REACT_APP_GOOGLE_RECAPTCHA_SITE_KEY = 'test';
    const execute = jest.fn().mockRejectedValue(new Error('unavailable'));
    if (failure === 'rejected') window.grecaptcha = { ready: callback => callback(), execute };
    document.body.innerHTML = '<footer id="footer"></footer>';
    const { unmount } = render(<HelmetProvider><MemoryRouter><Contact nodeData={{ title: 'Contact' }} /></MemoryRouter></HelmetProvider>);
    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Message'), { target: { value: 'Hello' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Send' }).closest('form'));
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Please try again'));
    expect(screen.getByRole('button', { name: 'Send' })).toBeEnabled();
    expect(execute).toHaveBeenCalledTimes(failure === 'rejected' ? 1 : 0);
    expect(document.querySelectorAll('#g-rec')).toHaveLength(1);
    unmount();
    expect(document.querySelector('#g-rec')).toBeNull();
});

test('slider supports linked images and figures without captions', () => {
    const doc = new DOMParser().parseFromString('<figure><a><img src="/slide.jpg" alt="Campaign" /></a></figure><figure></figure>', 'text/html');
    render(<Slider figures={doc.querySelectorAll('figure')} />);
    expect(screen.getByAltText('Campaign')).toHaveAttribute('src', '/slide.jpg');
});
