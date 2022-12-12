import axiosInstance from "./AxiosInstance";

export const PosterService = {
  getPosters,
  getPostersFromDB,
  downloadPoster,
};

async function getPosters() {
  const result = await axiosInstance
    .get("/poster")
    .then((res) => res)
    .catch((e) => console.log(e));

  return result;
}

async function getPostersFromDB() {
  const result = await axiosInstance
    .get("/poster/db")
    .then((res) => res)
    .catch((e) => console.log(e));

  return result;
}

async function downloadPoster(startDate, endDate) {
  const result = await axiosInstance
    .post(
      "/download-poster",
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
