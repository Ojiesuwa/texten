"use client";
import React, {
  ReactHTMLElement,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import StylingContainer from "./StylingContainer";
import TranscriptContainer from "./TranscriptContainer";
import { Cue } from "@/types/CueInterface";

export default function SubtitleControlContainer({
  subtitle,
  onChangeSubtitle,
  onAddCue,
  timeUpdate,
  setTimeUpdate,
  onDeleteCue,
  setStyling,
  styling,
  onGenerateSubtitle,
  onExport,
}: {
  subtitle: Cue[] | null;
  onChangeSubtitle: any;
  onAddCue: any;
  timeUpdate: any;
  setTimeUpdate: any;
  onDeleteCue: any;
  setStyling: React.Dispatch<SetStateAction<any[]>>;
  styling: any[];
  onGenerateSubtitle: any;
  onExport: any;
}) {
  const [subtitleControl, setSubtitleControl] = useState<
    "styling" | "transcript" | "preset"
  >("transcript");

  const handleControlClick = (e: React.MouseEvent<HTMLParagraphElement>) => {
    const clickedValue = e.currentTarget.dataset.value;
    if (
      !(
        clickedValue === "styling" ||
        clickedValue === "transcript" ||
        clickedValue === "preset"
      )
    )
      return;
    setSubtitleControl(clickedValue ?? "transcript");
  };

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <div className="w-full h-[60px] flex items-center gap-5 px-4 control__header shrink-0 justify-between fade-down">
        <div className="flex items-center gap-5">
          <p
            className={
              "text-white text-[13px] hover:opacity-60 " +
              (subtitleControl === "transcript" && "underline")
            }
            data-value={"transcript"}
            onClick={handleControlClick}
          >
            Transcript
          </p>
          <p
            className={
              "text-white text-[13px] hover:opacity-60 " +
              (subtitleControl === "styling" && "underline")
            }
            data-value={"styling"}
            onClick={handleControlClick}
          >
            Styling
          </p>
          <p
            className={
              "text-white text-[13px] hover:opacity-60 " +
              (subtitleControl === "preset" && "underline")
            }
            data-value={"preset"}
            onClick={handleControlClick}
          >
            Preset
          </p>
        </div>
        <div className="text-white">
          <div
            className="h-[40px] accent__background shrink-0 flex items-center justify-center gap-2 rounded-md px-8 hover:cursor-pointer hover:-translate-y-1"
            onClick={onExport}
          >
            <p className="text-[12px]">Export</p>
            <i className="fa-light fa-file-export text-[13px]"></i>
          </div>
        </div>
      </div>
      <div className="h-full w-full overflow-y-auto flex">
        {subtitleControl === "styling" ? (
          <StylingContainer setStyling={setStyling} styling={styling} />
        ) : subtitleControl === "transcript" ? (
          <TranscriptContainer
            subtitle={subtitle}
            onChangeSubtitle={onChangeSubtitle}
            onAddCue={onAddCue}
            timeUpdate={timeUpdate}
            setTimeUpdate={setTimeUpdate}
            onDeleteCue={onDeleteCue}
            onGenerateSubtitle={onGenerateSubtitle}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
