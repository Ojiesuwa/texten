import React from "react";
import loaderImage from "../public/loading.gif";
import Image from "next/image";

export default function Loader({ isVisible }: { isVisible: boolean }) {
  if (!isVisible) return null;
  return (
    <div className="modal__background__active fade">
      <Image
        src={loaderImage}
        alt="/"
        className="w-[50px] h-[50px] object-cover"
      />
    </div>
  );
}
