import { useState, useEffect } from "react";
import { format } from "date-fns";

import { TweetService } from "../../services/TweetService";

const ScheduledTweetList = (props) => {
  const [scheduledTweets, setScheduledTweets] = useState([]);
  const BASE_URL = process.env.REACT_APP_BE_URL;

  useEffect(() => {
    const getScheduledTweets = async () => {
      const result = await TweetService.getScheduledTweets();
      if (Array.isArray(result?.data)) {
        setScheduledTweets(result?.data);
      }
    };
    getScheduledTweets();
  }, []);

  return (
    <>
      <div className="font-bold">Scheduled Tweets</div>
      <div className="flex flex-col w-full gap-4">
        {scheduledTweets?.map((tweet) => {
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
              </div>
              <div className="flex flex-col gap-2 w-full">
                <span className="font-bold">Poster</span>
                <div className="grid grid-cols-4 w-full justify-between bg-gray-200 p-4 h-full">
                  {tweet?.tweet_poster_image_paths?.map((path, idx) => (
                    <img
                      key={tweet.tweet_id + idx}
                      src={BASE_URL + path}
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
        })}
      </div>
    </>
  );
};

export default ScheduledTweetList;
