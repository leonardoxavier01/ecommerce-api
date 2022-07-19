import "dotenv/config";
import express, { NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import logger from "@src/adapters/logger";

import categoryService from "@src/services/categoryService";
import productService from "@src/services/productService";

const SECRET = process.env.JWT_SECRET;
const app = express();
app.use(express.json());

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (authorization) {
    const [_, token] = authorization.split(" ");

    try {
      const payload = jwt.verify(token, `${SECRET}`);
      return next();
    } catch (err) {
      res.status(401);
      return res.json({ error: "invalid token" });
    }
  }
  res.status(400);
  res.json({ error: "missing authorization header" });
};

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

app.post(
  "/admin/categories",
  authenticate,
  async (req: Request, res: Response) => {
    const { name } = req.body;

    try {
      const category = await categoryService.create(name);
      res.json({ category });
    } catch (error) {
      res.status(400);
      res.json({ error: "Invalid name" });
    }
  }
);

app.delete(
  "/admin/categories/:categoryId",
  authenticate,
  async (req: Request, res: Response) => {
    const { categoryId } = req.params;

    try {
      const category = await categoryService.deleteOne(categoryId);
      res.json({ category });
    } catch (err) {
      res.json({ error: "category id not found" });
    }
  }
);

app.put(
  "/admin/categories/:categoryId",
  authenticate,
  async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    const { name } = req.body;

    const category = await categoryService.updateOne(categoryId, name);

    res.json({ category });
  }
);

app.put(
  "/admin/products/:productId",
  authenticate,
  async (req: Request, res: Response) => {
    const { productId } = req.params;
    const { price, description, name } = req.body;

    const product = await productService.updateOne(productId, {
      price,
      description,
      name
    });

    res.json({ product });
  }
);

export default app;
