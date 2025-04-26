import React from "react";

export default function StylingHeader({
  text,
  isFull,
  setIsFull,
}: {
  text: string;
  isFull: boolean;
  setIsFull: any;
}) {
  return (
    <div className="styling__header" onClick={() => setIsFull((p: any) => !p)}>
      <p>{text}</p>
      {isFull ? (
        <i className="fa-light fa-chevron-up"></i>
      ) : (
        <i className="fa-light fa-chevron-down"></i>
      )}
    </div>
  );
}
