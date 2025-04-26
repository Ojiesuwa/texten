"use client";

import React, { useState } from "react";
import lottieGif from "../../public/landing.gif";
import Image from "next/image";
import CreateSubtitleModal from "@/components/CreateSubtitleModal";

export default function Create() {
  const [isCreateModalVisible, setIsModalVisible] = useState(false);
  return (
    <div className="page flex flex-col items-center justify-center overflow-hidden">
      <div className="h-full flex flex-col justify-end items-center">
        <p className="text-[100px] font-extrabold text-white">TEXTEN</p>
        <p className="opacity-80 tracking-wider text-[16px] mt-[-15px] text-white">
          Your AI Subtitling Application
        </p>
        <button
          className="mt-8 w-[250px] px-[40px]"
          onClick={() => setIsModalVisible(true)}
        >
          Create Subtitle
        </button>
      </div>

      <div className="shrink-0 mb-[-20px]">
        <Image
          src={lottieGif}
          alt="/"
          className="h-[350px] w-[350px] object-cover"
        />
      </div>
      <CreateSubtitleModal
        isModalVisible={isCreateModalVisible}
        onHide={() => setIsModalVisible(false)}
      />
    </div>
  );
}
