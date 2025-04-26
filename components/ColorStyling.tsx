"use client";

import React, { useState } from "react";
import StylingHeader from "./StylingHeader";

export default function ColorStyling({
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
      <StylingHeader text="Color" isFull={isFull} setIsFull={setIsFull} />
      <div className="styling__body flex flex-col h-[100px] items-center gap-5 scroll__hidden">
        <div className="flex w-full justify-between">
          <div
            className="color__box"
            onClick={() => onChangeValue("#000000")}
          ></div>
          <div
            className="color__box bg-red-600"
            onClick={() => onChangeValue("#FF0000")}
          ></div>
          <div
            className="color__box bg-green-600"
            onClick={() => onChangeValue("#00FF00")}
          ></div>
          <div
            className="color__box bg-blue-600"
            onClick={() => onChangeValue("#0000FF")}
          ></div>
          <div
            className="color__box bg-amber-300"
            onClick={() => onChangeValue("#FCD34D")}
          ></div>
          <div
            className="color__box bg-purple-600"
            onClick={() => onChangeValue("#800080")}
          ></div>
          <div
            className="color__box bg-white"
            onClick={() => onChangeValue("#FFFFFF")}
          ></div>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-[13px] font-light">Hexcode:</p>
          <input
            type="text"
            placeholder="#ffffff"
            value={value}
            onChange={(e) => {
              let colorCode = e.target.value;
              if (colorCode[0] !== "#") {
                colorCode = "#" + colorCode;
              }
              onChangeValue(colorCode);
            }}
            onBlur={(e) => {
              if (value === "#") {
                onChangeValue("#ffffff");
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
