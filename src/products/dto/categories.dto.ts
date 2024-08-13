import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Category name' })
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Category description' })
    readonly description: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) { }

export class ReadCategoryDto {
    @ApiProperty({ description: 'Id of the category', example: "4fd8c642-269e-4deb-bd15-4f56a9259cc7" })
    id: string;
    @ApiProperty({ description: 'name', example: "Proteins" })
    name: string;
    @ApiProperty({ description: 'Category of proteins' })
    description: string;
    @ApiProperty({ description: 'Creation date', example: "2022-05-13T00:35:51.003Z" })
    createAt: Date;
    @ApiProperty({ description: 'Updated date', example: "2022-05-13T00:35:51.003Z" })
    updateAt: Date;
}

export class FilterCategory {
    @IsOptional()
    @IsUUID()
    @ApiProperty({ description: "Category of products", type: String, example: "4fd8c642-269e-4deb-bd15-4f56a9259cc7" })
    categoryId: string;
}
