import React, { Suspense, lazy, useRef, useLayoutEffect, useEffect } from "react";
import { Link } from "react-router-dom";
import __GraphQL_Queries from "./__GraphQL_Queries";
import { preloadImage, logginF } from './__Utils';
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
// import {
//     WidgetHomeSliderBootstrap
// } from "./";
import { useQuery, gql } from "@apollo/client";

const WidgetHomeSliderBootstrap = lazy( () => import("./Widget_HomeSliderBootstrap") );

const Page_Home = (props) => {
    // animation
    const refBox = useRef();

    useLayoutEffect(() => {
        document.getElementById('footer').classList.remove('hidden');
        const ctx = gsap.context(() => {
            gsap.registerPlugin(ScrollTrigger);

            for (let i=0;i<9;i++){
                let d = 0.05*(i%3);
                gsap.from(".box-"+i, {
                    scrollTrigger: {
                        trigger: ".box-"+i
                    },
                    delay: d,
                    transform: "translateY(50px)",
                    opacity:0,
                    duration:0.3
                });
            }

            // gsap.to(".box-4", {  scale:3 });
        }, refBox);
        return () => {
            ctx.revert();
            document.getElementById('footer').classList.add('hidden');
        }
    });

    useEffect(() => {
        document.body.classList.add('home');
        return () => {
          document.body.classList.remove('home');
        }
    }, [])

    const preloadingArray = props.preloadingArray;
    // console.log("preloadingArray", preloadingArray);
    const HOMEPAGE_CONTENT = gql`query HOMEPAGE_CONTENT
    {
      ${__GraphQL_Queries.queries.homePage}
    }`;

    const { data, loading, error } = useQuery(HOMEPAGE_CONTENT);

    // console.log(data);

    if (loading) { logginF('loading From Page_Home'); return }
    if (error) { logginF('error From Page_Home'); return }
    if (!data?.homePage) { logginF('error From Page_Home'); return }

    const nodeMoreData = data.homePage;
    const home_gallery_html = nodeMoreData.content;

    const parser = new DOMParser();
    const parsedDocument = parser.parseFromString(home_gallery_html, "text/html");
    const figures = parsedDocument.getElementsByTagName("figure");
    // const img_arr = {};
    // const src_set = [];
    // for (const [key, value] of Object.entries(imgs)) {
    //     // img_arr[key] = value.src.replace('-1024x373', '');
    //     img_arr[key] = value;
    //     // src_set[key].srcset = value.srcset;
    // }

    const homepageExtrasArray = nodeMoreData.homepageExtras || {};
    // console.log("homepageExtrasArray", homepageExtrasArray);


    const img_arr_inner = [];
    var n = 0;
    for (const [key, value] of Object.entries(homepageExtrasArray)) {
        if (key !== '__typename' && value?.sourceUrl){
            var _targetUrl = value.targetUrl==null?'':value.targetUrl.replace(/<\/?[^>]+(>|$)/g, '').replace("\n","");
            img_arr_inner[n++] = { img_src: value.sourceUrl, title: value.title, _targetUrl: _targetUrl, altText: value.altText, width: value.mediaDetails?.width, height: value.mediaDetails?.height };
        }
    }
    //  console.log(img_arr_inner);
    return (
        <div ref={refBox} >
            <Suspense fallback={<span style={{fontSize:'12px'}}>Loading...</span>} >
                <WidgetHomeSliderBootstrap figures = {figures} />
            </Suspense>
            <section className="py-3">
                <div className="container-xxl">
                    <div className="row px-sm-5 px-md-0">
                        {[6,3,3].map( (value, index) => {
                            // console.log('tolis')
                            // console.log(img_arr_inner[index]._targetUrl)
                            if (!img_arr_inner[index]) return null;
                            return (
                                <div key={"img__"+index} className={"box box-" + index + " col-md-" + value} >
                                    <figure className="figure mx-sm-5 px-sm-5 mx-md-0 px-md-0">
                                        <Link to={img_arr_inner[index]._targetUrl} onMouseEnter={ () => preloadImage(preloadingArray[img_arr_inner[index]._targetUrl]) } >
                                            <div className="figure-img-wrap">
                                                <img src={img_arr_inner[index].img_src} width={img_arr_inner[index].width} height={img_arr_inner[index].height} className="figure-img img-fluid" alt={img_arr_inner[index].altText} loading="lazy" />
                                            </div>
                                            <figcaption className="figure-caption fw-medium fs-5">{img_arr_inner[index].title}</figcaption>
                                        </Link>
                                    </figure>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
            <section className="py-3">
                <div className="container-xxl">
                    <div className="row px-sm-5 px-md-0">
                        {[3,3,6].map( (value, index) => {
                            // console.log('tolis')
                            index = index+3;
                            if (!img_arr_inner[index]) return null;
                            return (
                                <div key={"img__"+index} className={"box box-" + index + " col-md-" + value } >
                                    <figure className="figure mx-sm-5 px-sm-5 mx-md-0 px-md-0">
                                        <Link to={img_arr_inner[index]._targetUrl} >
                                            <div className="figure-img-wrap">
                                                <img src={img_arr_inner[index].img_src} width={img_arr_inner[index].width} height={img_arr_inner[index].height}  className="figure-img img-fluid" alt={img_arr_inner[index].altText} loading="lazy" />
                                            </div>
                                            <figcaption className="figure-caption fw-medium fs-5">{img_arr_inner[index].title}</figcaption>
                                        </Link>
                                    </figure>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
            <section className="py-3 mb-5">
                <div className="container-xxl">
                    <div className="row px-sm-5 px-md-0">
                        {[6,3,3].map( (value, index) => {
                            // console.log('tolis')
                            index = index + 6;
                            if (!img_arr_inner[index]) return null;
                            return (
                                <div key={"img__"+index} className={"box box-" + index + " col-md-" + value }>
                                    <figure className="figure mx-sm-5 px-sm-5 mx-md-0 px-md-0">
                                        <Link to={img_arr_inner[index]._targetUrl} >
                                            <div className="figure-img-wrap">
                                                <img src={img_arr_inner[index].img_src}  width={img_arr_inner[index].width} height={img_arr_inner[index].height}  className="figure-img img-fluid" loading="lazy" alt={img_arr_inner[index].altText} />
                                            </div>
                                            <figcaption className="figure-caption fw-medium fs-5">{img_arr_inner[index].title}</figcaption>
                                        </Link>
                                    </figure>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Page_Home;
