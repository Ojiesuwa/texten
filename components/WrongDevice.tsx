"use client";

import React, { useEffect, useState } from "react";

export default function WrongDevice() {
  const [width, setWidth] = useState(1000);

  useEffect(() => {
    setWidth(window.innerWidth);
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  }, []);

  if (width > 900) return null;
  return (
    <div className="fixed w-dvw h-dvh background__color top-0 left-0 flex flex-col gap-2 justify-center items-center z-[1000]">
      <img
        src="/responsive.png"
        alt=""
        className="w-[70px] h-[70px] object-cover"
      />
      <p className="text-white font-bold text-lg text-center">
        Wrong Device detected
      </p>
      <p className="text-white font-light text-sm text-center">
        Due to resource limit, This application only runs on desktop
      </p>
      <p className="text-white font-light text-sm text-center">
        Please switch to your desktop browser. Thank you
      </p>
    </div>
  );
}
