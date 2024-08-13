import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/users.dtos';
import { UpdateUserDto } from '../dto/users.dtos';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/roles.model';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('jwt')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Method to create an user.' })
  @ApiCreatedResponse({ description: 'User created', type: User })
  create(@Body() payload: CreateUserDto) {
    return this.usersService.create(payload);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Method to get all users' })
  @ApiOkResponse({ description: 'All users', type: [User] })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiParam({
    name: 'id',
    description: 'The id of the user you want to see.',
    type: String,
    example: '2323kjsadjhd3',
  })
  @ApiOperation({ summary: 'Method to get information of an user.' })
  @ApiOkResponse({ description: 'Response an user', type: User })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Method to edit an user.' })
  @ApiParam({
    name: 'id',
    description: 'The id of the user you want to edit.',
    type: String,
    example: '2323kjsadjhd3',
  })
  // @ApiBody({required: false, type: UpdateCaseDto})
  @ApiOkResponse({ description: 'Response the user edited', type: User })
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiParam({
    name: 'id',
    description: 'The id of the user you want to delete.',
    type: String,
    example: '2323kjsadjhd3',
  })
  @ApiOperation({ summary: 'Method to delete user.' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
