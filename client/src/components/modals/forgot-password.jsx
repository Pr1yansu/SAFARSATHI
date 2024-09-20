import React from "react";
import useModal from "../hooks/modal";
import { BiArrowBack, BiX } from "react-icons/bi";
import Button from "../ui/button";
import Input from "../ui/input";
import Separator from "../ui/separator";
import { useForgotPasswordMutation } from "../../store/apis/user";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const { isOpen, variant, close, open } = useModal();
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [duration, setDuration] = React.useState(0);
  const [timer, setTimer] = React.useState(null);
  const [forgotPassword] = useForgotPasswordMutation();

  const startTimer = (ms) => {
    let timeRemaining = ms;
    setTimer(timeRemaining);

    const countdown = setInterval(() => {
      timeRemaining -= 1000;
      setTimer(timeRemaining);

      if (timeRemaining <= 0) {
        clearInterval(countdown);
        setTimer(null);
      }
    }, 1000);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();
    try {
      if (!email || email.length < 1) {
        toast.error("Email is required");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        toast.error("Invalid email");
        return;
      }

      setLoading(true);

      const { data, error } = await forgotPassword(email);

      if (error) {
        toast.error(error);
        return;
      }

      if (data) {
        toast.success(data.message);
        setDuration(data.duration);
        startTimer(data.duration); // Start the timer
      }
    } catch (error) {
      toast.error("Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || variant !== "forgotPassword") {
    return null;
  }

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onMouseDown={close}
    >
      <div
        className="bg-white p-4 relative rounded-lg w-96"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h1 className="text-2xl font-bold text-center">Forgot Password</h1>
        <Separator className={"my-4"} />
        <form className="flex flex-col gap-4 mt-4" onSubmit={onSubmit}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="submit"
            className={"rounded-md"}
            size="sm"
            disabled={loading || timer}
          >
            {loading
              ? "Sending..."
              : timer
              ? `Resend in ${formatTime(timer)}`
              : "Send Reset Link"}
          </Button>
        </form>
        <p
          className={
            "gap-2 justify-center w-full mt-4 hover:underline flex text-sm cursor-pointer items-center text-gray-600 font-semibold"
          }
          onClick={() => open("login")}
        >
          <BiArrowBack /> Go back to login
        </p>
        <Button
          size="icon"
          onClick={close}
          intent="ghost"
          className={"absolute top-2 right-2"}
          disabled={loading}
        >
          <BiX size={24} />
        </Button>
      </div>
    </div>
  );
};

export default ForgotPassword;
