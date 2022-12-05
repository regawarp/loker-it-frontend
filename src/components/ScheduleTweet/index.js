import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useState } from "react";
import { TweetService } from "../../services/TweetService";

import { ImSpinner2 } from "react-icons/im";

const ScheduleTweet = (props) => {
  const [loadingScheduleTweet, setLoadingScheduleTweet] = useState(false);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const toastId = "schedule-tweet-result";
  const messageSuccess = (message) =>
    toast.success(message, {
      toastId: toastId,
    });

  const messageFailed = (message) =>
    toast.error(message, {
      toastId: toastId,
    });

  const scheduleTweet = async () => {
    if (startDate && endDate) {
      setLoadingScheduleTweet(true);
      const result = await TweetService.scheduleTweet(startDate, endDate);
      if (result?.data === "schedule tweet success") {
        messageSuccess(result?.data);
      } else {
        messageFailed(result?.data || result?.code);
      }
      setLoadingScheduleTweet(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-8 px-6 py-16">
        <div className="flex flex-row gap-4 items-end">
          <div className="w-full flex flex-col gap-2">
            <label className="text-lg font-bold text-[#000000]">
              Start date
            </label>
            <div
              className="flex flex-row items-center rounded-lg px-3 min-h-[48px] 
                w-full text-lg input border-opacity-10 border-[#472F92] focus:outline-none
                border-2 border-solid gap-3"
            >
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  setStartDate(date);
                  if (endDate < date) {
                    setEndDate(date);
                  }
                }}
                className="border-none focus:outline-none w-full"
                placeholderText="dd-mm-yyyy HH:mm"
                dateFormat="dd-MMM-yyyy HH:mm"
                timeFormat="HH:mm"
                showTimeSelect
              />
            </div>
          </div>
          <div className="w-full flex flex-col gap-2">
            <label className="text-lg font-bold text-[#000000]">End date</label>
            <div
              className="flex flex-row items-center rounded-lg px-3 min-h-[48px] 
                w-full text-lg input border-opacity-10 border-[#472F92] focus:outline-none
                border-2 border-solid gap-3"
            >
              <DatePicker
                selected={endDate}
                minDate={startDate}
                onChange={(date) => setEndDate(date)}
                className="border-none focus:outline-none w-full"
                placeholderText="dd-mm-yyyy HH:mm"
                dateFormat="dd-MMM-yyyy HH:mm"
                timeFormat="HH:mm"
                showTimeSelect
              />
            </div>
          </div>
          <div
            className={`${
              loadingScheduleTweet ? "btn-disabled" : ""
            } btn w-[11rem] min-w-[11rem] font-bold`}
            onClick={() => scheduleTweet()}
          >
            {loadingScheduleTweet ? (
              <ImSpinner2 className="animate-spin" />
            ) : (
              "Schedule Tweet"
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default ScheduleTweet;
