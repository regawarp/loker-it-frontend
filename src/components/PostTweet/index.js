import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useState, useEffect, useRef } from "react";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const PostTweet = (props) => {
  const [carouselIndexActive, setCarouselIndexActive] = useState(0);

  const transformRef = useRef(null);
  useEffect(() => {
    transformRef.current?.resetTransform();
  }, [carouselIndexActive]);

  const settings = {
    beforeChange: (prev, next) => {
      setCarouselIndexActive(next);
    },
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  const [posterCarousels, setPosterCarousels] = useState([
    {
      filename: "photo_6071411730526876193.jpg",
      group: "13358878451693853",
      url: "http://localhost:8081/media/13358878451693853/photo_6071411730526876193.jpg",
    },
    {
      filename: "photo_6071411730526876194.jpg",
      group: "13358878451693853",
      url: "http://localhost:8081/media/photo_6068843610666808259.jpg",
    },
    {
      filename: "photo_6071058362092597849.jpg",
      group: "13358899687195845",
      url: "http://localhost:8081/media/13358899687195845/photo_6071058362092597849.jpg",
    },
    {
      filename: "photo_6071058362092597850.jpg",
      group: "13358899687195845",
      url: "http://localhost:8081/media/photo_6068843610666808258.jpg",
    },
  ]);

  return (
    <div className="flex flex-row gap-4 px-6">
      <div className="flex flex-col justify-center w-[48rem] h-full gap-8">
        <Slider {...settings} className="mt-5 bg-gray-300 py-4">
          {posterCarousels !== null && posterCarousels !== undefined ? (
            posterCarousels.map((carousel, index) => {
              return (
                <div
                  key={`slide` + index}
                  className={`${
                    carouselIndexActive == index ? "carousel-item" : "hidden"
                  } relative w-full`}
                >
                  <TransformWrapper initialScale={1} ref={transformRef}>
                    {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                      <div className="flex flex-col w-full items-center">
                        <TransformComponent>
                          <img
                            src={carousel?.url}
                            alt={carousel?.filename}
                            className="h-[42rem] m-0"
                          />
                        </TransformComponent>
                      </div>
                    )}
                  </TransformWrapper>
                </div>
              );
            })
          ) : (
            <></>
          )}
        </Slider>
        <div className="btn">select poster</div>
      </div>
      <div className="flex flex-col gap-4">
        <div>selection box</div>
        <div>text preview</div>
      </div>
    </div>
  );
};

export default PostTweet;
