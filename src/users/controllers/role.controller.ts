import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateRoleDto, UpdateRoleDto } from '../dto/role.dtos';
import { RoleService } from '../services/role.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/roles.model';

@ApiTags('Roles')
@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('jwt')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Method to create a role.' })
  @ApiBody({
    description: 'Data to create a role',
    examples: {
      example1: { summary: 'Basic example', value: { name: 'Administrador' } },
    },
  })
  @ApiCreatedResponse({
    description: 'Role created',
    content: {
      'application/json': {
        schema: { type: 'object' },
        example: {
          id: '07449sdf230-2b85-23fd-sdfsd23-e2d6485be10c',
          name: 'Empleado',
          createAt: '2024-01-10T06:21:06.147Z',
          updateAt: '2024-01-10T06:21:06.147Z',
        },
      },
    },
  })
  create(@Body() payload: CreateRoleDto) {
    return this.roleService.create(payload);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Method to list all roles.' })
  @ApiOkResponse({
    description: 'Roles found',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {},
        },
        example: [
          {
            id: '074497f0-2b85-43ec-b6ba-e2d6485be10c',
            name: 'Empleado',
            createAt: '2024-01-10T06:21:06.147Z',
            updateAt: '2024-01-10T06:21:06.147Z',
          },
          {
            id: 'a957b53f-4009-4437-aba3-77dd16d1aaea',
            name: 'Administrador',
            createAt: '2024-01-10T06:03:24.820Z',
            updateAt: '2024-01-10T06:03:24.820Z',
          },
        ],
      },
    },
  })
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Method to get a role by id.' })
  @ApiOkResponse({
    description: 'Role found',
    content: {
      'application/json': {
        schema: {},
        example: {
          id: '074497f0-2b85-43ec-b6ba-e2d6485be10c',
          name: 'Empleado',
          createAt: '2024-01-10T06:21:06.147Z',
          updateAt: '2024-01-10T06:21:06.147Z',
        },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Role not found' })
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Method to update a role by id.' })
  @ApiBody({
    description: 'Data to update a role',
    examples: {
      example1: { summary: 'Basic example', value: { name: 'Empleado' } },
    },
  })
  @ApiOkResponse({
    description: 'Role updated',
    content: {
      'application/json': {
        schema: {},
        example: {
          id: '074497f0-2b85-43ec-b6ba-e2d6485be10c',
          name: 'Empleado',
          createAt: '2024-01-10T06:21:06.147Z',
          updateAt: '2024-01-10T06:21:06.147Z',
        },
      },
    },
  })
  update(@Param('id') id: string, @Body() payload: UpdateRoleDto) {
    return this.roleService.update(id, payload);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Method to delete a role by id.' })
  @ApiOkResponse({
    description: 'Role deleted',
    content: {
      'application/json': {
        schema: {},
        example: {
          message:
            'Role with id: 074497f0-2b85-43ec-b6ba-e2d6485be10c deleted succesfully',
        },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Role not found' })
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }
}
