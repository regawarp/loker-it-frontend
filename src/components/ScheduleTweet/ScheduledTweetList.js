import { useState, useEffect } from "react";
import { format } from "date-fns";

import UpdateTweetModal from "./UpdateTweetModal";
import ModalDeleteTweet from "./ModalDeleteTweet";

import { TweetService } from "../../services/TweetService";

const ScheduledTweetList = ({ refresh, setRefresh }) => {
  const [scheduledTweets, setScheduledTweets] = useState([]);
  const BASE_URL = process.env.REACT_APP_BE_URL;

  const [loadingScheduledTweets, setLoadingScheduledTweets] = useState(false);

  const [selectedTweet, setSelectedTweet] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const getScheduledTweets = async () => {
    setLoadingScheduledTweets(true);
    const result = await TweetService.getScheduledTweets();
    if (Array.isArray(result?.data)) {
      setScheduledTweets(result?.data);
    }
    setLoadingScheduledTweets(false);
  };

  useEffect(() => {
    getScheduledTweets();
  }, []);

  useEffect(() => {
    if (refresh) {
      getScheduledTweets();
      setRefresh(false);
    }
  }, [refresh]);

  const scheduledTweetsSkeleton = (
    <div className="flex flex-row gap-4 justify-between">
      <div className="flex flex-col gap-2 w-1/4">
        <span className="font-bold">Schedule</span>
        <div className="w-full h-[12rem] animate-pulse bg-gray-300"></div>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <span className="font-bold">Poster</span>
        <div className="w-full h-[12rem] animate-pulse bg-gray-300"></div>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <span className="font-bold">Caption</span>
        <div className="w-full h-[12rem] animate-pulse bg-gray-300"></div>
      </div>
    </div>
  );

  return (
    <>
      <div className="font-bold">Scheduled Tweets</div>
      <div className="flex flex-col w-full gap-4">
        {loadingScheduledTweets ? (
          <>
            {scheduledTweetsSkeleton}
            {scheduledTweetsSkeleton}
          </>
        ) : scheduledTweets?.length > 0 ? (
          scheduledTweets?.map((tweet) => {
            const date = new Date(tweet?.tweet_scheduled_date);
            return (
              <div
                key={tweet?.tweet_id}
                className="flex flex-row gap-4 justify-between"
              >
                <div className="flex flex-col gap-2 w-1/4">
                  <span className="font-bold">Schedule</span>
                  <span className="bg-gray-200 px-4 text-center">
                    {format(date, "yyyy-MM-dd")}
                  </span>
                  <span className="bg-gray-200 px-4 text-center">
                    {format(date, "HH:mm:ss")}
                  </span>
                  <div
                    className="btn"
                    onClick={() => {
                      setSelectedTweet(tweet);
                      setShowUpdateModal(true);
                    }}
                  >
                    Update
                  </div>
                  <div
                    className="btn"
                    onClick={() => {
                      setSelectedTweet(tweet);
                      setShowDeleteModal(true);
                    }}
                  >
                    Delete
                  </div>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <span className="font-bold">Poster</span>
                  <div className="grid grid-cols-4 w-full justify-between bg-gray-200 p-4 h-full">
                    {tweet?.tweet_posters?.map((poster, idx) => (
                      <img
                        key={tweet.tweet_id + idx}
                        src={BASE_URL + poster?.poster_image_path}
                        alt={tweet.tweet_id + idx}
                        className="w-[10rem] h-[10rem]"
                      />
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <span className="font-bold">Caption</span>
                  <span className="bg-gray-200 p-4 h-full">
                    {tweet?.tweet_caption_text}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <span className="w-full p-4 border border-solid border-gray-300 font-bold text-center">
            No Data
          </span>
        )}
      </div>
      <UpdateTweetModal
        show={showUpdateModal}
        setShow={setShowUpdateModal}
        selectedTweet={selectedTweet}
        setRefreshScheduledTweets={setRefresh}
      />
      <ModalDeleteTweet
        show={showDeleteModal}
        setShow={setShowDeleteModal}
        selectedTweet={selectedTweet}
        setRefreshScheduledTweets={setRefresh}
      />
    </>
  );
};

export default ScheduledTweetList;
