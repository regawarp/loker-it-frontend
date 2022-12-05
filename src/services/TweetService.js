import axiosInstance from "./AxiosInstance";

export const TweetService = {
  scheduleTweet,
};

async function scheduleTweet(startDate, endDate) {
  return new Promise((resolve) =>
    setTimeout(resolve, 2000, {
      data: "schedule tweet success",
    })
  );
}
