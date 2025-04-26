"use client";

import React, { useState } from "react";
import StylingHeader from "./StylingHeader";

export default function OpacityStyling({
  onChangeValue,
  value,
}: {
  onChangeValue: any;
  value: string;
}) {
  const [isFull, setIsFull] = useState(true);
  return (
    <div
      className={
        "styling__main " +
        (isFull ? "styling__main__full" : "styling__main__small")
      }
    >
      <StylingHeader text="Opacity" isFull={isFull} setIsFull={setIsFull} />
      <div className="styling__body flex flex-col h-[100px] items-center justify-center gap-5">
        <input
          type="range"
          id="progress-bar"
          className="progress-bar"
          min={0}
          max={100}
          value={parseInt(value, 10)}
          onChange={(e) => onChangeValue(parseInt(e.target.value))}
        />
        <p className="text-[11px] h-[30px] w-fit px-[20px] border border-white/40 flex items-center rounded-b-md">
          {value}
        </p>
      </div>
    </div>
  );
}
