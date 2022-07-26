import "dotenv/config";
import express, { NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import logger from "@src/adapters/logger";
import cors from "cors";

import categoryService from "@src/services/categoryService";
import productService from "@src/services/productService";
import uploadService from "@src/services/uploadService";
import { expressSharp, S3Adapter } from "express-sharp";

const SECRET = process.env.JWT_SECRET;
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(
  '/images',
  expressSharp({
    imageAdapter: new S3Adapter('ecommerce-upload-funkos')
  })
)

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
  "/admin/products/:productId", async (req: Request, res: Response) => {
    const { productId } = req.params;
    const { price, description, name, image } = req.body;

    const product = await productService.updateOne(productId, {
      price,
      description,
      name,
      image
    });

    res.json({ product });
  }
);

app.post(
  "/admin/products/upload/sign-url",
  async (req: Request, res: Response) => {
    const contentType = req.body.type;
    const fileName = req.body.name;
    const itemId = req.body.id

    res.json({ url: await uploadService.singUrl(contentType, itemId, fileName) });
  }
);

export default app;
