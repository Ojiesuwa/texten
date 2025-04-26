"use client";

import { Cue } from "@/types/CueInterface";
import axios from "axios";

export const formatSubtitle = (subtitle: Cue[]): Cue[] => {
  const formattedSubtitle = subtitle.map((data, index, originalSubtitle) => {
    if (index === 0) {
      return {
        ...data,
        start:
          originalSubtitle[index].start === undefined
            ? 0
            : originalSubtitle[index].start,
      };
    }

    return {
      ...data,
      start: originalSubtitle[index - 1].end,
    };
  });

  return formattedSubtitle;
};
interface Styling {
  fontSize: string;
  [key: string]: any;
}

export const parseStylingObject = (
  styling: Styling,
  containerWidth: number,
  viewportWidth: number
): Styling => {
  console.log(viewportWidth, containerWidth);

  console.log(styling);

  const rawFontSize = parseInt(styling.fontSize, 10);
  const rawLeft = parseInt(styling.left, 10);
  const rawTop = parseInt(styling.top, 10);
  console.log(rawFontSize);

  const scaledFontSize = isNaN(rawFontSize)
    ? 0
    : (rawFontSize * containerWidth) / viewportWidth;

  const scaledLeft = isNaN(rawLeft)
    ? 0
    : (rawLeft * containerWidth) / viewportWidth;
  const scaledTop = isNaN(rawTop)
    ? 0
    : (rawTop * containerWidth) / viewportWidth;

  styling.fontSize = scaledFontSize + "px";
  styling.left = scaledLeft + "px";
  styling.top = scaledTop + "px";

  console.log(styling.fontSize);

  return styling;
};

export const deduceScaledValueInPx = (
  valueInPx: string,
  containerWidth: number,
  viewportWidth: number
) => {
  const rawFontSize = parseInt(valueInPx, 10);
  console.log(rawFontSize);

  const scaledFontSize = isNaN(rawFontSize)
    ? 0
    : (rawFontSize * containerWidth) / viewportWidth;

  const scaledValueInPx = scaledFontSize + "px";

  // console.log(styling.fontSize);

  return scaledValueInPx;
};

export const generateSubtitleFromAudioBlob = async (audioBlob: File) => {
  try {
    const formData = new FormData();
    formData.append("file", audioBlob);

    const response = await axios.post("/api/transcript", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(response.data.transcription.words);
    return response.data.transcription.words;
  } catch (error) {
    console.error(error);
    throw new Error();
  }
};

export const processWordsToTranscript = (
  words: { word: string; start: number; end: number }[]
) => {
  const segments: {
    text: string;
    start: number;
    end: number;
  }[] = [];

  let currentSegment: { word: string; start: number; end: number }[] = [];

  for (const word of words) {
    if (currentSegment.length === 0) {
      currentSegment.push(word);
      continue;
    }

    const first = currentSegment[0];
    const last = word;

    const duration = last.end - first.start;
    const wordCount = currentSegment.length + 1;

    if (wordCount <= 12 && duration <= 4) {
      currentSegment.push(word);
    } else {
      // Finalize current segment
      segments.push({
        text: currentSegment.map((w) => w.word).join(" "),
        start: currentSegment[0].start,
        end: currentSegment[currentSegment.length - 1].end,
      });

      // Start a new segment
      currentSegment = [word];
    }
  }

  // Push last segment if any
  if (currentSegment.length > 0) {
    segments.push({
      text: currentSegment.map((w) => w.word).join(" "),
      start: currentSegment[0].start,
      end: currentSegment[currentSegment.length - 1].end,
    });
  }

  // segments[0].start = 0;
  return formatSubtitle(segments);
};
