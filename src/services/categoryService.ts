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

const create = async (name: string) => {
  return database.category.create({ data: { name } });
};

const deleteOne = async (categoryId: string) => {
  return database.category.delete({ where: { id: categoryId } });
};

const updateOne = async (categoryId: string, name: string) => {
  return database.category.update({
    where: { id: categoryId },
    data: { name },
  });
};

export default { find, findOne, create, deleteOne, updateOne };
