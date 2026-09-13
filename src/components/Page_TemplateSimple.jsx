import React, { useEffect, useLayoutEffect }  from "react";
import WidgetSimpleTitle  from "./Widget_SimpleTitle";
import WidgetSimpleHeroImage  from "./Widget_SimpleHeroImage";
import WidgetSimpleContent  from "./Widget_SimpleContent";

const Page_WeBelieve = (props) => {
    const nodeData = props.nodeData;


    useEffect(() => {
        document.body.classList.add('simple');
        return () => {
          document.body.classList.remove('simple');
        }
    }, [])

    useLayoutEffect(() => {
        document.getElementById('footer').classList.remove('hidden');
        return () => {
            document.getElementById('footer').classList.add('hidden');
        }
    });

    return (
        <>
            {
                nodeData.title!==null ?
                <WidgetSimpleTitle widgetTitle={nodeData.title} />
                    :
                    'no-title'
            }
            {
                nodeData.featuredImage!==null ?
                    <WidgetSimpleHeroImage imgObj={nodeData.featuredImage.node} />
                    :
                    ''
            }
            {
                nodeData.content!==null ?
                    <WidgetSimpleContent contentHTML={nodeData.content} />
                    :
                    ''
            }

        </>
    )
}


export default Page_WeBelieve;
