import axiosInstance from "./AxiosInstance";

export const CaptionService = {
  createCaptions,
  getCaptions,
};

async function createCaptions(caption_text) {
  const result = axiosInstance
    .post('/captions', { caption_text }, {})
    .then((res) => res)
    .catch((e) => console.log(e));

  return result;
}

async function getCaptions() {
  const result = axiosInstance
    .get('/captions')
    .then((res) => res)
    .catch((e) => console.log(e));

  return result;
}
