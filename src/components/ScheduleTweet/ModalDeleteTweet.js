import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { TweetService } from "../../services/TweetService";

import { IoMdTrash } from "react-icons/io";
import { ImSpinner2 } from "react-icons/im";

import Modal from "../Modal";

const UpdateTweetModal = ({
  show,
  setShow,
  selectedTweet,
  setRefreshScheduledTweets,
}) => {
  const [loadingDelete, setLoadingDelete] = useState(false);

  const toastId = "delete-tweet-result";
  const messageSuccess = (message) =>
    toast.success(message, {
      toastId: toastId,
    });
  const messageFailed = (message) =>
    toast.error(message, {
      toastId: toastId,
    });

  const modalHeader = (
    <Modal.Header>
      <span className="text-xl font-bold leading-[1.0625rem]">
        Delete Tweet
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

  async function deleteTweet(tweet) {
    setLoadingDelete(true);
    const result = await TweetService.deleteScheduledTweet(
      selectedTweet?.tweet_id
    );
    if (result?.data === "delete tweet success") {
      messageSuccess(result?.data);
      setRefreshScheduledTweets(true);
      setShow(false);
    } else {
      messageFailed(result?.data);
    }
    setLoadingDelete(false);
  }

  const modalBody = (
    <Modal.Body>
      <div className="flex flex-col gap-16 w-[32rem] h-[24rem] items-center">
        <span className="text-lg font-bold">
          Are you sure you want to delete this tweet?
        </span>
        <IoMdTrash className="w-[10rem] h-[10rem] text-red-500" />
        <div className="flex flex-row w-full justify-between px-16">
          <div
            className="btn w-[8rem] text-black bg-white hover:bg-gray-300"
            onClick={() => setShow(false)}
          >
            Cancel
          </div>
          <div
            className={`btn ${
              loadingDelete ? "btn-disabled" : ""
            } w-[8rem] border-none bg-red-500 hover:bg-red-600`}
            onClick={() => deleteTweet(selectedTweet)}
          >
            {loadingDelete ? <ImSpinner2 className="animate-spin" /> : "Delete"}
          </div>
        </div>
      </div>
    </Modal.Body>
  );

  return (
    <>
      <Modal show={show} setShow={setShow}>
        {modalHeader}
        {modalBody}
      </Modal>
    </>
  );
};

export default UpdateTweetModal;
