import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsUUID, IsNumber } from "class-validator";

export class CreateBranchDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Branch name' })
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Branch description' })
    readonly description: string;
}

export class UpdateBranchDto extends PartialType(CreateBranchDto) {}

export class ReadBranchDto {
    @ApiProperty({ description: 'Id of the Branch', example: "4fd8c642-269e-4deb-bd15-4f56a9259cc7" })
    id: string;
    @ApiProperty({ description: 'name', example: "Proteins" })
    name: string;
    @ApiProperty({ description: 'Branch of center' })
    description: string;
    @ApiProperty({ description: 'Creation date', example: "2022-05-13T00:35:51.003Z" })
    createAt: Date;
    @ApiProperty({ description: 'Updated date', example: "2022-05-13T00:35:51.003Z" })
    updateAt: Date;
}

export class AddProductBranchDto {

    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({ description: 'Product Id' })
    readonly product_id: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'Stock of product' })
    readonly stock: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'Price of product' })
    readonly price: number;

}

export class UpdateProductBranchDto extends PartialType(AddProductBranchDto) {}