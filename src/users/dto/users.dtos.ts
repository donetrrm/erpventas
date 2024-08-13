import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { Role } from '../entities/role.entity';
import { Branch } from 'src/branches/entities/branch.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The name of user', example: 'Israel' })
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The last name of user', example: 'Santiago' })
  readonly surnames: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The username of user', example: 'JISG' })
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The password of user', example: '123456Secret' })
  password: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'The role of user', example: 'UUID' })
  readonly roleId: string;

  @IsOptional()
  @ApiProperty({ description: 'The branch of user', example: 'UUID' })
  readonly branchId: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}


export class ReadUserDto {
  @ApiProperty({ description: 'The name of user' , example: "Jhon"})
  readonly name: string;
  @ApiProperty({ description: 'The surnames of user', example: "Doe"})
  readonly surnames: string;

  @ApiProperty({ description: 'The role of user', example: 'UUID' })
  readonly role: Role;

  @ApiProperty({ description: 'The branch of user', example: 'UUID' })
  readonly branch: Branch;
}
