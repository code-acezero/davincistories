import { useState, useEffect, useCallback } from "react";

interface LoadingScreenProps {
  onEnter: () => void;
}

const LoadingScreen = ({ onEnter }: LoadingScreenProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isEntering, setIsEntering] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleEnter = useCallback(() => {
    setIsEntering(true);
    setTimeout(() => onEnter(), 500);
  }, [onEnter]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[10000] flex items-center justify-center" style={{ animation: "bgColorChange 1s infinite alternate" }}>
        <img src="/images/loader.svg" width={55} height={55} alt="loading" />
        <img src="/images/loading-circle.svg" width={70} height={70} alt="" className="absolute" style={{ animation: "rotate360 1.5s linear infinite" }} />
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ animation: "bgColorTransition 5s infinite alternate" }}
    >
      <img
        src="/images/enter.png"
        alt="Enter DaVinci Stories"
        className={`w-[250px] cursor-pointer transition-all duration-500 ${isEntering ? "-translate-y-full opacity-0" : ""}`}
        onClick={handleEnter}
      />
      <p
        className="mt-4 text-base font-bold font-recoleta"
        style={{ animation: "textColorChange 5s infinite alternate" }}
      >
        Use headphones for better Experience
      </p>
    </div>
  );
};

export default LoadingScreen;
