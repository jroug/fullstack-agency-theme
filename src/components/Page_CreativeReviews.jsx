import React, { useRef, useEffect, useLayoutEffect } from "react";
import __GraphQL_Queries from "./__GraphQL_Queries";
import { logginF } from './__Utils';
import { Link } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import{
    creativeReviewsFeaturedImage
}  from "../assets";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

const Page_CreativeReviews = (props) => {

    useEffect(() => {
        document.body.classList.add('creative-reviews');
        return () => {
          document.body.classList.remove('creative-reviews');
        }
    }, [])

    const refBox = useRef();

    useLayoutEffect(() => {
        document.getElementById('footer').classList.remove('hidden');
        const ctx = gsap.context(() => {
            gsap.registerPlugin(ScrollTrigger);

            for (let i=0;i<document.getElementsByClassName('figure').length;i++){
                let d = 0.05*(i%2);
                gsap.from(".box-"+i, {
                    scrollTrigger: {
                        trigger: ".box-"+i
                    },
                    delay: d,
                    transform: "translateY(100px)",
                    opacity:0,
                    duration:0.8
                });
            }

            // gsap.to(".box-4", {  scale:3 });
        }, refBox);
        return () => {
            document.getElementById('footer').classList.add('hidden');
            ctx.revert();
        }
    });

    const GET_CONTENT_CREATIVE_REVIEWS = gql`query GET_CONTENT_CREATIVE_REVIEWS
    {
      ${__GraphQL_Queries.queries.creativeReviews}
    }`;

    const { data, loading, error } = useQuery(GET_CONTENT_CREATIVE_REVIEWS);

    if (loading) { logginF('loading From Page_CreativeReviews'); return }
    if (error) { logginF('error From Page_CreativeReviews'); return }
    if (!data?.creativeReviews) { logginF('error From Page_CreativeReviews'); return }

    const nodeMoreData = data.creativeReviews;

    const parser = new DOMParser();
    const parsedDocument = parser.parseFromString(nodeMoreData.content, "text/html");
    const content_text = parsedDocument.getElementsByTagName("p");
    // console.log(content_text.length);
    let childPages = (nodeMoreData.children?.edges || []).filter(edge => edge?.node?.uri);

//     const childPagesresult = Object.keys(childPages).map((key) => [key, childPages[key]]);
//  console.log(childPagesresult);
    let ncount = -1;
    let childPageArray = [];
    childPages.forEach((element, ind) => {
        if (ind%2 === 0) ncount++;
        if (!childPageArray[ncount]) childPageArray[ncount] = [];
        childPageArray[ncount].push(element.node);
    });



    return(
        <div ref={refBox} >
            <section className="page-title-section">
                <div className="container-xxl">
                    <div className="page-title-wrap my-5 px-5">
                        <h1 className="page-title fs-1 fw-normal text-center text-lg-start">{nodeMoreData.title}</h1>
                        {
                            content_text.length>0
                            ?
                            <p className="mt-5 text-center text-lg-start">{content_text[0].innerText}</p>
                            :
                            <></>
                        }
                    </div>
                </div>
            </section>
            <section className="py-3">
                <div className="container-xxl">
                    {childPageArray.map((childPage, index) => {
                        return (
                            <div className="row" key={index}  >
                                <div className="col-md-6">
                                    <figure className={"box-" + index*2 +" figure mb-5"}>
                                        <Link to={childPage[0].uri}>
                                            <div className="figure-img-wrap">
                                                <img src={childPage[0].featuredImage?.node?.sourceUrl?childPage[0].featuredImage?.node?.sourceUrl:creativeReviewsFeaturedImage} className="figure-img img-fluid" alt="..." />
                                            </div>
                                            <figcaption className="figure-caption text-center mt-2 fw-bold p-0">{childPage[0].title}</figcaption>
                                        </Link>
                                    </figure>
                                </div>
                                {
                                    childPage[1]
                                    ?
                                        <div className="col-md-6" >
                                            <figure className={"box-" + (index*2+1) +" figure mb-5"}>
                                                <Link to={childPage[1].uri}>
                                                    <div className="figure-img-wrap">
                                                        <img src={childPage[1].featuredImage?.node?.sourceUrl || creativeReviewsFeaturedImage} className="figure-img img-fluid" alt="..." />
                                                    </div>
                                                </Link>
                                                <figcaption className="figure-caption text-center mt-2 fw-bold p-0">{childPage[1].title}</figcaption>
                                            </figure>
                                        </div>
                                    :
                                        <></>
                                }
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}

export default Page_CreativeReviews;
