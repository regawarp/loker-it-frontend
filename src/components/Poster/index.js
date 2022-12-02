import { useState, useEffect, useRef } from "react";
import { PosterService } from "../../services/PosterService";

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
  const [posters, setPosters] = useState([]);

  useEffect(() => {
    const getPoster = async () => {
      const result = await PosterService.getPosters();
      if (Array.isArray(result?.data)) {
        setPosters(result?.data);
      }
    };
    getPoster();
  }, []);

  const [showModalPoster, setShowModalPoster] = useState(false);
  const [openedPoster, setOpenedPoster] = useState("");

  return (
    <>
      <div className="flex flex-col gap-4 px-6 py-20">
        <div className="flex flex-row gap-4">
          <div className="btn">Download Poster</div>
        </div>
        <div
          className="grid grid-cols-4 gap-4 p-6 border-2 border-solid border-gray-500 
        justify-items-center items-center"
        >
          {posters?.map((poster, idx) => (
            <div className="flex flex-col w-full gap-2 p-1 bg-gray-200">
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
          ))}
        </div>
      </div>
      <ModalOpenImage
        show={showModalPoster}
        setShow={setShowModalPoster}
        openedPoster={openedPoster}
      />
    </>
  );
};

export default Poster;
