import { createCategory, createProduct } from "@tests/factories";
import { clearTables } from "@tests/database";
import { Prisma } from "@prisma/client";

import app from "@src/app";
import request from "supertest";

type Product = Prisma.ProductGetPayload<{}>;

describe("Products", () => {
  describe.only("GET /categories/:id/products", () => {
    let product1: Product;
    let product2: Product;
    beforeAll(async () => {
      await clearTables();

      const category = await createCategory({ name: "Perifericos" });
      product1 = await createProduct({
        name: "Mouse",
        categoryId: category.id,
      });
      product2 = await createProduct({
        name: "Teclado",
        categoryId: category.id,
      });
    });

    afterAll(async () => {
      await clearTables();
    });

    it(" return a list of products from that category", async () => {
      const client = request(app);
      const res = await client.get("/categories/:id/products").expect(200);

      const [item1, item2] = res.body;

      expect(product1.name).toBe("Mouse");
      expect(product2.name).toBe("Teclado");
    });
  });
  describe("GET /products/:id", () => {
    let product1;

    beforeAll(async () => {
      await clearTables();
      const category = await createCategory({ name: "Perifericos" });
      product1 = createProduct({ name: "Mouse", categoryId: category.id });
    });

    afterAll(async () => {
      await clearTables();
    });

    it(" return a single product based on that id", async () => {
      const client = request(app);

      const res = await client.get("/products/:id").expect(200);

      const item = res.body;
      expect(item.name).toBe("Mouse");
    });
  });
});
