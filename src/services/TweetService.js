import axiosInstance from "./AxiosInstance";

export const TweetService = {
  scheduleTweet,
  postTweet,
};

async function scheduleTweet(startDate, endDate) {
  const result = await axiosInstance
    .post(
      "/schedule-tweet",
      {
        startDate: startDate,
        endDate: endDate,
      },
      {}
    )
    .then((res) => res)
    .catch((e) => {
      console.log(e);
      return e;
    });

  return result;
}

async function postTweet(caption, images) {
  const result = axiosInstance
    .post('/tweets', { caption, images }, {})
    .then((res) => res)
    .catch((e) => console.log(e));

  return result;
}