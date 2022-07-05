import { database } from "@src/adapters/database";
import productService, { ProductProps } from "@src/services/productService";

interface CategoryInput {
  name: string;
}

export const createCategory = async (params: CategoryInput) => {
  const { name } = params;
  const data = { name };

  return database.category.create({ data });
};

export const createProduct = async (params: ProductProps) => {
  const { name, categoryId } = params;

  return productService.create({ name, categoryId });
};
