import threads from '../assets/images/home/fullstack-marketing.jpg';
import craft from '../assets/images/home/we-do-fullStack-marketing.jpg';
import community from '../assets/images/home/we-dream.jpg';
import research from '../assets/images/home/we-study-and-research.jpg';
import gathering from '../assets/images/home/we-team.jpg';
import performance from '../assets/images/we-are-trusted/We-are-trusted_Art.jpg';

const dimensions = {
    [threads]: [2560, 933], [craft]: [640, 420], [community]: [305, 420],
    [research]: [636, 420], [gathering]: [303, 420], [performance]: [1675, 497],
};

// Fictional editorial content, shaped like WPGraphQL + the original ACF groups.
const media = (sourceUrl, title = '') => ({
    id: sourceUrl, sourceUrl, title, altText: title, targetUrl: '',
    mediaDetails: { width: dimensions[sourceUrl]?.[0] || 413, height: dimensions[sourceUrl]?.[1] || 275, sizes: [] },
});
const featured = (url, title) => ({ node: media(url, title) });
let nextId = 1;
const page = (slug, title, content = '', image = null, parent = null) => ({
    id: `demo-page-${nextId}`, databaseId: nextId++, slug, title, content,
    uri: slug === 'homepage' ? '/' : `/${parent ? `${parent.slug}/` : ''}${slug}/`,
    featuredImage: image ? featured(image, title) : null,
    parent: parent ? { node: { databaseId: parent.databaseId, slug: parent.slug } } : null,
    children: { edges: [] },
});
const paragraph = text => `<p>${text}</p>`;
const home = page('homepage', 'FORM & FIELD');
const trusted = page('we-are-trusted', 'We are trusted', paragraph('Long conversations. Shared ambitions. Work we are proud to make together. Meet the fictional brands in our studio portfolio.'), performance);
const work = page('we-deliver', 'We deliver', paragraph('Strategy becomes stories, experiences and useful ideas. A selection of concept projects across culture, everyday living and community.'));
const team = page('the-team', 'The team');
const contact = page('contact', 'Contact');
const reviews = page('creative-reviews', 'Creative reviews', paragraph('Notes from the studio on culture, design and the ideas shaping what comes next.'));

const projectBriefs = [
    ['common-ground', 'Common ground', 'Gather Collective', community, 'A place for everyone', 'A community platform built around the simple pleasure of showing up. We developed a warm voice, a launch story and a programme of shared experiences.'],
    ['many-layers', 'Many layers, one story', 'Nested Objects', craft, 'Made with meaning', 'A collection of everyday objects with an extraordinary attention to craft. The concept connects the maker, the material and the person who brings it home.'],
    ['curiosity-in-motion', 'Curiosity in motion', 'Bright Lab', research, 'Make room for discovery', 'An invitation to ask better questions. A hands-on learning campaign turns complex ideas into accessible, memorable moments.'],
    ['at-the-table', 'A seat at the table', 'Table Studio', gathering, 'Better together', 'A hospitality concept celebrating small gatherings. Editorial content, thoughtful partnerships and intimate events create a generous welcome.'],
    ['connected-by-design', 'Connected by design', 'Thread Works', threads, 'Every thread matters', 'A brand platform that brings a multidisciplinary studio together. One clear narrative connects individual skills to a shared creative ambition.'],
    ['a-new-perspective', 'A new perspective', 'Arc Culture', performance, 'Culture without boundaries', 'A season of live performance seen through a fresh lens. The campaign makes the energy of the stage tangible through an expressive editorial approach.'],
];
const projects = projectBriefs.map(([slug, title, client, image, project, text]) => {
    const item = page(slug, title, `<div class="row"><div class="col-md-6"><img src="${image}" alt="${title}" /></div><div class="col-md-6"><h2>The idea</h2><p>${text}</p><h3>From insight to experience</h3><p>Research informed a clear creative direction. A consistent visual story brings the concept to life across launch content, community touchpoints and digital experiences.</p><p>Portfolio concept — fictional brief and brand.</p></div></div>`, image, work);
    item.projectsExtras = { client, project, ourServices: 'Strategy, creative direction, content, digital experiences', mainText: paragraph(text), heroImage: media(image) };
    return item;
});
work.children.edges = projects.map(node => ({ node }));
const people = [
    ['Alex Morgan', 'Strategy Director', 'Connects audience insight with a clear creative ambition.'],
    ['Jamie Reed', 'Creative Director', 'Builds distinctive ideas with a thoughtful eye for detail.'],
    ['Robin Ellis', 'Account Director', 'Keeps conversations open and projects moving forward.'],
    ['Casey Lane', 'Design Lead', 'Turns complex stories into confident visual systems.'],
    ['Taylor Quinn', 'Content Strategist', 'Finds the human thread in every brand story.'],
    ['Jordan Wells', 'Digital Producer', 'Brings design, technology and teams together.'],
    ['Avery Stone', 'Copywriter', 'Makes every word earn its place.'],
    ['Riley Brooks', 'Experience Designer', 'Creates useful, welcoming digital experiences.'],
    ['Sam Parker', 'Community Lead', 'Builds lasting relationships through shared interests.'],
];
team.weHaveFacesExtras = Object.fromEntries(people.map(([title, subTitle, text], i) => [`tile${i + 1}`, { fieldGroupName: 'DemoTeamTile', title, subTitle, text: paragraph(text), thumb: media(`/demo/person-${i + 1}.svg`) }]));
trusted.weAreTrustedExtras = { images: projectBriefs.map((brief, i) => `<img src="/demo/partner-${i + 1}.svg" alt="${brief[2]}" />`).join('') };

const articles = [
    ['the-power-of-small', 'The power of small moments', gathering, 'The everyday rituals that help brands feel human.'],
    ['designing-for-curiosity', 'Designing for curiosity', research, 'Why a better question can be the strongest creative starting point.'],
    ['stories-that-connect', 'Stories that connect', threads, 'Finding a shared narrative without losing individual voices.'],
    ['a-culture-of-making', 'A culture of making', craft, 'What craft teaches us about attention, patience and originality.'],
].map(([slug, title, image, intro], i) => {
    const item = page(slug, title, paragraph(intro), image, reviews);
    item.creativeReviewTemplateExtras = { frameHeight: 1000, frameUrl: `/demo/review-${i + 1}.html` };
    return item;
});
reviews.children.edges = articles.map(node => ({ node }));
const simple = [
    page('fullstack-marketing', 'We do fullstack marketing', paragraph('One team, many perspectives. We connect strategy, creative ideas and digital experiences to help ambitious brands move forward.') + '<h2>From the first question to the final detail</h2>' + paragraph('Our practice spans research, positioning, identity, content and experience design. Every discipline contributes to a clear and consistent story.'), threads),
    page('we-are-storytellers', 'We are storytellers', paragraph('We find the useful truth at the heart of a brand and give it a voice. Stories grow stronger when people can see themselves in them.'), craft),
    page('we-dream', 'We dream', paragraph('Fresh perspectives begin with curiosity. We make space for experimentation, conversation and ideas that reach beyond the familiar.'), community),
    page('we-believe', 'We believe', paragraph('Good work is thoughtful, generous and clear. We believe in close collaboration, honest conversations and the power of a shared ambition.'), performance),
    page('we-study-and-research', 'We study and research', paragraph('Before we make, we listen. Cultural research, audience conversations and careful observation give our ideas a meaningful foundation.'), research),
    page('we-team', 'We team', paragraph('Different skills. Shared curiosity. We build teams around the needs of each project, connecting strategy, design, writing and technology.'), gathering),
    page('privacy', 'Demo privacy', paragraph('This portfolio uses local demonstration content. The demo contact form does not send, store or share messages. No analytics or tracking scripts are installed. External links are opened only when you choose them.')),
    page('404-2', 'Page not found', '<p>This page has moved or does not exist.</p><p><a href="/">Return to the homepage</a></p>'),
];
const tiles = [
    [threads, 'We do fullstack marketing', '/fullstack-marketing/'], [craft, 'We are storytellers', '/we-are-storytellers/'], [community, 'We dream', '/we-dream/'],
    [performance, 'We are trusted', '/we-are-trusted/'], [gathering, 'We deliver', '/we-deliver/'], [craft, 'We believe', '/we-believe/'],
    [research, 'We study and research', '/we-study-and-research/'], [community, 'We have faces', '/the-team/'], [gathering, 'We team', '/we-team/'],
];
home.homepageExtras = Object.fromEntries(tiles.map(([image, title, targetUrl], i) => [`image${i + 1}`, { ...media(image, title), targetUrl }]));
home.content = `<figure><img src="${performance}" alt="Live performance" /><figcaption><h2>Ideas that move people.</h2><p>Strategy. Creativity. Shared ambition.</p></figcaption></figure><figure><img src="${threads}" alt="Colourful threads woven together" /><figcaption>Independent minds.<br />Connected thinking.</figcaption></figure>`;

export const pages = [home, trusted, work, team, contact, reviews, ...projects, ...articles, ...simple];
export const menuItems = [trusted, work, team, reviews, contact].map(item => ({ id: `menu-${item.id}`, uri: item.uri, label: item.title }));
export const footerMenuItems = [simple[3], simple[6], contact].map(item => ({ id: `footer-${item.id}`, uri: item.uri, label: item.title }));
