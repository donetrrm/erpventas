import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsUUID,
  IsArray,
  ValidateNested,
  ArrayNotEmpty,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class ProductDetailsDto {
  @ApiProperty({
    description: 'ID of the product',
    example: '003a8dae-2634-4a50-80c5-4cda9fbd3ea4',
  })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    description: 'Quantity of the product in the promotion',
    example: 2,
  })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class CreatePromotionDto {
  @ApiProperty({
    description: 'Name of the promotion',
    example: 'Back to GYM',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'SKU of the promotion',
    example: 'BTGYM-2X1-2024',
  })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({
    description: 'Available stock of the promotion',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @ApiProperty({
    description: 'Price of the promotion',
    example: 999.99,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'Image URL of the promotion',
    example: 'https://example.com/images/promotion.png',
    required: false,
  })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({
    description: 'ID of the category',
    example: '6be6ae26-afd7-49db-bdb2-4f6f4984e8f4',
  })
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({
    description: 'ID of the branch',
    example: '2a799ef8-f8c5-4216-baae-4a829f479368',
  })
  @IsUUID()
  @IsNotEmpty()
  branchId: string;

  @ApiProperty({
    description:
      'List of products with their quantities included in the promotion',
    type: [ProductDetailsDto],
    example: [
      {
        productId: '003a8dae-2634-4a50-80c5-4cda9fbd3ea4',
        quantity: 2,
      },
    ],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProductDetailsDto)
  products: ProductDetailsDto[];
}
