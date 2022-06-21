import "dotenv/config";
import express from "express";
import { Request, Response } from "express";
import { find } from "@src/services/categoryService";

const app = express();

app.get("/categories", async (req: Request, res: Response) => {
  const categories = await find();

  res.json(categories);
});

app.post("/admin/categories", async (req: Request, res: Response) => {
  console.log(req)

  res.json({})
});

export default app;
