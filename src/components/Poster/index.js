import { useState, useEffect } from "react";
import { PosterService } from "../../services/PosterService";

import Modal from "../Modal";

const ModalOpenImage = ({ show, setShow, openedPoster }) => {
  return (
    <Modal show={show} setShow={setShow}>
      <Modal.Header>
        <span className="text-xl font-bold leading-[1.0625rem]">
          {openedPoster?.filename}
        </span>
        <label
          className="btn btn-xs btn-circle absolute bg-[#472F92] right-6 top-7
            bg-opacity-80 hover:bg-opacity-80"
          onClick={() => setShow(false)}
        >
          ✕
        </label>
        <div className="divider"></div>
      </Modal.Header>
      <Modal.Body>
        <img src={openedPoster?.url} alt="opened poster"/>
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
