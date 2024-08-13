import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";
import { ReadProductDto } from "src/products/dto/products.dto";

export class CreateSaleDto{
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Pyament type of sale', example: 'Effective' })
    readonly paymentType: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'JSON of products', example: "[{\"quantity\":\"2\",\"price\":\"200\",\"total\":\"400\", \"product\":\"f47d2e95-590a-4aa2-a504-0a9f407c4c93\"}]"})
    productsString: string;

    @IsNotEmpty()
    @ApiProperty({ description: 'User id', example: 'UUID' })
    readonly userId: string;

    @IsNotEmpty()
    @ApiProperty({ description: 'The branch of user', example: 'UUID' })
    readonly branchId: string;

}

export class UpdateSaleDto extends PartialType(CreateSaleDto) {}

export class ReadSaleDto {
    @ApiProperty({ description: 'Sale id', example: "be6a7849-5563-49d2-893e-cacfe4f56ca2" })
    readonly id: string;

    @ApiProperty({ description: 'Total amount to pay', example: "239.50" })
    readonly total: number;

    @ApiProperty({ description: 'Pyament type of sale', example: 'Effective' })
    readonly paymentType: string;

    @ApiProperty({ description: 'Creation date', example: "2022-05-13T00:35:51.003Z" })
    readonly createAt: Date;
    @ApiProperty({ description: 'Updated date', example: "2022-05-13T00:35:51.003Z" })
    readonly updateAt: Date;
}

export class ReadSaleDetailDto {
    @ApiProperty({ description: 'Purchase order id', example: "be6a7849-5563-49d2-893e-cacfe4f56ca2" })
    id: string;

    @ApiProperty({ description: 'Price of product', example: "239.50" })
    price: number;

    @ApiProperty({ description: 'Quantity of products', example: 5 })
    quantity: number;

    @ApiProperty({ description: 'Total amount to pay', example: "239.50" })
    total: number;

    @ApiProperty({ description: 'Creation date', example: "2022-05-13T00:35:51.003Z" })
    createAt: Date;

    @ApiProperty({ description: 'Updated date', example: "2022-05-13T00:35:51.003Z" })
    updateAt: Date;

    @ApiProperty({ description: 'Deleted date', example: "null" })
    deleteAt: Date;
    
    @ApiProperty({ description: 'Product of purchase order'})
    product: ReadProductDto;
}