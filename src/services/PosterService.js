import axiosInstance from "./AxiosInstance";

export const PosterService = {
  getPosters,
};

async function getPosters() {
  const result = await axiosInstance
    .get("/poster")
    .then((res) => res)
    .catch((e) => console.log(e));

  return result;
}
