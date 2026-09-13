
import React, { useEffect, useLayoutEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import WidgetSimpleTitle from "./Widget_SimpleTitle";
import WidgetSimpleHeroImage from "./Widget_SimpleHeroImage";
import WidgetSimpleContent from "./Widget_SimpleContent";
import { logginF } from './__Utils';
import __GraphQL_Queries from "./__GraphQL_Queries";
import { Helmet } from "react-helmet-async";
const Page_WeAreTrusted = (props) => {

    const nodeData = props.nodeData;

    useEffect(() => {
        document.body.classList.add('we-are-trusted');
        return () => {
          document.body.classList.remove('we-are-trusted');
        }
    }, [])

    useLayoutEffect(() => {
        document.getElementById('footer').classList.remove('hidden');
        return () => {
            document.getElementById('footer').classList.add('hidden');
        }
    });

    const GET_CLIENTS_CONTENT = gql`query GET_CLIENTS_CONTENT
    {
      ${__GraphQL_Queries.queries.weAreTrusted}
    }`;

    const { data, loading, error } = useQuery(GET_CLIENTS_CONTENT);

    if (loading) { logginF('loading From Page_WeAreTrusted'); return }
    if (error) { logginF('error From Page_WeAreTrusted'); return }
    if (!data?.weAreTrusted) { logginF('error From Page_WeAreTrusted'); return }

    const nodeMoreData = data.weAreTrusted;
    // const content = parse(nodeMoreData.content);
    // console.log(content);

    // strip tags from html in text
    // const text = nodeMoreData.content.replace(/<\/?[^>]+(>|$)/g, '');

    const wysiwyg_html = nodeMoreData.weAreTrustedExtras?.images || "";

    const parser = new DOMParser();
    const parsedDocument = parser.parseFromString(wysiwyg_html, "text/html");
    const imgs = parsedDocument.getElementsByTagName("img");
    const img_arr = [];
    for (const [key, value] of Object.entries(imgs)) {
        img_arr[key] = value.src;
    }

    return (
        <>
            <Helmet>
                <title>We are trusted | FORM & FIELD</title>
            </Helmet>
            <WidgetSimpleTitle widgetTitle={nodeData.title} />
            <WidgetSimpleHeroImage imgObj={nodeMoreData.featuredImage?.node} />
            <WidgetSimpleContent contentHTML={nodeMoreData.content} />
            <section>
                <div className="container-xxl">
                    <div className="row">
                        <div className="col-12 logos-gallery d-grid px-md-5 px-xxl-0 py-5">
                            {img_arr.map( (_src, index) => {
                                return (
                                    <img key={index} src={_src} className="w-100 w-trusted" width="212" height="141" alt="..." />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Page_WeAreTrusted;
