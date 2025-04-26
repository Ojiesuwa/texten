"use client";

import { formatTime } from "@/utils/timeFormat";
import React, { useEffect, useState } from "react";

export default function VideoController({
  videoRef,
  duration,
  timeUpdate,
  setTimeUpdate,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  duration: number | undefined;
  timeUpdate: number | undefined;
  setTimeUpdate: any;
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async () => {
    if (videoRef.current) {
      try {
        await videoRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error(error);
      }
    }
  };
  const handlePause = async () => {
    if (videoRef.current) {
      try {
        videoRef.current.pause();
        setIsPlaying(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    const handleSpacebar = (event: KeyboardEvent) => {
      const active = document.activeElement;
      const isInputFocused =
        active &&
        (active.tagName === "INPUT" ||
          active.tagName === "TEXTAREA" ||
          (active as HTMLElement).isContentEditable);

      if (event.code === "Space" && !isInputFocused) {
        event.preventDefault(); // prevent scrolling
        console.log("Spacebar pressed without input focus!");
        if (isPlaying) {
          handlePause();
        } else {
          handlePlay();
        }
      }
    };

    window.addEventListener("keydown", handleSpacebar);

    return () => {
      window.removeEventListener("keydown", handleSpacebar);
    };
  }, [isPlaying]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeUpdate(parseInt(e.target.value));
    if (videoRef.current) {
      videoRef.current.currentTime = parseInt(e.target.value);
    }
  };
  return (
    <div className="w-full h-fit shrink-0 flex flex-col gap-4 pb-2">
      <div className="w-full flex items-center">
        <p className="text-[13px] font-light pl-1 shrink-0">
          {timeUpdate ? formatTime(timeUpdate) : "00:00"}
        </p>
        <div className="w-full flex justify-center items-center">
          {isPlaying ? (
            <i
              className="fa-solid fa-pause text-[17px] cursor-pointer"
              onClick={handlePause}
            ></i>
          ) : (
            <i
              className="fa-solid fa-play text-[17px] cursor-pointer"
              onClick={handlePlay}
            ></i>
          )}
        </div>
        <p className="text-[13px] font-light pl-1 shrink-0">
          {formatTime(duration)}
        </p>
      </div>
      <div className="flex gap-3 items-center">
        <input
          type="range"
          name=""
          id=""
          className="w-full video__slider"
          min={0}
          max={duration}
          value={timeUpdate}
          step={0.1}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
}
