import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import logger from "@src/adapters/logger";
import { find } from "@src/services/categoryService";

import categoryService from "@src/services/categoryService";
import productService from "@src/services/productService";

const SECRET = process.env.JWT_SECRET;
const app = express();

app.get("/categories", async (req: Request, res: Response) => {
  const categories = await categoryService.find();

  res.json(categories);
});

app.get("/categories/:id", async (req: Request, res: Response) => {
  const categoryId = req.params.id;

  const category = await categoryService.findOne(categoryId);

  res.json(category);
});

app.get("/categories/:id/products", async (req: Request, res: Response) => {
  const categoryId = req.params.id;

  logger.info(`category id = ${categoryId}`);

  const products = await productService.find(categoryId);

  res.json(products);
});

app.get("/products/:id", async (req: Request, res: Response) => {
  const productId = req.params.id;

  const product = await productService.findOne(productId);

  res.json(product);
});

app.post("/admin/categories", async (req: Request, res: Response) => {
  console.log(req);

  res.json({});
});

app.post("/admin/me", async (req: Request, res: Response) => {
  const { authorization } = req.headers;

  if (authorization) {
    const [_, token] = authorization.split(" ");

    try {
      const payload = jwt.verify(token, `${SECRET}`);
      res.json({ payload });
    } catch (err) {
      res.status(401);
      res.json({ error: "invalid token" });
    }

    return;
  }
  res.status(400);
  res.json({ error: "missing authorization header" });
});

export default app;
