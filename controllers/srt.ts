export interface Cue {
  start: number; // in seconds
  end: number; // in seconds
  text: string;
}

function formatTime(seconds: number): string {
  const date = new Date(0);
  date.setSeconds(seconds);
  const ms = Math.floor((seconds % 1) * 1000);
  return (
    date.toISOString().substr(11, 8) + "," + ms.toString().padStart(3, "0")
  );
}

export function generateSRT(subtitles: Cue[]): string {
  return subtitles
    .map((cue, index) => {
      const startTime = formatTime(cue.start);
      const endTime = formatTime(cue.end);
      return `${index + 1}\n${startTime} --> ${endTime}\n${cue.text}\n`;
    })
    .join("\n");
}
