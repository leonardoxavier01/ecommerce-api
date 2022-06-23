import { createCategory } from "@tests/factories";
import { clearTables } from "@tests/database";

import app from "@src/app";
import request from "supertest";

describe("Categories", () => {
  describe("GET /categories", () => {
    beforeAll(async () => {
      await clearTables()

      await createCategory({ name: "Jogos" });
      await createCategory({ name: "Hardware" });
    });

    afterAll(async () => {
      await clearTables();
    });

    it("returns a list of categories in JSON format", async () => {
      const res = await request(app).get("/categories").expect(200);

      const [category1, category2] = res.body;

      expect(category1.name).toBe("Jogos");
      expect(category2.name).toBe("Hardware");
    });
  });
});
