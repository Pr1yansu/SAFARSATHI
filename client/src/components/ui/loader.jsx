import * as animationData from "../animation/loader.json";
import Lottie from "react-lottie";

const Loader = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData.default,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid",
    },
  };

  return (
    <div className="fixed z-[9999] top-0 left-0 right-0 bottom-0 bg-white pointer-events-none">
      <Lottie options={defaultOptions} />
    </div>
  );
};

export default Loader;
