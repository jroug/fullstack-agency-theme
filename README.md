# FORM & FIELD

A portfolio/demo version of a headless WordPress creative agency frontend. The public demo uses local, fictional content and runs without a CMS, credentials or external API requests. The existing visual theme, Bootstrap layout, Montserrat typography, component structure, responsive breakpoints, carousel and GSAP/Framer Motion interactions are retained.

The demo includes a homepage, partner gallery, six project case studies, nine fictional team profiles, four creative review articles, editorial pages, a contact form and a not-found page. The contact form demonstrates validation and completion; it **does not send or store messages**.

## Run locally

Use Node.js 24 and npm (verified locally with Node.js 24.3.0).

```bash
npm ci
npm start
```

Open http://localhost:3000. Demo mode is enabled when no environment variables are present. Configuration is optional:

```bash
cp .env.example .env.local
```

Restart the development server after changing environment variables. Remove stale `.env.development.local` or `.env.production.local` overrides when configuring your own environment. Do not set `PUBLIC_URL` to an old localhost or client domain; the default root-relative build works on Vercel.

## Data architecture

```text
Page components → existing useQuery / gql → ApolloClient + InMemoryCache
                                             ├─ demo: local ApolloLink → GraphQL execution → src/data/demo.js
                                             └─ CMS:  HttpLink → your WPGraphQL endpoint
```

- `src/services/config.js`: public build-time configuration; demo defaults to `true`.
- `src/services/client.js`: transport selection. Components retain the same Apollo hooks and cache behavior.
- `src/components/__GraphQL_Queries.jsx`: original shared WordPress queries and ACF field selections.
- `src/data/demo.js`: fictional pages, menus, projects, team profiles and WordPress-compatible response objects.
- `src/data/executeDemo.js`: local GraphQL schema/resolvers supporting aliases, variables, inline Page fragments, URI and database-ID lookups. No HTTP calls or service worker are needed.
- `public/demo/`: local partner wordmarks, profile placeholders and iframe review articles.
- `src/assets/images/`: selected neutral imagery retained from the original project and the replacement wordmark.
- `public/fonts/`: the original Montserrat family, self-hosted with its SIL Open Font License.

Demo data is loaded in a separate chunk. The local schema implements the fields this frontend uses; it is not a full WordPress emulator. Components continue to render CMS HTML and use the existing mapping from page slug/parent to page template.

## Connect your own WordPress/headless CMS

In `.env.local` (or Vercel environment settings):

```dotenv
REACT_APP_USE_DEMO_DATA=false
REACT_APP_GRAPHQL_URL=https://cms.example.com/graphql
REACT_APP_GOOGLE_RECAPTCHA_SITE_KEY=
```

The endpoint must expose WPGraphQL and the ACF/custom fields selected in `__GraphQL_Queries.jsx`: `homepageExtras`, `weAreTrustedExtras`, `weHaveFacesExtras`, `projectsExtras` and `creativeReviewTemplateExtras`. Configure primary/footer menu locations and the existing page slugs (`homepage`, `we-are-trusted`, `we-deliver`, `the-team`, `creative-reviews`, `contact`). Project pages are children of `we-deliver`; review pages are children of `creative-reviews`. The legacy `404-2` slug supplies the fallback page.

A stock WordPress installation alone does not expose these custom fields. Recreate that schema in your CMS, or adapt the shared query selections and mapping to match your own schema. Other headless CMSs can be connected through a custom Apollo link that returns the same shapes. Configure CORS to allow your frontend origin and serve the endpoint over HTTPS for public deployments.

The existing contact integration calls the custom GraphQL `emailSent` query, expecting a JSON string with `status` and `message`. It is not a standard WPGraphQL resolver. Supply your own server implementation with validation, reCAPTCHA verification and delivery, plus a public reCAPTCHA v3 site key. The private reCAPTCHA secret and email-provider credentials belong only on your backend. Demo mode skips reCAPTCHA entirely. No REST service is active in this project; the unused legacy REST URL configuration was removed.

The development-only “Edit Page” tool remains available in CMS mode and derives the WordPress admin URL from the configured GraphQL endpoint. Adapt that tool if your admin lives elsewhere. Missing CMS configuration produces a handled error; the application never silently falls back to demo content in CMS mode.

All `REACT_APP_*` values are embedded in the browser bundle. They must contain public configuration only, never passwords, tokens or secret keys.

## Deploy to Vercel

1. Push the sanitized project to your own GitHub repository and import it into Vercel.
2. Select the **Create React App** preset, with install command `npm ci`, build command `npm run build`, and output directory `build`.
3. Leave CMS variables unset. Optionally set `REACT_APP_USE_DEMO_DATA=true` explicitly for production and preview deployments.
4. Deploy. The included `vercel.json` routes extensionless page URLs to `index.html`, allowing direct links and refreshes on React Router pages while serving local files normally.

No WordPress installation, serverless function or database is needed for the demo. Environment changes require a new build. See [Vercel's CRA deployment documentation](https://vercel.com/docs/frameworks/frontend/create-react-app) and [rewrite configuration](https://vercel.com/docs/routing/rewrites).

## Checks

```bash
npm run lint
CI=true npm test -- --watchAll=false --runInBand
npm run build
```

Tests cover every demo route with HTTP disabled, demo form completion, the original full-site query, URI/ID lookups, configured CMS transport, missing configuration, mobile navigation and contact error recovery. Rendering tests mock animation timing; they do not replace visual review in a browser.

## Technologies

React 18, Create React App 5, React Router 6, Apollo Client 3, GraphQL, Bootstrap 5/React Bootstrap, GSAP/ScrollTrigger, Framer Motion, React Helmet Async, Jest and React Testing Library. This is JavaScript/JSX; no TypeScript migration or design-system replacement was introduced.

## Portfolio content and repository hygiene

FORM & FIELD, the partner names, project briefs and team biographies are fictional. Team images are neutral initials placeholders. Unused legacy staff/client artwork, original brand icons, tracking scripts, analytics identifiers and live endpoint values were removed from the working tree. The retained neutral photographs are existing project assets; their original rights still apply. No new image license is implied by this demo conversion.

Local `.env` files, `.vercel`, build output and private key files are ignored; `.env.example` contains only empty public configuration and the demo flag. Existing Git history is not rewritten by this conversion: older commits still contain legacy project URLs and artwork. For a portfolio repository without that history, publish the sanitized current files as a fresh repository rather than pushing the old history.
