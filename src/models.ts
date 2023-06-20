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
  id: number;
  musicKeyId: number;
  root: string;
  suffix: string;
  function: string;
  extension: string;
}

export interface MusicKey {
  id: number;
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
