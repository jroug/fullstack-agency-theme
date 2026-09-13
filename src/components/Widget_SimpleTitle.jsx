import { Helmet } from "react-helmet-async";
const Widget_SimpleTitle = (props) => {

    return(  
        <>
        <Helmet>
            <title>{props.widgetTitle} | FORM & FIELD</title>
        </Helmet>
        <section className="page-title-section">
            <div className="container-xxl">
                <div className="page-title-wrap my-5 px-5">
                    <h1 className="page-title fs-1 fw-normal text-center text-lg-start">{props.widgetTitle}</h1>
                </div>
            </div>
        </section>
        </>
    );
    }

export default Widget_SimpleTitle;