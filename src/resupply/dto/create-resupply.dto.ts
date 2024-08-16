import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateResupplyDetailsDto } from './create-resupply-details.dto';

export class CreateResupplyDto {
  @ApiProperty({ example: '8d8a4d26-377d-4e2c-b3fb-7d913f7b03e8' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: '2f6e2d88-6c9b-4b5d-9f36-3f1d4bde47c4' })
  @IsUUID()
  @IsNotEmpty()
  branchId: string;

  @ApiProperty({
    type: [CreateResupplyDetailsDto],
  })
  @ValidateNested({ each: true })
  @Type(() => CreateResupplyDetailsDto)
  products: CreateResupplyDetailsDto[];
}
