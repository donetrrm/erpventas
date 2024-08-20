import { IsString, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetSalesCutDto {
  @ApiProperty({
    description: 'Fecha para la cual se desea obtener el reporte',
    example: '2023-08-21',
  })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    description: 'ID de la sucursal para la cual se desea obtener el reporte',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  branchId: string;
}
