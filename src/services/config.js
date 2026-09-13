// Public, build-time configuration. Never put private credentials in REACT_APP_*.
export const useDemoData = process.env.REACT_APP_USE_DEMO_DATA !== 'false';
export const cmsUrl = process.env.REACT_APP_GRAPHQL_URL || '';
export const recaptchaSiteKey = process.env.REACT_APP_GOOGLE_RECAPTCHA_SITE_KEY || '';
