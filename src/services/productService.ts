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
      slug: productId,
    },
  });

  return product;
};

export interface ProductProps {
  name: string;
  categoryId: string;
  price?: number;
  priceWithDiscount?: number;
  description?: string;
  headline?: string;
}

const toSlug = (name: string) => {
  return name.replace(/\s/g, "-").toLowerCase();
};

const create = async (props: ProductProps) => {
  const { name, categoryId, price, priceWithDiscount, description, headline } =
    props;

  const slug = toSlug(name);

  const data = {
    name,
    slug,
    categoryId,
    price,
    priceWithDiscount,
    description,
    headline,
  };

  return database.product.create({ data });
};

interface ProductUpdateOne {
  price: number;
  priceWithDiscount: number;
  description: string;
  name: string;
  image: string;
}

const updateOne = async (productId: string, values: ProductUpdateOne) => {
  const { price, priceWithDiscount, description, name, image } = values;

  let slug = null;

  if (name != null) {
    slug = toSlug(name);
  }

  return database.product.update({
    where: { id: productId },
    data: {
      name: name != null ? name : undefined,
      slug: slug != null ? slug : undefined,
      price: price != null ? price : undefined,
      priceWithDiscount:
        priceWithDiscount != null ? priceWithDiscount : undefined,
      image: image != null ? image : undefined,
      description: description != null ? description : undefined,
    },
  });
};

const deleteOne = async (productId: string) => {
  return database.product.delete({ where: { id: productId } });
};

export default { find, findOne, create, updateOne, deleteOne };
