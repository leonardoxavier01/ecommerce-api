import express from "express";
import { Request, Response } from "express";

const app = express();

app.get("/categories", (req: Request, res: Response) => {
  res.json([
    {
      id: 1,
      name: "Jogos",
    },
  ]);
});

export default app;
