import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsDate } from 'class-validator';

export class FilterByDatesAndBranchDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'BranchId' })
  branchId: string;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({ description: 'Start date', example: '2023-11-22' })
  start: Date;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({ description: 'End date', example: '2023-11-22' })
  end: Date;
}
