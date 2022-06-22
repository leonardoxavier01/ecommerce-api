import { database } from "@src/adapters/database";

interface CategoryInput {
  name: string;
}

export const createCategory = async (params: CategoryInput) => {
  const { name } = params;
  const data = { name };

  return database.category.create({ data });
};

interface ProductInput {
  name: string;
  categoryId: string;
}

export const createProduct = async (params: ProductInput) => {
  const { name, categoryId } = params;
  const data = { name, categoryId };
  return database.product.create({ data });
};
