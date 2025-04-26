import React from "react";

export default function LoadingBar({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) return null;
  return (
    <div className="w-screen h-[2px] fixed top-0 left-0 bg-black z-[600]">
      <div className="loading__bar"></div>
    </div>
  );
}
