import React, { SetStateAction } from "react";
import SizeStyling from "./SizeStyling";
import SpacingStyling from "./SpacingStyling";
import WeightStyling from "./WeightStyling";
import ColorStyling from "./ColorStyling";
import WordSpacingStyling from "./WordSpacingStyling";
import OpacityStyling from "./OpacityStyling";
import PositionStyling from "./LeftPostionStyling";

export default function StylingContainer({
  setStyling,
  styling,
}: {
  setStyling: React.Dispatch<SetStateAction<any[]>>;
  styling: any;
}) {
  const handleSizeChange = (sizeInPx: number) => {
    setStyling((p) => ({ ...p, fontSize: `${sizeInPx}px` }));
  };

  const handleSpacingChange = (sizeInPx: number) => {
    setStyling((p) => ({ ...p, letterSpacing: `${sizeInPx}px` }));
  };
  const handleWordSpacingChange = (sizeInPx: number) => {
    setStyling((p) => ({ ...p, wordSpacing: `${sizeInPx}px` }));
  };
  const handleColorChange = (color: string) => {
    setStyling((p) => ({ ...p, color: `${color}` }));
  };
  const handleOpacityChange = (opacity: number) => {
    setStyling((p) => ({ ...p, opacity: `${opacity}%` }));
  };
  const handleWeightChange = (weight: number) => {
    setStyling((p) => ({ ...p, fontWeight: `${weight}` }));
  };
  return (
    <div className="w-full h-full px-4 flex flex-col gap-3 overflow-y-auto scroll__hidden pb-[100px] fade">
      <SizeStyling
        value={styling.fontSize || "20%"}
        onChangeValue={handleSizeChange}
      />
      <ColorStyling
        value={styling.color ?? ""}
        onChangeValue={handleColorChange}
      />
      <SpacingStyling
        value={styling.letterSpacing || "0px"}
        onChangeValue={handleSpacingChange}
      />
      <WordSpacingStyling
        value={styling.wordSpacing || "0px"}
        onChangeValue={handleWordSpacingChange}
      />
      {/* <PositionStyling value="" onChangeValue={() => {}} /> */}
      <OpacityStyling
        value={styling.opacity || "100%"}
        onChangeValue={handleOpacityChange}
      />
      <WeightStyling
        value={styling.fontWeight || "300"}
        onChangeValue={handleWeightChange}
      />
    </div>
  );
}
