import { buildSchema, execute } from 'graphql';
import { pages, menuItems, footerMenuItems } from './demo';

// A local subset of the existing WPGraphQL contract, not a replacement CMS API.
// GraphQL executes aliases, variables and inline Page fragments exactly as in CMS mode.
const schema = buildSchema(`
    enum PageIdType { URI DATABASE_ID }
    enum MenuLocation { PRIMARY FOOTER_MENU }
    input MenuWhere { location: MenuLocation }
    type Query {
        pages(first: Int): PageConnection!
        page(id: ID!, idType: PageIdType): Page
        menuItems(where: MenuWhere): MenuConnection!
        emailSent(form_name: String, form_email: String, form_message: String, form_google_token: String): String!
    }
    type PageConnection { nodes: [Page!]! }
    type MenuConnection { nodes: [MenuItem!]! }
    type MenuItem { id: ID!, uri: String!, label: String! }
    type Image { id: ID, sourceUrl: String, title: String, altText: String, description: String, mediaDetails: MediaDetails }
    type MediaDetails { width: Int, height: Int, sizes: [ImageSize!] }
    type ImageSize { file: String, fileSize: Int, height: Int, mimeType: String, name: String, sourceUrl: String, width: Int }
    type FeaturedImage { node: Image }
    type Parent { node: Page }
    type Children { edges: [PageEdge!]! }
    type PageEdge { node: Page! }
    type Page {
        id: ID!, databaseId: Int!, title: String, content: String, slug: String!, uri: String!
        featuredImage: FeaturedImage, parent: Parent, children(first: Int): Children
        homepageExtras: HomepageExtras, weAreTrustedExtras: TrustedExtras, weHaveFacesExtras: TeamExtras
        projectsExtras: ProjectExtras, creativeReviewTemplateExtras: ReviewExtras
    }
    type HomepageExtras { ${Array.from({ length: 9 }, (_, i) => `image${i + 1}: Image`).join(',')} }
    type TeamExtras { ${Array.from({ length: 9 }, (_, i) => `tile${i + 1}: TeamTile`).join(',')} }
    type TeamTile { fieldGroupName: String, title: String, subTitle: String, text: String, thumb: Image }
    type TrustedExtras { images: String }
    type ProjectExtras { client: String, ourServices: String, project: String, mainText: String, heroImage: Image }
    type ReviewExtras { frameHeight: Int, frameUrl: String }
`);
// The original query aliases Image.description to targetUrl.
for (const page of pages) {
    Object.values(page.homepageExtras || {}).forEach(image => { image.description = image.targetUrl; });
}
const normalize = value => String(value).replace(/^\/+|\/+$/g, '');
const rootValue = {
    pages: () => ({ nodes: pages }),
    page: ({ id, idType }) => pages.find(item => idType === 'DATABASE_ID'
        ? String(item.databaseId) === String(id)
        : normalize(item.uri) === normalize(id) || item.slug === normalize(id)) || null,
    menuItems: ({ where }) => ({ nodes: where?.location === 'FOOTER_MENU' ? footerMenuItems : menuItems }),
    emailSent: () => JSON.stringify({ status: 200, message: 'Demo complete. Your message was not sent or stored.' }),
};
export const executeDemo = ({ query, variables, operationName }) => execute({ schema, document: query, rootValue, variableValues: variables, operationName });
