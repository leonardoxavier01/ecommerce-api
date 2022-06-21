import { database } from "@src/adapters/database";

export const find = async () => {
  const categories = await database.category.findMany();

  return categories;
};
