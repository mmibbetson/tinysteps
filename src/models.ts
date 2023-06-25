export interface Progression {
  id: number;
  userId: number;
  name: string;
  body: Chord[];
}

export interface User {
  id: number;
  username: string;
  password: string;
}

export interface Chord {
  root: string;
  suffix: string;
  function: string;
  extension: string;
}

export interface MusicKey {
  root: string;
  quality: string;
}

export enum ChordExtension {
  triad,
  seventh,
  ninth,
  eleventh,
  thirteenth,
}

export const roots = [
  "C",
  "C#",
  "Db",
  "D",
  "D#",
  "Eb",
  "E",
  "F",
  "F#",
  "Gb",
  "G",
  "G#",
  "Ab",
  "A",
  "A#",
  "Bb",
  "B",
];

export const extensions = [
  "triad",
  "seventh",
  "ninth",
  "eleventh",
  "thirteenth",
];

export const suffixes = [
  "",
  "m",
  "dim",
  "maj7",
  "m7",
  "7",
  "m7b5",
  "maj9",
  "m9",
  "9",
  "m9b5",
  "maj11",
  "m11",
  "11",
  "m11b5",
  "maj13",
  "m13",
  "13",
  "m13b5",
];
