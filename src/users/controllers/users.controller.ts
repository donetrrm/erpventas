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
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
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
  @ApiBearerAuth()
  @ApiBadRequestResponse({ description: 'Username already exists' })
  @ApiCreatedResponse({
    description: 'User created',
    content: {
      'application/json': {
        schema: { type: 'object', items: {} },
        example: {
          name: 'Juan',
          surnames: 'Aquino',
          username: 'juan.aquino',
          role: {
            id: 'a951b53f-1232-4437-aba3-77dd16d1aaea',
            name: 'Administrador',
            createAt: '2024-01-10T06:03:24.820Z',
            updateAt: '2024-01-10T06:03:24.820Z',
          },
          id: 'bef608a2-dsad-46ff-95be-9faf84b481a0',
          createAt: '2024-08-13T13:44:30.687Z',
          updateAt: '2024-08-13T13:44:30.687Z',
        },
      },
    },
  })
  create(@Body() payload: CreateUserDto) {
    return this.usersService.create(payload);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Method to get all users' })
  @ApiOkResponse({
    description: 'All users',
    content: {
      'application/json': {
        schema: { type: 'array', items: {} },
        example: [
          [
            {
              id: '538bfef5-c3f1-4008-asdas-7aa1e2b6c84a',
              name: 'Juan',
              surnames: 'Aquino',
              username: 'juan.aquino',
              createAt: '2024-01-10T06:26:54.609Z',
              updateAt: '2024-01-10T06:26:54.609Z',
              role: {
                id: '074497f0-asda-43ec-b6ba-e2d6485be10c',
                name: 'Empleado',
                createAt: '2024-01-10T06:21:06.147Z',
                updateAt: '2024-01-10T06:21:06.147Z',
              },
              branch: {
                id: '2a799ef8-asasd-4216-baae-4a829f479368',
                name: 'Sucursal San Cristobal',
                description: 'Sucursal San Cristobal',
                createAt: '2024-01-10T06:15:47.707Z',
                updateAt: '2024-03-11T10:40:02.128Z',
              },
            },
            {
              id: 'bef608a2-41da-asdas-95be-9faf84b481a0',
              name: 'Donet',
              surnames: 'Ramos',
              username: 'donetrm',
              createAt: '2024-08-13T13:44:30.687Z',
              updateAt: '2024-08-13T13:44:30.687Z',
              role: {
                id: 'a957b53f-sadasd-4437-aba3-77dd16d1aaea',
                name: 'Administrador',
                createAt: '2024-01-10T06:03:24.820Z',
                updateAt: '2024-01-10T06:03:24.820Z',
              },
              branch: null,
            },
          ],
        ],
      },
    },
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'The id of the user you want to see.',
    type: String,
    example: '2323kjsadjhd3',
  })
  @ApiOperation({ summary: 'Method to get information of an user.' })
  @ApiOkResponse({
    description: 'Response an user',
    content: {
      'application/json': {
        schema: { type: 'object', items: {} },
        example: {
          id: 'bef608a2-dsfsdf-46ff-95be-9faf84b481a0',
          name: 'Juan',
          surnames: 'Aquino',
          username: 'juan.aquino',
          createAt: '2024-08-13T13:44:30.687Z',
          updateAt: '2024-08-13T13:44:30.687Z',
          role: {
            id: 'a957b53f-dsfsdf-23423-aba3-77dd16d1aaea',
            name: 'Administrador',
            createAt: '2024-01-10T06:03:24.820Z',
            updateAt: '2024-01-10T06:03:24.820Z',
          },
          branch: null,
        },
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Method to edit an user.' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'The id of the user you want to edit.',
    type: String,
    example: '2323kjsadjhd3',
  })
  // @ApiBody({required: false, type: UpdateCaseDto})
  @ApiOkResponse({
    description: 'Response the user edited',
    content: {
      'application/json': {
        schema: { type: 'object', items: {} },
        example: {
          id: 'bef608a2-dsfdsf-cxasd-95be-9faf84b481a0',
          name: 'Israel',
          surnames: 'Santiago',
          username: 'JISG',
          createAt: '2024-08-13T13:44:30.687Z',
          updateAt: '2024-08-13T13:44:30.687Z',
          role: {
            id: 'a957b53f-dsfsdf-asd212-aba3-77dd16d1aaea',
            name: 'Administrador',
            createAt: '2024-01-10T06:03:24.820Z',
            updateAt: '2024-01-10T06:03:24.820Z',
          },
          branch: null,
        },
      },
    },
  })
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'User deleted',
    content: {
      'application/json': {
        schema: { type: 'object', items: {} },
        example: { message: 'User with id: 2323kjsadjhd3 deleted succesfully' },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'User (id) not found' })
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
