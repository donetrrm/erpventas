import { Product } from "src/products/entities/product.entity";

export interface ISaleDetailsProduct {
    quantity: number;
    price: number;
    total: number;
    profit?: number;
    product: Product
}