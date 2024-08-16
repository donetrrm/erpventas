import { IsUUID, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ResupplyDetailsDto } from './resupply-details.dto';

export class ResupplyDto {
  @IsUUID()
  id: string;

  @IsUUID()
  userId: string;

  @IsString()
  userName: string;

  @IsUUID()
  branchId: string;

  @IsString()
  branchName: string;

  @IsNumber()
  totalCost: number;

  @IsNumber()
  productQuantity: number;

  @ValidateNested({ each: true })
  @Type(() => ResupplyDetailsDto)
  products: ResupplyDetailsDto[];
}
