import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useState, useEffect } from "react";
import Modal from "../Modal";
import { PosterService } from "../../services/PosterService";

const SelectImageModal = ({ show, setShow, posterList, setPosterList }) => {
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

  const modalHeader = <Modal.Header>
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

  const posterDisplay = posters?.map((poster, idx) => (
    <div
      key={idx}
      className={`
        flex flex-col h-[20rem] gap-2 p-2 bg-gray-200 items-center justify-between
        ${posterList.some((item) => poster?.filename === item?.filename) ? "bg-green-500" : "bg-gray-200"}
      `}
      onClick={() => {
        if (posterList.some((item) => poster?.filename === item?.filename)) {
          setPosterList((previousState) =>
            previousState.filter(
              (item) => poster?.filename !== item?.filename
            )
          );
        } else {
          if (posterList?.length < 4) {
            setPosterList((previousState) => [...previousState, poster,]);
          }
        }
      }}
    >
      <img
        key={idx}
        src={poster?.url}
        alt={poster?.filename}
        className="w-[16rem] h-[16rem] cursor-pointer"
      />
      <span className="w-full text-center pt-1 pb-2 font-bold">
        {poster?.filename}
      </span>
    </div>
  ))

  const posterLoadingDisplay = [...Array(6).keys()].map((item, index) => {
    return <div className="w-[16rem] h-[16rem] bg-gray-300 animate-pulse"></div>;
  })

  const noPosterDisplay = <div className="w-full text-center font-bold">No data</div>

  const modalBody = <Modal.Body>
    <div className="grid grid-cols-4 gap-4 w-full h-full">
      {loadingGetPoster ? posterLoadingDisplay : posters?.length > 0 ? posterDisplay : noPosterDisplay}
    </div>
  </Modal.Body >

  return (
    <Modal show={show} setShow={setShow}>
      {modalHeader}
      {modalBody}
    </Modal>
  );
};

export default SelectImageModal;