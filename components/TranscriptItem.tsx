import { Cue } from "@/types/CueInterface";
import { formatTime } from "@/utils/timeFormat";
import React, { useEffect, useRef } from "react";

export default function TranscriptItem({
  cue,
  isSelected,
  onClick,
  onChangeCue,
  isLastItem,
  onDeleteCue,
}: {
  isSelected: boolean;
  onClick: any;
  cue: Cue;
  onChangeCue: any;
  isLastItem: boolean;
  onDeleteCue: any;
}) {
  const divRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (isSelected) {
      divRef.current?.scrollIntoView();
    }
  }, [isSelected]);
  return (
    <div
      className={
        "w-full h-fit py-4 px-2 flex gap-5 text-white rounded-md shrink-0 hover:cursor-pointer transition-none no__transition  " +
        (isSelected ? " accent__background__low " : "transcript__item")
      }
      ref={divRef}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
        e.currentTarget.scrollIntoView();
      }}
    >
      <div className="pt-1 flex flex-col items-center gap-2">
        <p className="text-[12px] opacity-60">{formatTime(cue.start)}</p>
        {/* <p className="text-[12px] opacity-60">--</p> */}
        <p className="text-[12px] opacity-60">{formatTime(cue.end)}</p>
      </div>
      <div className="w-full">
        <textarea
          name=""
          id=""
          className={
            "w-full resize-none text-[14px] font-light " +
            (!isSelected && "hover:cursor-pointer")
          }
          value={cue.text}
          onChange={(e) => onChangeCue(e.target.value)}
          placeholder="Enter text here..."
        ></textarea>
      </div>
      <div>
        {" "}
        {isLastItem && (
          <i
            className="fa-light fa-trash hover:cursor-pointer hover:text-purple-400"
            onClick={onDeleteCue}
          ></i>
        )}
      </div>
    </div>
  );
}
