import { database } from "@src/adapters/database";

interface CategoryInput {
  name: string;
}

export const createCategory = async (params: CategoryInput) => {
  const { name } = params;
  const data = { name };

  return database.category.create({ data });
};
