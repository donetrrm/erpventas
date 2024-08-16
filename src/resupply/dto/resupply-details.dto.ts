import { IsUUID, IsNumber, IsString } from 'class-validator';
import { Resupply } from 'src/branches/entities/resupply.entity';

export class ResupplyDetailsDto {
  @IsUUID()
  id: string;

  @IsUUID()
  productId: string;

  @IsString()
  productName: string;

  @IsNumber()
  cost: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  total: number;
}
