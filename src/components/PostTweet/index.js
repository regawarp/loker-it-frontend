import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useState, useEffect, useRef } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import Modal from "../Modal";
import { SelectionBox } from "../SelectionBox";

import { PosterService } from "../../services/PosterService";
import { CaptionService } from "../../services/CaptionService";

const ModalSelectImage = ({ show, setShow, posterList, setPosterList }) => {
  const [loadingGetPoster, setLoadingGetPoster] = useState(false);
  const [posters, setPosters] = useState([]);

  useEffect(() => {
    const getPoster = async () => {
      setLoadingGetPoster(true);
      const result = await PosterService.getPosters();
      if (Array.isArray(result?.data)) {
        setPosters(result?.data);
      }
      setLoadingGetPoster(false);
    };
    getPoster();
  }, []);

  return (
    <Modal show={show} setShow={setShow}>
      <Modal.Header>
        <span className="text-xl font-bold leading-[1.0625rem]">
          Select poster to be posted
        </span>
        <label
          className="btn btn-xs btn-circle absolute bg-gray-500 right-6 top-7 pt-0.5"
          onClick={() => setShow(false)}
        >
          ✕
        </label>
        <div className="divider"></div>
      </Modal.Header>
      <Modal.Body>
        <div className="grid grid-cols-4 gap-4 w-[82rem] h-[38rem]">
          {loadingGetPoster ? (
            <>
              <div className="w-[16rem] h-[16rem] bg-gray-300 animate-pulse"></div>
              <div className="w-[16rem] h-[16rem] bg-gray-300 animate-pulse"></div>
              <div className="w-[16rem] h-[16rem] bg-gray-300 animate-pulse"></div>
              <div className="w-[16rem] h-[16rem] bg-gray-300 animate-pulse"></div>
              <div className="w-[16rem] h-[16rem] bg-gray-300 animate-pulse"></div>
              <div className="w-[16rem] h-[16rem] bg-gray-300 animate-pulse"></div>
              <div className="w-[16rem] h-[16rem] bg-gray-300 animate-pulse"></div>
            </>
          ) : posters?.length > 0 ? (
            posters?.map((poster, idx) => (
              <div
                key={idx}
                className={`"flex flex-col w-full h-[18rem] gap-2 p-1 bg-gray-200 ${
                  posterList.some((item) => poster?.filename === item?.filename)
                    ? "bg-green-500"
                    : "bg-gray-200"
                }`}
                onClick={() => {
                  if (
                    posterList.some(
                      (item) => poster?.filename === item?.filename
                    )
                  ) {
                    setPosterList((previousState) =>
                      previousState.filter(
                        (item) => poster?.filename !== item?.filename
                      )
                    );
                  } else {
                    if (posterList?.length < 4) {
                      setPosterList((previousState) => [
                        ...previousState,
                        poster,
                      ]);
                    }
                  }
                }}
              >
                <img
                  key={idx}
                  src={poster?.url}
                  alt={poster?.filename}
                  className="w-full max-h-[16rem] cursor-pointer"
                />
                <span className="w-full text-center pt-1 pb-2 font-bold">
                  {poster?.filename}
                </span>
              </div>
            ))
          ) : (
            <div className="w-full text-center font-bold">No data</div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

const PostTweet = (props) => {
  const [carouselIndexActive, setCarouselIndexActive] = useState(0);
  const [showModalSelectImage, setShowModalSelectImage] = useState(false);
  const [posterCarousels, setPosterCarousels] = useState([]);

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

  const [caption, setCaption] = useState(null);
  const [captionsOptions, setCaptionsOptions] = useState([]);

  async function getCaptions() {
    const dataFromAPI = await CaptionService.getCaptions();
    if (Array.isArray(dataFromAPI?.data)) {
      setCaptionsOptions(
        dataFromAPI?.data?.map((obj) => {
          return {
            label: obj?.caption_text,
            value: obj?.caption_id,
          };
        })
      );
    }
  }

  useEffect(() => {
    getCaptions();
  }, []);

  return (
    <>
      <div className="flex flex-row gap-4 px-6 mt-5">
        <div className="flex flex-col justify-center w-[48rem] h-full gap-8">
          {posterCarousels?.length > 0 ? (
            <Slider {...settings} className="bg-gray-300 py-4">
              {posterCarousels !== null && posterCarousels !== undefined ? (
                posterCarousels.map((carousel, index) => {
                  return (
                    <div
                      key={`slide` + index}
                      className={`${
                        carouselIndexActive === index
                          ? "carousel-item"
                          : "hidden"
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
          ) : (
            <div
              className="flex flex-col h-[44rem] border-solid border-2 border-black 
              items-center justify-center font-bold text-lg"
            >
              Select poster first
            </div>
          )}
          <div className="btn" onClick={() => setShowModalSelectImage(true)}>
            select poster
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full">
          <SelectionBox
            label="Caption"
            placeholder="Choose caption"
            value={caption}
            options={captionsOptions}
            handleChange={(value) => setCaption(value)}
          />
          <div>{caption?.caption_text}</div>
        </div>
      </div>
      <ModalSelectImage
        show={showModalSelectImage}
        setShow={setShowModalSelectImage}
        posterList={posterCarousels}
        setPosterList={setPosterCarousels}
      />
    </>
  );
};

export default PostTweet;
