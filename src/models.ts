export interface Progression {
  id: number;
  userId: number;
  name: string;
  body: string;
}

export interface User {
  id: number;
  username: string;
  password: string;
}

export interface Chord {
  id: number;
  musicKeyId: number;
}

export interface MusicKey {
  id: number;
  root: string;
  quality: string;
}
