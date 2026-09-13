
import Carousel from 'react-bootstrap/Carousel';

const Widget_HomeSliderBootstrap = (props) => {

    // console.log(props);
    const figure_arr = [...props.figures].filter(figure => figure.querySelector("img"));
    // console.log(figure_arr);
    return (
        <section className="slider-section mb-5">
            <div className="container-fluid px-0 h-100" >
                <div className="slider h-100" >
                    <Carousel indicators={false} pause={'hover'} >
                        {figure_arr.map( (_data, index) => {
                            var key_1 = 'key_1_' + index;
                            var classNameCaption = 'home_slide_caption_' + index;
                            return (
                                <Carousel.Item  key={key_1}  className={classNameCaption}>
                                    <img className="d-block w-100"  src={_data.querySelector("img").src}  style={ {'objectFit':'cover', 'width':'100%'} } alt={_data.querySelector("img").alt || ""}  />
                                    <Carousel.Caption>
                                        <div dangerouslySetInnerHTML={{__html:_data.querySelector("figcaption")?.innerHTML || ""}} ></div>
                                    </Carousel.Caption>
                                </Carousel.Item>
                            );
                        })}
                    </Carousel>
                </div>
            </div>
        </section>
    );
}

export default Widget_HomeSliderBootstrap;
