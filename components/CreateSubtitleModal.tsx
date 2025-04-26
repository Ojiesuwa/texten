"use client";

import { storeDocument, storeFile } from "@/utils/indexDb";
import React, { useState } from "react";
import { toast } from "react-toastify";
import LoadingBar from "./LoadingBar";

export default function CreateSubtitleModal({
  isModalVisible,
  onHide,
}: {
  isModalVisible: boolean;
  onHide: () => void;
}) {
  const [blob, setBlob] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddVideoFile = () => {
    try {
      const a = document.createElement("input");
      a.type = "file";
      a.accept = "video/*";
      a.multiple = false;
      a.click();

      a.addEventListener("change", () => {
        const file = (a as any).files[0];

        if (file.size > 100 * 1024 * 1024) {
          return toast.error("Max size is 100Mb");
        } else {
          setBlob(file);
        }
      });
    } catch (error) {
      console.error(error);
      toast.error("Error adding video");
    }
  };

  const handleCreateSubtitle = async () => {
    try {
      setIsLoading(true);
      // Save blob to index db
      const fileId = await storeFile(blob as File);
      console.log(fileId);

      // create and store metadata
      const metaData = {
        projectName: "My Project __" + Date.now(),
        styling: {
          fontSize: "25px",
          color: "#fff",
        },
        subtitle: [],
        created: Date.now(),
        fileId,
      };

      const projectId = await storeDocument("projects", metaData);

      console.log(projectId);

      // navigate to project with id
      window.location.href = "/projects/" + projectId;
    } catch (error) {
      console.error(error);
      toast.error("Error launching project");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div
      className={`${
        isModalVisible
          ? "modal__background__active"
          : "modal__background__inactive"
      } z-[200]`}
      onClick={onHide}
    >
      <div
        className={`${
          isModalVisible ? "modal__active" : "modal__inactive"
        } flex overflow-hidden flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full h-[60px] flex items-center justify-between px-[20px] accent__background shrink-0">
          <p className="text-[16px] font-bold text-white">
            Create Subtitle Project
          </p>
          <i
            className="fa-light fa-circle-xmark text-[17px] text-white hover:cursor-pointer"
            onClick={onHide}
          ></i>
        </div>
        <div className="h-full px-[20px] flex flex-col items-center justify-center">
          <p className="text-[15px] font-medium mb-2 text-white">
            Drag and drop video file here
          </p>
          {!blob ? (
            <p className="text-red-600 text-[13px] mb-4">
              Maximum File Size is 100Mb
            </p>
          ) : (
            <p className="text-white text-[13px] mb-4 text-center opacity-70">
              {blob.name}
            </p>
          )}

          <div
            className="w-full max-w-[300px] h-[100px] border border-white/50 rounded border-dashed flex justify-center items-center hover:cursor-pointer"
            onClick={handleAddVideoFile}
          >
            <i className="fa-light fa-plus opacity-65 text-white hover:cursor-pointer"></i>
          </div>
        </div>
        <div className="shrink-0 h-fit px-[20px] pb-[20px]">
          <button
            className="w-full"
            onClick={handleCreateSubtitle}
            disabled={!blob}
          >
            Start Subtitling
          </button>
        </div>
      </div>
      <LoadingBar isLoading={isLoading} />
    </div>
  );
}
