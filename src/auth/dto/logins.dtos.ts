import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ReadUserDto } from 'src/users/dto/users.dtos';

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'Username of user',
    example: 'israel10',
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Password of user',
    example: 'secretPassword123',
  })
  password: string;
}

export class ResponseLoginUserDto {
  @ApiProperty({ description: 'Acces token', example: 'djaskdakds' })
  access_token: string;
  @ApiProperty({ description: 'User data', example: ReadUserDto })
  user: ReadUserDto;
}
