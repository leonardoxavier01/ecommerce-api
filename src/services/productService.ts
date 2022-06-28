import { database } from "@src/adapters/database";
import logger from "@src/adapters/logger";

const find = async (categoryId: string) => {
  const category = await database.category.findUnique({
    where: {
      id: categoryId,
    },
    include: { products: true },
  });

  if (category) {
    return category.products;
  }

  return [];
};

const findOne = async (productId: string) => {
  logger.info({ productId });

  const product = await database.product.findUnique({
    where: {
      id: productId,
    },
  });

  return product;
};

export interface ProductProps {
  name: string;
  categoryId: string;
  price?: number;
  priceWidthDiscount?: number;
  description?: string;
  headline?: string;
}

const create = async (props: ProductProps) => {
  const { 
    name, 
    categoryId, 
    price, 
    priceWidthDiscount, 
    description, 
    headline 
  } = props;

  const slug = name.replace('','-').toLowerCase();

  const data = {
    name,
    slug,
    categoryId,
    price,
    priceWidthDiscount,
    description,
    headline,
  };

  return database.product.create({ data });
};

export default { find, findOne, create };
