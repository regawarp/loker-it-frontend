import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useState, useEffect, useRef } from "react";
import { PosterService } from "../../services/PosterService";

import { ImSpinner2 } from "react-icons/im";

import Modal from "../Modal";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const ModalOpenImage = ({ show, setShow, openedPoster }) => {
  const transformRef = useRef(null);
  useEffect(() => {
    if (!show) {
      transformRef.current?.resetTransform();
    }
  }, [show]);

  return (
    <Modal show={show} setShow={setShow}>
      <Modal.Header>
        <span className="text-xl font-bold leading-[1.0625rem]">
          {openedPoster?.filename}
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
        <TransformWrapper initialScale={1} ref={transformRef}>
          {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-4 justify-between">
                <div className="flex flex-row gap-4">
                  <div
                    className="btn min-w-[4rem] text-2xl bg-gray-500 hover:bg-gray-500 border-none"
                    onClick={() => zoomIn()}
                  >
                    +
                  </div>
                  <div
                    className="btn min-w-[4rem] text-2xl bg-gray-500 hover:bg-gray-500 border-none"
                    onClick={() => zoomOut()}
                  >
                    -
                  </div>
                </div>
                <div
                  className="btn bg-gray-500 hover:bg-gray-500 border-none"
                  onClick={() => resetTransform()}
                >
                  Reset Zoom
                </div>
              </div>
              <div className="border-2 border-solid border-gray-200">
                <TransformComponent>
                  <img
                    src={openedPoster?.url}
                    alt="opened poster"
                    className="w-full max-w-[36rem]"
                  />
                </TransformComponent>
              </div>
            </div>
          )}
        </TransformWrapper>
      </Modal.Body>
    </Modal>
  );
};

const Poster = (props) => {
  const [loadingGetPoster, setLoadingGetPoster] = useState(false);
  const [loadingDownloadPoster, setLoadingDownloadPoster] = useState(false);

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

  const [showModalPoster, setShowModalPoster] = useState(false);
  const [openedPoster, setOpenedPoster] = useState("");

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const toastId = "download-poster-result";
  const messageSuccess = (message) =>
    toast.success(message, {
      toastId: toastId,
    });

  const messageFailed = (message) =>
    toast.error(message, {
      toastId: toastId,
    });

  const downloadPoster = async () => {
    if (startDate && endDate) {
      setLoadingDownloadPoster(true);
      const result = await PosterService.downloadPoster(startDate, endDate);
      if (result?.data === "download poster success") {
        messageSuccess(result?.data);
      } else {
        messageFailed(result?.data || result?.code);
      }
      setLoadingDownloadPoster(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-8 px-6 py-16">
        <div className="flex flex-row gap-4 items-end">
          <div className="w-full flex flex-col gap-2">
            <label className="text-lg font-bold text-[#000000]">
              Start date
            </label>
            <div
              className="flex flex-row items-center rounded-lg px-3 min-h-[48px] 
              w-full text-lg input border-opacity-10 border-[#472F92] focus:outline-none
              border-2 border-solid gap-3"
            >
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  setStartDate(date);
                  if (endDate < date) {
                    setEndDate(date);
                  }
                }}
                className="border-none focus:outline-none w-full"
                placeholderText="dd-mm-yyyy"
                dateFormat="dd-MMM-yyyy"
              />
            </div>
          </div>
          <div className="w-full flex flex-col gap-2">
            <label className="text-lg font-bold text-[#000000]">End date</label>
            <div
              className="flex flex-row items-center rounded-lg px-3 min-h-[48px] 
              w-full text-lg input border-opacity-10 border-[#472F92] focus:outline-none
              border-2 border-solid gap-3"
            >
              <DatePicker
                selected={endDate}
                minDate={startDate}
                onChange={(date) => setEndDate(date)}
                className="border-none focus:outline-none w-full"
                placeholderText="dd-mm-yyyy"
                dateFormat="dd-MMM-yyyy"
              />
            </div>
          </div>
          <div
            className={`${
              loadingDownloadPoster ? "btn-disabled" : ""
            } btn w-[11rem] min-w-[11rem]`}
            onClick={() => downloadPoster()}
          >
            {loadingDownloadPoster ? (
              <ImSpinner2 className="animate-spin" />
            ) : (
              "Download Poster"
            )}
          </div>
        </div>
        <div
          className={`${
            loadingGetPoster || posters?.length > 0
              ? "grid grid-cols-4 gap-4"
              : ""
          } p-6 border-2 border-solid border-gray-500 
          justify-items-center items-center`}
        >
          {loadingGetPoster ? (
            <>
              <div className="w-[24rem] h-[24rem] bg-gray-300 animate-pulse"></div>
              <div className="w-[24rem] h-[24rem] bg-gray-300 animate-pulse"></div>
              <div className="w-[24rem] h-[24rem] bg-gray-300 animate-pulse"></div>
              <div className="w-[24rem] h-[24rem] bg-gray-300 animate-pulse"></div>
              <div className="w-[24rem] h-[24rem] bg-gray-300 animate-pulse"></div>
              <div className="w-[24rem] h-[24rem] bg-gray-300 animate-pulse"></div>
              <div className="w-[24rem] h-[24rem] bg-gray-300 animate-pulse"></div>
            </>
          ) : posters?.length > 0 ? (
            posters?.map((poster, idx) => (
              <div
                key={idx}
                className="flex flex-col w-full gap-2 p-1 bg-gray-200"
              >
                <img
                  key={idx}
                  src={poster?.url}
                  alt={poster?.filename}
                  className="w-full max-h-[24rem] cursor-pointer"
                  onClick={() => {
                    setOpenedPoster(poster);
                    setShowModalPoster(true);
                  }}
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
      </div>
      <ToastContainer />
      <ModalOpenImage
        show={showModalPoster}
        setShow={setShowModalPoster}
        openedPoster={openedPoster}
      />
    </>
  );
};

export default Poster;
