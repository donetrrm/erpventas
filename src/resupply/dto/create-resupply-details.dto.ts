import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateResupplyDetailsDto {
  @ApiProperty({ example: '3d5f7b6b-ef8d-4a85-8e0d-f4c6c7ed5eaf' })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
