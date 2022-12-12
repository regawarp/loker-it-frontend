import "./index.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState, useEffect, useRef } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import SelectImageModal from "./SelectImageModal";
import { ToastContainer, toast } from "react-toastify";
import { TweetService } from "../../services/TweetService";
import { useFormik } from "formik";

import Modal from "../Modal";

const UpdateTweetModal = ({ show, setShow, selectedTweet }) => {
  const [carouselIndexActive, setCarouselIndexActive] = useState(0);
  const [showModalSelectImage, setShowModalSelectImage] = useState(false);
  const [posterCarousels, setPosterCarousels] = useState(
    selectedTweet?.tweet_posters || []
  );
  const toastId = "post-tweet-result";

  const messageSuccess = (message) =>
    toast.success(message, {
      toastId: toastId,
    });

  const messageFailed = (message) =>
    toast.error(message, {
      toastId: toastId,
    });

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

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      tweet_id: selectedTweet?.tweet_id || "",
      tweet_caption_text: selectedTweet?.tweet_caption_text || "",
      tweet_posters: [],
    },
    onSubmit: async (values) => {
      console.log("submitting:", {
        id: values?.tweet_id,
        caption: values?.tweet_caption_text,
        posterIds: values?.tweet_posters?.map((poster) => poster?.poster_id),
      });
    },
  });

  useEffect(() => {
    formik.setFieldValue("tweet_posters", posterCarousels);
  }, [posterCarousels]);

  useEffect(() => {
    setPosterCarousels(selectedTweet?.tweet_posters);
  }, [selectedTweet]);

  const posterCarouselComp = (
    <div className="flex flex-col justify-between p-4 w-1/2 h-full gap-8">
      {posterCarousels?.length > 0 ? (
        <Slider {...settings} className="bg-gray-300 w-full h-[85%]">
          {posterCarousels !== null && posterCarousels !== undefined ? (
            posterCarousels.map((carousel, index) => {
              return (
                <div
                  key={`slide` + index}
                  className={`${
                    carouselIndexActive === index ? "carousel-item" : "hidden"
                  } relative w-full h-full`}
                >
                  <TransformWrapper initialScale={1} ref={transformRef}>
                    {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                      <div className="flex flex-col w-full items-center h-full">
                        <TransformComponent>
                          <img
                            src={
                              process.env.REACT_APP_BE_URL +
                              carousel?.poster_image_path
                            }
                            alt={carousel?.poster_image_path}
                            className="h-full m-0"
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
          className="flex flex-col h-[85%] w-full border-solid border-2 border-black 
          items-center justify-center font-bold text-lg"
        >
          Select poster first
        </div>
      )}
      <div className="btn h-[5%]" onClick={() => setShowModalSelectImage(true)}>
        select poster
      </div>
    </div>
  );

  const captionSelectComp = (
    <div className="flex flex-col w-1/2 h-full p-4 gap-4">
      <div className="w-full flex flex-col gap-2">
        <label className="text-xs font-bold text-[#000000]">Caption</label>
        <textarea
          className="textarea textarea-bordered rounded-lg resize-none border-gray-300 focus:outline-none"
          placeholder="Enter caption"
          name="tweet_caption_text"
          value={formik.values.tweet_caption_text}
          onChange={formik.handleChange}
        ></textarea>
      </div>
      <div className="flex items-end justify-end">
        <button type="submit" className="btn">
          Update Tweet
        </button>
      </div>
    </div>
  );

  const modalHeader = (
    <Modal.Header>
      <span className="text-xl font-bold leading-[1.0625rem]">
        Select poster(s) to be posted
      </span>
      <label
        className="btn btn-xs btn-circle absolute bg-gray-500 right-6 top-7"
        onClick={() => setShow(false)}
      >
        ✕
      </label>
      <div className="divider"></div>
    </Modal.Header>
  );

  const modalBody = (
    <Modal.Body>
      <form onSubmit={formik.handleSubmit}>
        <div className="form-control">
          <div className="flex flex-row p-0 m-0 w-[80rem] h-[38rem]">
            {posterCarouselComp}
            {captionSelectComp}
          </div>
        </div>
      </form>
    </Modal.Body>
  );

  return (
    <>
      <ToastContainer />
      <Modal show={show} setShow={setShow}>
        {modalHeader}
        {modalBody}
      </Modal>
      <SelectImageModal
        show={showModalSelectImage}
        setShow={setShowModalSelectImage}
        posterList={posterCarousels}
        setPosterList={setPosterCarousels}
        initialPosterList={selectedTweet?.tweet_posters}
      />
    </>
  );
};

export default UpdateTweetModal;
