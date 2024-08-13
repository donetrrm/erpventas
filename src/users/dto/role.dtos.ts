import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The name of role' })
  readonly name: string;
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
