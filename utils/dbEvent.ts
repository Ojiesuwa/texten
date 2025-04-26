"use client";

// dbEvents.ts
export const dbEvents = new EventTarget();
export function emitDBChange() {
  dbEvents.dispatchEvent(new Event("dataChanged"));
}
