"use client";

import React, { useEffect, useRef, useState } from "react";
import SubtitleControlContainer from "@/components/SubtitleControlContainer";
import VideoController from "@/components/VideoController";
import { Cue } from "@/types/CueInterface";
import {
  deduceScaledValueInPx,
  formatSubtitle,
  generateSubtitleFromAudioBlob,
  parseStylingObject,
  processWordsToTranscript,
} from "@/utils/subtitle";
import { useResponsiveDimensions } from "@/hooks/useResponsiveDimensions";
import Loader from "@/components/Loader";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import {
  fetchFileById,
  getDocumentById,
  updateDocument,
} from "@/utils/indexDb";
import {
  burnAndDownloadWithSubtitles,
  extractAudioAsMp3FromVideo,
} from "@/controllers/ffmpeg";
import { generateASS } from "@/controllers/ass";
import ExportModal from "@/components/ExportModal";
import { generateSRT } from "@/controllers/srt";

export default function Page() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const router = useRouter();
  const params = useParams();
  const divRef = useRef<HTMLDivElement | null>(null);
  const [duration, setDuration] = useState<number | undefined>(undefined); // Use number type for duration
  const [timeUpdate, setTimeUpdate] = useState(0);
  const [lastRecoredTime, setLastRecordedTime] = useState<{
    start: any;
    end: any;
  }>({ start: 0, end: 0 });
  const [subtitle, setSubTitle] = useState<Cue[] | null>([
    {
      start: 0,
      end: 3,
      text: "Hi, in this video I am going to go over the basics of using Mira",
    },
    {
      start: 3,
      end: 5,
      text: "Miro is a great digital whiteboard app",
    },
    {
      start: 5,
      end: 8,
      text: "That allows you to run workshops remotely",
    },
    {
      start: 8,
      end: 11,
      text: "And it has everything that you would need like sticky notes",
    },
  ]);
  const [styling, setStyling] = useState<any>(null);
  const [screenWidth, setScreenWidth] = useState(0);
  const [divWidth, setDivWidth] = useState(0);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [videoBlob, setVideoBlob] = useState<File | null>(null);
  const [videoURL, setVideoUrl] = useState("");
  const [project, setProject] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [videoWidth, setVideoWidth] = useState<number>(0);
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  const dragRef = useRef<HTMLParagraphElement | null>(null);
  const offset = useRef({ x: 0, y: 0 });

  useResponsiveDimensions(divRef as any, setDivWidth, setScreenWidth);
  console.log(styling);

  const subtitleDisplay = (subtitle ?? []).find(
    (cue) => cue.start <= timeUpdate && cue.end > timeUpdate
  )?.text;

  const handleTimmeUpdate = () => {
    if (videoRef.current) {
      setTimeUpdate(videoRef.current.currentTime);
    }
  };

  const handleChangeSubtitle = (value: string, index: number) => {
    const recentSubtitle = [...(subtitle as any)];
    recentSubtitle[index] = { ...recentSubtitle[index], text: value };

    console.log(recentSubtitle);

    setSubTitle(recentSubtitle);
  };

  // const handleOnPlay = () => {};

  // const handleOnPause = () => {};

  const handleAddCue = () => {
    const recentSubtitle = [...(subtitle as any)];
    recentSubtitle.push({ ...lastRecoredTime, text: "" });
    setLastRecordedTime({ start: 0, end: null });
    let formattedSubtitle = formatSubtitle(recentSubtitle);
    setSubTitle(formattedSubtitle);
  };

  const handleTimeChangeFromSubtitle = (timeStamp: number) => {
    if (!videoRef.current) return;
    setTimeUpdate(timeStamp);
    videoRef.current.currentTime = timeStamp;
  };

  const handleDeleteCue = () => {
    const recentSubtitle = [...(subtitle as any)];
    recentSubtitle.pop();
    setSubTitle(recentSubtitle);
  };

  const handleInitiateProject = async () => {
    try {
      const project = await getDocumentById(
        "projects",
        params?.projectId as string
      );
      console.log(project);

      const file = await fetchFileById(project.fileId);
      console.log(file);

      setVideoBlob(file as any);
      setStyling(project.styling);
      setProject(project);
      setSubTitle(project.subtitle);
      setVideoUrl(URL.createObjectURL(file as any));
    } catch (error) {
      console.error(error);
      toast.error("Error initiating project");
      router.push("/");
    } finally {
      setTimeout(() => {
        setIsLoadingData(false);
      }, 1500);
    }
  };

  const handleGenerateSubtitle = async () => {
    try {
      setIsLoadingData(true);
      if (!videoBlob) return;
      const audioBlob = await extractAudioAsMp3FromVideo(videoBlob);
      const response: any = await generateSubtitleFromAudioBlob(
        audioBlob as File
      );

      console.log(response);

      const transcript = processWordsToTranscript(response);
      console.log(transcript);

      setSubTitle(transcript);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);

    offset.current = {
      x: e.clientX - (parseInt(styling.left, 10) || 100),
      y: e.clientY - (parseInt(styling.top, 10) || 100),
    };
    console.log(offset.current);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const newX = e.clientX - offset.current.x;
    const newY = e.clientY - offset.current.y;

    setStyling((p: any) => ({
      ...p,
      left: String(newX) + "px",
      top: String(newY) + "px",
    }));

    console.log("trying to move", newX, newY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleExportVideo = async () => {
    try {
      // console.log("Callaed");

      // const assFile = generateASS(styling as any, subtitle as any);

      // console.log(assFile);

      // burnAndDownloadWithSubtitles(videoBlob as File, assFile, "second");
      setIsExportModalVisible(true);
    } catch (error) {
      console.error(error);
      toast.error("Error exporting video");
    }
  };

  const handleGenerateAss = () => {
    const assText = generateASS(styling as any, subtitle as any);
    const blob = new Blob([assText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = videoBlob?.name.split(".")[0] + ".ass";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleGenerateSrt = () => {
    const srtText = generateSRT(subtitle as any);

    const blob = new Blob([srtText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = videoBlob?.name.split(".")[0] + ".srt";
    a.click();
    URL.revokeObjectURL(url);
    console.log(srtText);
  };

  useEffect(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  }, []);

  // Add and remove event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    handleInitiateProject();
  }, []);

  useEffect(() => {
    if (isLoadingData) return;
    updateDocument("projects", params.projectId as string, {
      styling: { ...styling },
    })
      .then((data) => console.log("Sucessfully saved"))
      .catch((error) => {
        console.log(error);
        toast.error("Error saving style");
      });
  }, [styling]);

  useEffect(() => {
    if (isLoadingData) return;
    updateDocument("projects", params.projectId as string, {
      subtitle: [...(subtitle as any)],
    })
      .then((data) => console.log("Sucessfully saved"))
      .catch((error) => {
        console.log(error);
        toast.error("Error saving subtitle");
      });
  }, [subtitle]);

  return (
    <div className="page flex gap-[30px] px-[30px] py-[20px] overflow-hidden">
      <div className="w-full h-full flex flex-col overflow-hidden gap-4 fade justify-between text-white">
        <div className="w-full text-white relative h-full overflow-hidden flex justify-center">
          <div className="relative h-full  " ref={divRef}>
            {videoBlob && (
              <video
                src={videoURL}
                className="max-h-full"
                ref={videoRef}
                onTimeUpdate={handleTimmeUpdate}
                onPlay={(e) =>
                  setLastRecordedTime((p) => ({
                    ...p,
                    start: videoRef.current?.currentTime as any,
                  }))
                }
                onPause={(e) =>
                  setLastRecordedTime((p) => ({
                    ...p,
                    end: videoRef.current?.currentTime as any,
                  }))
                }
                onLoadedMetadata={(e) => {
                  setDuration(e.currentTarget.duration);
                  setVideoWidth(e.currentTarget.videoWidth);
                }}
              />
            )}
            <p
              // draggable={true}
              ref={dragRef}
              onMouseDown={handleMouseDown}
              className={`text-[13px]   subtitle__text absolute text-center select-none `}
              style={{
                ...parseStylingObject({ ...styling }, divWidth, videoWidth),
                width: deduceScaledValueInPx("600px", divWidth, videoWidth),
                cursor: isDragging ? "grabbing" : "grab",
              }}
            >
              {subtitleDisplay ? subtitleDisplay : ""}
            </p>
          </div>
        </div>
        <VideoController
          videoRef={videoRef}
          duration={duration}
          timeUpdate={timeUpdate}
          setTimeUpdate={setTimeUpdate}
        />
      </div>
      <div className="w-[500px] h-full shrink-0 border border-white/60 rounded-xl accent__outline flex overflow-hidden">
        <SubtitleControlContainer
          subtitle={subtitle}
          onChangeSubtitle={handleChangeSubtitle}
          onAddCue={handleAddCue}
          timeUpdate={timeUpdate}
          setTimeUpdate={handleTimeChangeFromSubtitle}
          onDeleteCue={handleDeleteCue}
          setStyling={setStyling}
          styling={styling}
          onGenerateSubtitle={handleGenerateSubtitle}
          onExport={handleExportVideo}
        />
      </div>
      <Loader isVisible={isLoadingData} />
      <ExportModal
        isModalVisible={isExportModalVisible}
        onHide={() => setIsExportModalVisible(false)}
        onGenerateAss={handleGenerateAss}
        onGenerateSrt={handleGenerateSrt}
      />
    </div>
  );
}
