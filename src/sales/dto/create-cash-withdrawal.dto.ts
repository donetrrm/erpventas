import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCashWithdrawalDto {
  @ApiProperty({ description: 'Monto a retirar de la caja', example: 500 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    description: 'Concepto del retiro de caja',
    example: 'Compra de suministros',
  })
  @IsString()
  @IsNotEmpty()
  concept: string;

  @ApiProperty({
    description: 'Tipo de retiro de caja',
    example: 'GASTO | PROVEEDORES | OTRO',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'Método de retiro de caja',
    example: 'EFECTIVO | TRANSFERENCIA',
  })
  @IsString()
  @IsNotEmpty()
  withdrawalMethod: string;

  @ApiProperty({
    description: 'ID de la sucursal',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  branchId: string;

  @ApiProperty({
    description: 'ID del usuario que realiza el retiro',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
