import "dotenv/config";
import express from "express";
import { Request, Response } from "express";
import logger from "@src/adapters/logger";
import { find } from "@src/services/categoryService";
import productService from "@src/services/productService";

const app = express();

app.get("/categories", async (req: Request, res: Response) => {
  const categories = await find();

  res.json(categories);
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

export default app;
