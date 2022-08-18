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

const SECRET = `${process.env.JWT_SECRET}`;
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "https://boiling-earth-73197.herokuapp.com/",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

app.use(
  "/images",
  expressSharp({
    imageAdapter: new S3Adapter("ecommerce-upload-funkos"),
  })
);

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
  "/admin/categories/:id/products",
  authenticate,
  async (req: Request, res: Response) => {
    const {
      name,
      categoryId,
      price,
      priceWithDiscount,
      description,
      headline,
    } = req.body;

    try {
      const product = await productService.create({
        name,
        categoryId,
        price,
        priceWithDiscount,
        description,
        headline,
      });
      res.json({ product });
    } catch (error) {
      res.status(400);
      res.json({ error: "Invalid name" });
    }
  }
);

app.delete(
  "/admin/products/:productId",
  authenticate,
  async (req: Request, res: Response) => {
    const { productId } = req.params;

    try {
      const product = await productService.deleteOne(productId);
      res.json({ product });
    } catch (err) {
      res.json({ error: "product id not found" });
    }
  }
);

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
    const { price, priceWithDiscount, headline, description, name, image } =
      req.body;

    const product = await productService.updateOne(productId, {
      price,
      priceWithDiscount,
      headline,
      description,
      name,
      image,
    });

    res.json({ product });
  }
);

app.post(
  "/admin/products/upload/sign-url",
  async (req: Request, res: Response) => {
    const contentType = req.body.type;
    const fileName = req.body.name;
    const itemId = req.body.id;

    res.json({
      url: await uploadService.singUrl(contentType, itemId, fileName),
    });
  }
);

app.post("/admin/auth", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    res.json({ auth: false });
    return;
  }

  const validAccounts = {
    "leonardoxavier092@gmail.com": "teste123",
    "wagner@gmail.com": "teste123",
  } as {
    [key: string]: string;
  };

  if (validAccounts[email] === password) {
    const token = jwt.sign({ sub: email }, SECRET, { expiresIn: "1h" });

    res.json({ auth: true, token });
  } else {
    res.status(401);
    res.json({ auth: false });
  }
});

app.get("/admin/me", authenticate, async (_req: Request, res: Response) => {
  res.json({ auth: true });
});

export default app;
