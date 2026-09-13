import { useDemoData } from './services/config';
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useQuery, gql } from "@apollo/client";
import __GraphQL_Queries from "./components/__GraphQL_Queries";
import { logginF } from './components/__Utils';

import Header from './components/_Header';
import Footer from './components/_Footer';
import AnimationLayout from './components/_AnimationLayout';

import 'bootstrap/dist/css/bootstrap.css';
import './assets/css/style.css';

const PageHome = lazy( () => import("./components/Page_Home") );
const Page_WeAreTrusted = lazy( () => import("./components/Page_WeAreTrusted") );
const Page_WeDeliver = lazy( () => import("./components/Page_WeDeliver") );
const Page_TheTeam = lazy( () => import("./components/Page_TheTeam") );
const Page_Contact = lazy( () => import("./components/Page_Contact") );
const Page_CreativeReviews = lazy( () => import("./components/Page_CreativeReviews") );
const PageTemplateCreativeReview = lazy( () => import("./components/Page_TemplateCreativeReview") );
const PageTemplatePoject = lazy( () => import("./components/Page_TemplatePoject") );
const PageTemplateSimple = lazy( () => import("./components/Page_TemplateSimple") );
const ToolEditPage = lazy( () => import("./components/Tool_EditPage") );




const PageComponentsMap_slug_component = {
  'we-are-trusted': Page_WeAreTrusted,
  'we-deliver': Page_WeDeliver,
  'the-team': Page_TheTeam,
  'contact': Page_Contact,
  'creative-reviews': Page_CreativeReviews

  // all other slugs go to - >
  // PageTemplateSimple,
  // PageTemplatePoject,
  // PageTemplateCreativeReview according to their parent
}

 ;

let current_pathname = window.location.pathname;

if ( current_pathname.substr(current_pathname.length - 1) !== "/" ){
  current_pathname+="/";
}

// console.log(current_pathname);
let GET_MAIN_QUERY = null;

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

let caching_type = 'all site';
if (isMobile) caching_type = 'main queries';

// const caching_type = 'all site';
// const caching_type = 'main queries';
// const caching_type = 'none';

if (caching_type === 'all site'){
      // caching all site
      GET_MAIN_QUERY = gql`query GET_ALL_PAGES
      {
        ${__GraphQL_Queries.queries.pages}
        ${__GraphQL_Queries.queries.menuItems}
        ${__GraphQL_Queries.queries.footerMenuItems}
        ${__GraphQL_Queries.queries.homePage}
        ${__GraphQL_Queries.queries.weAreTrusted}
        ${__GraphQL_Queries.queries.weDeliver}
        ${__GraphQL_Queries.queries.theTeam}
        ${__GraphQL_Queries.queries.creativeReviews}
      }`;

}else if (caching_type === 'main queries') {
  // caching three main queries
  switch (current_pathname) {
    case '/': // homepage
      GET_MAIN_QUERY = gql`query GET_SITEMAP_AND_MENU_AND_HOME
      {
        ${__GraphQL_Queries.queries.pages}
        ${__GraphQL_Queries.queries.menuItems}
        ${__GraphQL_Queries.queries.footerMenuItems}
        ${__GraphQL_Queries.queries.homePage}
      }`;
      break;
    case '/we-are-trusted/': // homepage
      GET_MAIN_QUERY = gql`query GET_SITEMAP_AND_MENU_AND_WE_ARE_TRUSTED
      {
        ${__GraphQL_Queries.queries.pages}
        ${__GraphQL_Queries.queries.menuItems}
        ${__GraphQL_Queries.queries.footerMenuItems}
        ${__GraphQL_Queries.queries.weAreTrusted}
      }`;
      break;
    case '/we-deliver/': // homepage
      GET_MAIN_QUERY = gql`query GET_SITEMAP_AND_MENU_AND_WE_DELIVER
      {
        ${__GraphQL_Queries.queries.pages}
        ${__GraphQL_Queries.queries.menuItems}
        ${__GraphQL_Queries.queries.footerMenuItems}
        ${__GraphQL_Queries.queries.weDeliver}
      }`;
      break;
    case '/the-team/': // homepage
      GET_MAIN_QUERY = gql`query GET_SITEMAP_AND_MENU_AND_WE_TEAM
      {
        ${__GraphQL_Queries.queries.pages}
        ${__GraphQL_Queries.queries.menuItems}
        ${__GraphQL_Queries.queries.footerMenuItems}
        ${__GraphQL_Queries.queries.theTeam}
      }`;
      break;
    case '/creative-reviews/': // creative-reviews
      GET_MAIN_QUERY = gql`query GET_SITEMAP_AND_MENU_AND_CREATIVE_REVIEWS
      {
        ${__GraphQL_Queries.queries.pages}
        ${__GraphQL_Queries.queries.menuItems}
        ${__GraphQL_Queries.queries.footerMenuItems}
        ${__GraphQL_Queries.queries.creativeReviews}
      }`;
      break;
    default:
      GET_MAIN_QUERY = gql`query GET_CLIENTS_CONTENT
      {
        ${__GraphQL_Queries.queries.pages}
        ${__GraphQL_Queries.queries.menuItems}
        ${__GraphQL_Queries.queries.footerMenuItems}
      }`;
      // add creative review inner and project inner template
  }
}





const  App = () => {

    // preload images
    let imagesPreload = [];

  // show footer a liitle bit late for LCP reasons
  // useEffect(() => {
  //     setTimeout(function(){
  //       if (document.getElementById('footer'))  document.getElementById('footer').classList.remove('hidden');
  //     },1400);
  // });

  const { data, loading, error } = useQuery(GET_MAIN_QUERY);

  if (loading) { logginF('loading main query'); return }
  if (error) { logginF(error); return <p role="alert">Unable to load the site. Please refresh to try again.</p> }
  if (!data) { logginF('!data main query'); return }


  // console.log(data);

  const siteNodes = data.pages.nodes;
  const menuNodes = data.menuItems.nodes;
  const menuNodesFooter = data.footerMenuItems.nodes;


  var preloadingArray = [];
  var preloadingProjectsArray = [];


  if (caching_type === 'all site'){
      // homepage
      const homePageData = data.homePage;

      if (homePageData){
        const parser = new DOMParser();
        const parsedDocument = parser.parseFromString(homePageData.content, "text/html");
        const imgs = parsedDocument.getElementsByTagName("img");
        for (const value of Array.from(imgs)) {
            imagesPreload.push(value.src.replace('-1024x373', ''));
        }
        imagesPreload.push(homePageData.homepageExtras?.image1?.sourceUrl);
        imagesPreload.push(homePageData.homepageExtras?.image2?.sourceUrl);
        imagesPreload.push(homePageData.homepageExtras?.image3?.sourceUrl);
        // imagesPreload.push(homePageData.homepageExtras.image4.sourceUrl);
        // imagesPreload.push(homePageData.homepageExtras.image5.sourceUrl);
        // imagesPreload.push(homePageData.homepageExtras.image6.sourceUrl);
        // imagesPreload.push(homePageData.homepageExtras.image7.sourceUrl);
        // imagesPreload.push(homePageData.homepageExtras.image8.sourceUrl);
        // imagesPreload.push(homePageData.homepageExtras.image9.sourceUrl);
      }
      // weAreTrusted
      const weAreTrustedData = data.weAreTrusted;
      if (weAreTrustedData)
        imagesPreload.push(weAreTrustedData.featuredImage?.node?.sourceUrl);

      // weDeliver
      const weDeliverData = data.weDeliver;
      if (weDeliverData){
          weDeliverData.children.edges.forEach((element, ind) => {
            if (ind<2){
              if (element.node.featuredImage){
                imagesPreload.push(element.node.featuredImage.node.sourceUrl);

              }
            }
            if (element.node.projectsExtras?.heroImage)
              preloadingProjectsArray[element.node.uri] = element.node.projectsExtras?.heroImage.sourceUrl;
          });
      }

      // theTeam
      const theTeamData = data.theTeam;
      if (theTeamData){
        imagesPreload.push(theTeamData.weHaveFacesExtras?.tile1?.thumb?.sourceUrl);
        imagesPreload.push(theTeamData.weHaveFacesExtras?.tile2?.thumb?.sourceUrl);
        imagesPreload.push(theTeamData.weHaveFacesExtras?.tile3?.thumb?.sourceUrl);
        // imagesPreload.push(theTeamData.weHaveFacesExtras.tile4.thumb.sourceUrl);
        // imagesPreload.push(theTeamData.weHaveFacesExtras.tile5.thumb.sourceUrl);
        // imagesPreload.push(theTeamData.weHaveFacesExtras.tile6.thumb.sourceUrl);
        // imagesPreload.push(theTeamData.weHaveFacesExtras.tile7.thumb.sourceUrl);
        // imagesPreload.push(theTeamData.weHaveFacesExtras.tile8.thumb.sourceUrl);
        // imagesPreload.push(theTeamData.weHaveFacesExtras.tile9.thumb.sourceUrl);
      }

      // pages
      const otherPages = data.pages;

      // console.log(otherPages);
      otherPages.nodes.forEach((element, ind) => {
        if (element.featuredImage){
          if (
            ind === 14 ||  // we believe
            ind === 16     // we team
          )
            imagesPreload.push(element.featuredImage.node.sourceUrl);
            preloadingArray[element.uri] = element.featuredImage.node.sourceUrl;
            // bind images to nodes



        }
      });


      imagesPreload.filter(Boolean).forEach((image) => {
          const newImage = new Image();
          newImage.src = image;
          window[image] = newImage;
      });
}


  // console.log(preloadingArray);



  return (
    <HelmetProvider>
          <Helmet htmlAttributes={{ class: useDemoData ? "demo-mode" : "" }}>
              <title>FORM & FIELD</title>
          </Helmet>
          <BrowserRouter>
              <Header menuNodes={menuNodes} preloadingArray={preloadingArray} />
              {
                (!useDemoData && process.env.NODE_ENV === 'development')
                ?
                <Suspense fallback={null}><ToolEditPage /></Suspense>
                :
                <></>
              }
              <Suspense fallback={<span style={{fontSize:'12px'}}></span>} >
                <Routes >
                  <Route element={<AnimationLayout />}  >
                  {/* <Route> */}
                    <Route exact path="/" element={<PageHome preloadingArray={preloadingArray}  /> } />
                      {siteNodes.map((siteNode, index) => {
                          if (siteNode.slug === 'homepage') return null;
                          {
                              let PageComponent = PageComponentsMap_slug_component[siteNode.slug];
                              // console.log(PageComponent===undefined);
                              // console.log(PageComponent);
                              // 404 - slug 404 is reserved from wordpress but that is not a problem
                              if (siteNode.slug==='404-2') { // all pages that have no wrong slug go to 404-2 page template
                                  return (
                                    <Route key={index} path="*" element={<PageTemplateSimple nodeData={siteNode} />}   />
                                  );
                              }else if (siteNode.parent!=null && siteNode.parent.node.slug === 'creative-reviews') {// all pages that have creative-reviews as parent are creative-review html newsletters
                                  return (
                                    <Route key={index} path={siteNode.uri} element={<PageTemplateCreativeReview nodeData={siteNode} />}   />
                                  );
                              }else if (siteNode.parent!=null && siteNode.parent.node.slug === 'we-deliver') {// all pages that have work as parent are projects
                                  return (
                                    <Route key={index} path={siteNode.uri} element={<PageTemplatePoject nodeData={siteNode} />}   />
                                  );
                              }else if (PageComponent!==undefined) {// all pages that have custom template are mapped
                                  return (
                                    <Route key={index} path={siteNode.uri} element={<PageComponent nodeData={siteNode} preloadingArray={preloadingArray} preloadingProjectsArray={preloadingProjectsArray} />}   />
                                  );
                              } else { // all pages that dont have custom template are not mapped mapped
                                  return (
                                    <Route key={index} path={siteNode.uri} element={<PageTemplateSimple nodeData={siteNode} />}   />
                                  );
                              }
                          }
                      })}
                  </Route>
                </Routes>
                </Suspense>
              <Footer menuNodesFooter={menuNodesFooter} />
          </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
