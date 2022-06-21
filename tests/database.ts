import { database } from "@src/adapters/database";

export const clearTables = async () => {
  await database.category.deleteMany();
  await database.$disconnect();
}
