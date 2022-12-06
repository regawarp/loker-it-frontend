import { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import { ToastContainer, toast } from "react-toastify";
import { CaptionService } from "../../services/CaptionService";

const Caption = (props) => {
  const [captions, setCaptions] = useState([]);
  const toastId = "add-caption-result";

  const messageSuccess = (message) =>
    toast.success(message, {
      toastId: toastId,
    });

  const messageFailed = (message) =>
    toast.error(message, {
      toastId: toastId,
    });


  useEffect(() => {
    const getCaptions = async () => {
      const result = await CaptionService.getCaptions();
      if (Array.isArray(result?.data)) {
        setCaptions(result?.data);
      }
    };
    getCaptions();
  }, []);

  const addCaptionFormik = useFormik({
    enableReinitialize: true,
    initialValues: { caption_text: '' },
    onSubmit: async (values) => {
      const result = await CaptionService.createCaptions(values.caption_text);
      if (result?.data === "success!") {
        messageSuccess(result?.data);
      } else {
        messageFailed(result?.data);
      }
      addCaptionFormik.resetForm();
    }
  })

  const addCaptionForm = <form onSubmit={addCaptionFormik.handleSubmit}>
    <div className="form-control">
      <label className="label font-bold">
        Input Caption Template :
      </label>
      <textarea
        name="caption_text"
        placeholder="Enter new caption"
        value={addCaptionFormik.values.caption_text}
        onChange={addCaptionFormik.handleChange}
        className="textarea textarea-bordered h-24"
      />
      <div className="flex mt-2">
        <div className="w-4/5 text-sm">
          Keterangan : <br />
          Gunakan [Nama Perusahaan] dan [Pekerjaan] pada template
        </div>
        <div className="w-1/5">
          <button type="submit"
            className="btn rounded w-full mt-3 min-h-0 h-10"
          >
            Add caption
          </button>
        </div>
      </div>
    </div>
  </form>

  const addCaptionBox = <div
    className="border-2 border-solid border-gray-500 rounded h-[45%] p-10 flex items-center justify-center"
  >
    <div className="w-full">
      {addCaptionForm}
    </div>
  </div>

  const viewCaptionsBox = <div
    className="border-2 border-solid border-gray-500 rounded h-[55%] overflow-y-scroll"
  >
    {captions.map((caption, index) => {
      return (
        <div key={caption.caption_id}
          className="border-2 border-solid rounded border-gray-500 p-3 m-3 cursor-pointer hover:scale-[1.01]"
        >
          {caption.caption_text}
        </div>
      );
    })}
  </div>

  return (
    <>
      <ToastContainer />
      <div className="h-screen w-screen p-3 flex flex-col gap-3">
        {addCaptionBox}
        {viewCaptionsBox}
      </div>
    </>
  );
};

export default Caption;
