import React, {  useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";

const Widget_SimpleHeroImage = (props) => {

    const imgObj = props.imgObj;

    // animation
    const refBox = useRef();

    useLayoutEffect(() => {
        if (!refBox.current) return;
        const ctx = gsap.context(() => {
            gsap.from(refBox.current, {  transform: "translateY(50px)"  });
            gsap.to(refBox.current, {  transform: "translateY(0)"  });

            // gsap.to(".box-4", {  scale:3 });
        }, refBox);
        return () => ctx.revert();
    });


    if (!imgObj?.sourceUrl) return null;

    return (
        <section>
            <div className="container-xxl d-flex justify-content-center pb-5" ref={refBox} >
                <img className="simple-page-featured-image"
                    src={imgObj.sourceUrl}
                    // srcSet={imgObj.mediaDetails.sizes[2].sourceUrl + ' 600w, ' +imgObj.sourceUrl + ' 1280w' }
                    style={{objectFit:'cover'}}
                    width="1296"
                    height="384"
                    alt="..."/>
            </div>
        </section>
    );
}

export default Widget_SimpleHeroImage;
