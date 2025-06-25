export const IS_CLIENT = typeof window === "object";

export const IS_SERVER = !IS_CLIENT;

export const FOCUS_TIMER_TDK = {
  title: "DawnLibrary Focus Timer",
  description:
    "Boost focus with DawnLibrary Timer—a free online Pomodoro web app. Customize work/break intervals for studying, coding, or writing. No downloads needed!",
};

export const AUDIO_FILES = {
  "focus-start": "https://assets.yt2pod.one/tick_didi.MP3",
  "focus-end": "https://assets.yt2pod.one/tick_didi.MP3",
  "short-break-start": "https://assets.yt2pod.one/tick_didi.MP3",
  "short-break-end": "https://assets.yt2pod.one/tick_didi.MP3",
};

export const QUADRANT_TITLES = {
  q1: { title: "Important & Urgent", action: "DO" },
  q2: { title: "Important & Not Urgent", action: "SCHEDULE" },
  q3: { title: "Not Important & Urgent", action: "DELEGATE" },
  q4: { title: "Not Important & Not Urgent", action: "DELETE" },
};
