import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePromotionSaleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Pyament type of sale', example: 'Effective' })
  readonly paymentType: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Promotion id', example: 'UUID' })
  readonly promotionId: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'User id', example: 'UUID' })
  readonly userId: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'The branch of user', example: 'UUID' })
  readonly branchId: string;
}

export class UpdatePromotionSaleDto extends PartialType(
  CreatePromotionSaleDto,
) {}
