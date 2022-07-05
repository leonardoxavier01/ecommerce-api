import { database } from "@src/adapters/database";

export const find = async () => {
  const categories = await database.category.findMany();

  return categories;
};

const findOne = async (categoryId: string) => {
  const category = await database.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  return category;
};

export default { find, findOne };
