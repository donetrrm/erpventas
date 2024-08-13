import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsJSON,
    IsUUID,
    IsString,
    IsNumber,
    IsOptional,
    IsPositive,
    Min,
} from 'class-validator';
import { Category } from '../entities/category.entity';
import { ReadCategoryDto } from './categories.dto';

export class CreateProductDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Product name' })
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Product SKU' })
    readonly sku: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'Stock of product' })
    readonly stock: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'Price of product' })
    readonly price: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'Cost', example: 200 })
    readonly cost: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'URL of image' })
    readonly image: string;

    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({ description: 'Category Id' })
    readonly category_id: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) { }

export class ReadProductDto {

    @ApiProperty({ description: 'Id of the product', example: "4fd8c642-269e-4deb-bd15-4f56a9259cc7" })
    id: string;
    @ApiProperty({ description: 'name', example: "Whey Protein" })
    name: string;
    @ApiProperty({ description: 'SKU', example: "prt" })
    sku: string;
    @ApiProperty({ description: 'Stock', example: 100 })
    stock: number;
    @ApiProperty({ description: 'Price', example: 200 })
    price: number;
    @ApiProperty({ description: 'Cost', example: 200 })
    cost: number;
    @ApiProperty({ description: 'Image of product', example: "URLIMAGE" })
    image: string;
    @ApiProperty({ description: 'Creation date', example: "2022-05-13T00:35:51.003Z" })
    createAt: Date;
    @ApiProperty({ description: 'Updated date', example: "2022-05-13T00:35:51.003Z" })
    updateAt: Date;
    @ApiProperty({ description: 'Category of product', example: Category })
    category: ReadCategoryDto;

}


export class ResponseFilterProducts {
    @ApiProperty({ description: "Data of products", type: [ReadProductDto] })
    data: [ReadProductDto];
    @ApiProperty({ description: 'Total filtered products found', example: 12 })
    count: number
}

export class FilterProducts {
    @IsOptional()
    @IsPositive()
    @ApiProperty({ description: "Limit of products", type: Number, example: 1 })
    limit: number;

    @IsOptional()
    @Min(0)
    @ApiProperty({ description: "Page", type: Number, example: 1 })
    offset: number;

    @IsOptional()
    @IsUUID()
    @ApiProperty({ description: "Category of products", type: String, example: "4fd8c642-269e-4deb-bd15-4f56a9259cc7" })
    categoryId: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: "Name of product to filter", type: String, example: "Gold whey" })
    product_name: string

    @IsOptional()
    @Min(0)
    @ApiProperty({ description: "Minimum stock", type: Number, example: 1 })
    stock: number;
}
