import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  await prisma.category.create({
    data: {
      name: "Monitores",
      products: {
        create: [
          {
            name: "Monitor 1",
            price: 100.0,
            priceWithDiscount: 80.0,
            slug: "monitor-1",
          },
        ],
      },
    },
  });

  await prisma.category.create({
    data: {
      name: "Teclados",
      products: {
        create: [
          {
            name: "Teclado 1",
            price: 100.0,
            priceWithDiscount: 80.0,
            slug: "teclado-1",
          },
        ],
      },
    },
  });
};

main().finally(async () => {
  await prisma.$disconnect();
});
