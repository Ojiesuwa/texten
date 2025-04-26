import React, { useEffect, useRef, useState } from "react";
import TranscriptItem from "./TranscriptItem";
import { Cue } from "@/types/CueInterface";
import axios from "axios";
import { extractAudioAsMp3FromVideo } from "@/controllers/ffmpeg";
import { toast } from "react-toastify";

export default function TranscriptContainer({
  subtitle,
  onChangeSubtitle,
  onAddCue,
  timeUpdate,
  setTimeUpdate,
  onDeleteCue,
  onGenerateSubtitle,
}: {
  subtitle: Cue[] | null;
  onChangeSubtitle: any;
  onAddCue: any;
  timeUpdate: any;
  setTimeUpdate: any;
  onDeleteCue: any;
  onGenerateSubtitle: any;
}) {
  console.log();

  const [selected, setSelected] = useState<number | null>(0);
  const divRef = useRef<HTMLDivElement>(null);
  const [timeUpdateLocal, setTimeUpdateLocal] = useState(0);

  const canAddSubtitle = !subtitle?.some(
    (cue) => cue.start <= timeUpdate && cue.end >= timeUpdate
  );

  const handleAddCue = () => {
    onAddCue();
    const newIndex = subtitle?.length ?? 0;
    setTimeout(() => {
      if (divRef.current) {
        divRef.current.scrollTop = divRef.current.scrollHeight + 10;
        setSelected(newIndex);
      }
    }, 100);
  };

 
  useEffect(() => {
    setTimeUpdateLocal(timeUpdate);
  }, [timeUpdate]);

  return (
    <div
      className="w-full h-full px-4 flex flex-col gap-2 fade "
      onClick={() => setSelected(null)}
    >
      <div
        className="w-full h-full flex flex-col gap-2 overflow-y-auto  pb-[20px] "
        ref={divRef}
      >
        {subtitle?.map((cue: Cue, index, subtitle: Cue[]) => (
          <TranscriptItem
            key={index}
            cue={cue}
            isSelected={cue.start <= timeUpdate && cue.end > timeUpdate}
            onClick={() => {
              // if (selected === index) return setSelected(null);
              setTimeUpdate(cue.start);
            }}
            onChangeCue={(value: string) => onChangeSubtitle(value, index)}
            isLastItem={subtitle.length - 1 === index}
            onDeleteCue={onDeleteCue}
          />
        ))}
      </div>
      <div className="w-full h-[50px] shrink-0 flex items-center justify-between pb-2">
        {canAddSubtitle ? (
          <div
            className="flex border border-white rounded-md w-fit px-5 gap-2 h-[40px] items-center cursor-pointer opacity-80 hover:opacity-100"
            onClick={handleAddCue}
          >
            {" "}
            <p className="text-white text-[12px]">Add Subtitle</p>
            <i className="fa-light fa-plus text-white text-[12px]"></i>
          </div>
        ) : (
          <div className="flex border border-white rounded-md w-fit px-5 gap-2 h-[40px] items-center cursor-pointer opacity-50">
            <p className="text-white text-[12px]">Add Subtitle</p>
            <i className="fa-light fa-plus text-white text-[12px]"></i>
          </div>
        )}

        <div
          className="w-fit flex items-center gap-2 h-[40px] specialButton"
          onClick={onGenerateSubtitle}
        >
          <p className="text-[12px]">Generate with AI</p>
          <i className="fa-light fa-sparkles text-[13px]"></i>
        </div>
      </div>
    </div>
  );
}
