import './index.css';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState, useEffect, useRef } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import reactStringReplace from "react-string-replace";
import { SelectionBox } from "../SelectionBox";
import SelectImageModal from "./SelectImageModal";
import { ToastContainer, toast } from 'react-toastify';
import { CaptionService } from '../../services/CaptionService';
import { TweetService } from '../../services/TweetService';

const PostTweet = (props) => {
  const [carouselIndexActive, setCarouselIndexActive] = useState(0);
  const [showModalSelectImage, setShowModalSelectImage] = useState(false);
  const [posterCarousels, setPosterCarousels] = useState([]);
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

  const COMPANY_NAME_STRING = "Nama Perusahaan";
  const [companyName, setCompanyName] = useState("");
  const [job, setJob] = useState("");

  const posterCarouselComp = <div className="flex flex-col justify-between p-4 w-1/2 h-full gap-8">
    {posterCarousels?.length > 0 ? (
      <Slider {...settings} className="bg-gray-300 w-full h-[85%]">
        {posterCarousels !== null && posterCarousels !== undefined ? (
          posterCarousels.map((carousel, index) => {
            return (
              <div
                key={`slide` + index}
                className={`${carouselIndexActive === index
                  ? "carousel-item"
                  : "hidden"
                  } relative w-full h-full`}
              >
                <TransformWrapper initialScale={1} ref={transformRef}>
                  {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                    <div className="flex flex-col w-full items-center h-full">
                      <TransformComponent>
                        <img
                          src={carousel?.url}
                          alt={carousel?.filename}
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

  const captionSelectComp = <div className="flex flex-col w-1/2 h-full p-4 gap-4">
    <SelectionBox
      label="Caption"
      placeholder="Choose caption"
      value={caption}
      options={captionsOptions}
      handleChange={(value) => setCaption(value)}
    />
    <div className='leading-[3]'>
      {reactStringReplace(caption?.label, /\[([^\]]*)\]/g, (match, i) => (
        <span
          key={i}
          className="border border-solid rounded-lg px-2 py-1"
        >
          <input
            type="text"
            name="q"
            placeholder={match}
            autoComplete="off"
            className="focus:outline-none h-6"
            value={match === COMPANY_NAME_STRING ? companyName : job}
            onChange={(e) => {
              e.preventDefault();
              if (match === COMPANY_NAME_STRING) {
                setCompanyName(e.target.value);
              } else {
                setJob(e.target.value);
              }
            }}
          />
        </span>
      ))}
    </div>
    <div className="flex items-end justify-end">
      <div className="btn"
        onClick={async () => {
          const postCaption = caption.label
            .replace(/\[nama perusahaan\]/gi, companyName)
            .replace(/\[pekerjaan\]/gi, job);
          const postImages = posterCarousels.map(item => item.url);

          const result = await TweetService.postTweet(postCaption, postImages);
          if (result?.data === "success!") {
            setCaption(null);
            setPosterCarousels([]);
            messageSuccess(result?.data);
          } else {
            messageFailed(result?.data);
          }
        }}
      >
        Post Tweet
      </div>
    </div>
  </div>

  return (
    <>
      <ToastContainer />
      <div className="flex flex-row p-0 m-0 w-screen h-screen">
        {posterCarouselComp}
        {captionSelectComp}
      </div>
      <SelectImageModal
        show={showModalSelectImage}
        setShow={setShowModalSelectImage}
        posterList={posterCarousels}
        setPosterList={setPosterCarousels}
      />
    </>
  );
};

export default PostTweet;
