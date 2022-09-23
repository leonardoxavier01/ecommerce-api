export interface TypeItemForStripe {
  price_data: {
    currency: string;
    product_data: {
      name: string | undefined;
    };
    unit_amount: number | undefined;
  };
  quantity: number | undefined;
}
