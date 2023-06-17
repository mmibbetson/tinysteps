import { Request, Response } from "express";

export function getProgression(req: Request, res: Response): void {
  res.send("Hello progression!\n");
}

export function getProgressionByID(req: Request, res: Response): void {
  res.send("Hello id-based progression!\n");
}

export function getProgressionByUser(req: Request, res: Response): void {
  res.send("Hello all user progressions!\n");
}

export function postProgression(req: Request, res: Response): void {
  res.send("Hello new progression!\n");
}

export function deleteProgression(req: Request, res: Response): void {
  res.send("Goodbye progression!\n");
}

export function postUser(req: Request, res: Response): void {
  res.send("Hello register!\n");
}

export function patchUser(req: Request, res: Response): void {
  res.send("Hello update!\n");
}

export function deleteUser(req: Request, res: Response): void {
  res.send("Goodbye user!\n");
}
