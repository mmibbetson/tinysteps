import { Request, Response } from "express";

export function getProgression(req: Request, res: Response): void {
  res.send("Hello world!\n");
}
