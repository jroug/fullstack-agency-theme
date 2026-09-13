import React, {useEffect, useLayoutEffect} from "react";
import { useQuery, gql } from "@apollo/client";
import { logginF } from './__Utils';
import { Helmet
 } from "react-helmet-async";
const Page_TemplatePoject = (props) => {


    useEffect(() => {
        document.body.classList.add('project');
        return () => {
          document.body.classList.remove('project');
        }
    }, [])

    useLayoutEffect(() => {
        document.getElementById('footer').classList.remove('hidden');
        return () => {
            document.getElementById('footer').classList.add('hidden');
        }
    });

    const nodeData = props.nodeData;
    // console.log(nodeData);
    const GET_PROJECT_CONTENT = gql`query GET_PROJECT_CONTENT {
        page( id: "${nodeData.uri.slice(1, -1)}", idType: URI ) {
            id
            title
            content
            featuredImage {
                    node {
                        id
                        sourceUrl
                    }
            }
            projectsExtras {
                client
                ourServices
                project
                mainText
                heroImage{
                    sourceUrl
                }
            }
        }
    }`;

    const { data, loading, error } = useQuery(GET_PROJECT_CONTENT);

    if (loading) { logginF('loading From Page_TemplateProject'); return }
    if (error) { logginF('error From Page_TemplateProject'); return }
    if (!data?.page) { logginF('error From Page_TemplateProject'); return }

    const nodeMoreData = data.page;

    return(
        <>
            <Helmet>
                <title>{nodeMoreData.projectsExtras?.project} | FORM & FIELD</title>
            </Helmet>
            <section className="mb-5 ">
                <div className="container-fluid px-0">
                    <div className="project-featured-image">
                        <img src={nodeMoreData.projectsExtras?.heroImage?.sourceUrl} alt="" width="2560" height="993"  />
                    </div>
                </div>
            </section>
            <section className="py-2 py-lg-5">
                <div className="container-xxl">
                    <div className="project-texts">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="project-description mb-5" dangerouslySetInnerHTML={{__html:nodeMoreData.projectsExtras?.mainText}} ></div>
                            </div>
                            <div className="col-sm-6">
                                <div className="project-titles">
                                    <div className="project-client">
                                        <h6><strong>Client</strong></h6>
                                        <span>{nodeMoreData.projectsExtras?.client}</span>
                                    </div>
                                    <hr style={{ width: '60%' }} />
                                    <div className="project-project">
                                        <h6><strong>Project</strong></h6>
                                        <span>{nodeMoreData.projectsExtras?.project}</span>
                                    </div>
                                    <hr style={{ width: '60%' }} />
                                    <div className="project-our-services">
                                        <h6><strong>Our services</strong></h6>
                                        <span>{nodeMoreData.projectsExtras?.ourServices}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-5 mb-lg-5">
                <div className="container-xxl">
                    <div className="project-content" dangerouslySetInnerHTML={{__html:nodeMoreData.content}} ></div>
                </div>
            </section>
        </>
    );
    }

export default Page_TemplatePoject;
