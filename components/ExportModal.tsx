import React from "react";

export default function ExportModal({
  isModalVisible,
  onHide,
  onGenerateSrt,
  onGenerateAss,
}: {
  isModalVisible: boolean;
  onHide: () => void;
  onGenerateSrt: any;
  onGenerateAss: any;
}) {
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
          isModalVisible ? "export__modal__active" : "export__modal__inactive"
        } flex overflow-hidden flex-col justify-center px-[20px] gap-2.5 items-center`}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-bold mb-2 text-white">Export</p>
        <div
          className="w-full h-[50px] flex justify-center items-center rounded-full bg-white/20 hover:bg-white/30 hover:cursor-pointer"
          onClick={onGenerateSrt}
        >
          <p className="text-white text-sm font-light">Export SRT File</p>
        </div>
        <div
          className="w-full h-[50px] flex justify-center items-center rounded-full bg-white/20 hover:bg-white/30 hover:cursor-pointer"
          onClick={onGenerateAss}
        >
          <p className="text-white text-sm font-light">Export ASS File</p>
        </div>
      </div>
    </div>
  );
}
