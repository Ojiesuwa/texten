type SubtitleCue = {
  start: number; // in seconds
  end: number; // in seconds
  text: string;
};

type SubtitleStyle = {
  fontSize?: string; // e.g., "24px"
  color?: string; // e.g., "#FF9900"
  fontWeight?: number; // e.g., 200, 400, 700
  letterSpacing?: string; // e.g., "2px"
  opacity?: number; // 0 to 1
  textAlign?: "left" | "center" | "right";
  textPosition?: "top" | "middle" | "bottom"; // NEW
};

export function generateASS(style: SubtitleStyle, cues: SubtitleCue[]): string {
  const cssToASSColor = (hex: string, opacity: number = 1): string => {
    const alpha = Math.round((1 - opacity) * 255)
      .toString(16)
      .padStart(2, "0")
      .toUpperCase();

    const hexColor = hex.replace("#", "").padEnd(6, "0");
    const r = hexColor.slice(0, 2);
    const g = hexColor.slice(2, 4);
    const b = hexColor.slice(4, 6);

    return `&H${alpha}${b}${g}${r}&`;
  };

  const formatTime = (seconds: number): string => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(1, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(Math.floor(seconds % 60)).padStart(2, "0");
    const cs = String(Math.floor((seconds % 1) * 100)).padStart(2, "0");
    return `${hrs}:${mins}:${secs}.${cs}`;
  };

  const fontSize = parseInt(style.fontSize || "24", 10);
  const primaryColor = cssToASSColor(
    style.color || "#FFFFFF",
    style.opacity ?? 1
  );
  const fontWeight = style.fontWeight ?? 400;
  const bold = fontWeight >= 600 ? -1 : 0;
  const spacing = parseFloat(style.letterSpacing || "0");

  const alignmentLookup: Record<string, number> = {
    "top-left": 7,
    "top-center": 8,
    "top-right": 9,
    "middle-left": 4,
    "middle-center": 5,
    "middle-right": 6,
    "bottom-left": 1,
    "bottom-center": 2,
    "bottom-right": 3,
  };

  const vertical = style.textPosition || "bottom";
  const horizontal = style.textAlign || "center";
  const alignmentKey = `${vertical}-${horizontal}`;
  const alignment = alignmentLookup[alignmentKey] || 2; // fallback to bottom-center

  const assHeader = `
[Script Info]
Title: Generated ASS
ScriptType: v4.00+
PlayResX: 1280
PlayResY: 720

[V4+ Styles]
Format: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,BackColour,Bold,Italic,Underline,StrikeOut,ScaleX,ScaleY,Spacing,Angle,BorderStyle,Outline,Shadow,Alignment,MarginL,MarginR,MarginV,Encoding
Style: Default,Arial,${fontSize},${primaryColor},&H000000FF&,&H00000000&,&H00000000&,${bold},0,0,0,100,100,${spacing},0,1,2,1,${alignment},10,10,10,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text`.trim();

  const assDialogues = cues.map(({ start, end, text }) => {
    const safeText = text.replace(/\n/g, "\\N");
    return `Dialogue: 0,${formatTime(start)},${formatTime(
      end
    )},Default,,0,0,0,,${safeText}`;
  });

  return [assHeader, ...assDialogues].join("\n");
}
