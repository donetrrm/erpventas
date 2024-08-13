import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/categories.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/roles.model';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

@Controller('categories')
@ApiTags('Categories')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('jwt')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new category' })
  @ApiBearerAuth()
  @ApiBadRequestResponse({ description: 'Product already exists' })
  @ApiCreatedResponse({
    description: 'Creates a new product',
    type: CreateCategoryDto,
  })
  @ApiBody({
    description: 'The details of the category to be created',
    examples: {
      example1: {
        summary: 'Basic example',
        description: 'A basic example of creating a category',
        value: {
          name: 'Creatina',
          description: 'Category for creatine products',
        },
      },
    },
  })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.CUSTOMER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiOkResponse({
    description: 'Returns all categories',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {},
        },
        examples: {
          example1: {
            summary: 'Basic example',
            description: 'A basic response with two categories',
            value: [
              {
                id: '05e14adc-dc39-4f95-9305-0a9ce9c8995a',
                name: 'BCAA',
                description: 'BCCA de la tienda',
                createAt: '2022-11-25T07:25:22.571Z',
                updateAt: '2022-11-25T07:25:22.571Z',
                deleteAt: null,
              },
              {
                id: '11eccb0e-6f97-4cce-88b1-c61d25a7c578',
                name: 'Citrulline ',
                description: 'Productos en tienda ',
                createAt: '2022-12-23T11:52:09.039Z',
                updateAt: '2022-12-23T11:52:09.039Z',
                deleteAt: null,
              },
            ],
          },
          example2: {
            summary: 'Empty response',
            description: 'An example where no categories are found',
            value: [],
          },
        },
      },
    },
  })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.CUSTOMER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a category by ID' })
  @ApiOkResponse({
    description: 'Returns a category by ID',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          items: {},
        },
        examples: {
          example1: {
            summary: 'Basic example',
            description: 'A basic response with category found',
            value: {
              id: '33410d4f-384c-4ae2-83e1-c87573a5c9a6',
              name: 'Arginine',
              description: 'productos en tienda',
              createAt: '2022-12-23T11:41:37.413Z',
              updateAt: '2022-12-23T11:41:37.413Z',
              deleteAt: null,
            },
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Category (id) not found',
    content: {
      'application/json': {
        schema: { type: 'object', items: {} },
        examples: {
          example1: {
            summary: 'Basic example',
            description: 'Category not found',
            value: {
              message: 'Category #V not found',
              error: 'Not Found',
              statusCode: 404,
            },
          },
        },
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a category by ID' })
  @ApiOkResponse({
    description: 'Updates a category by ID',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          items: {},
        },
        examples: {
          example1: {
            summary: 'Basic example',
            description: 'A basic response with category updated',
            value: {
              id: '33410d4f-384c-4ae2-83e1-c87573a5c9a6',
              name: 'Creatina en polvo',
              description: 'Category for creatine products',
              createAt: '2022-12-23T11:41:37.413Z',
              updateAt: '2022-12-23T11:41:37.413Z',
              deleteAt: null,
            },
          },
        },
      },
    },
  })
  @ApiBody({
    description: 'The details of the category to be updated',
    examples: {
      example1: {
        summary: 'Basic example',
        description: 'A basic example of updating a category',
        value: {
          name: 'Creatina en polvo',
          description: 'Category for creatine products',
        },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Category not found' })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a category by ID' })
  @ApiOkResponse({
    description: 'Returns a category by ID',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          items: {},
        },
        examples: {
          example1: {
            summary: 'Basic example',
            description: 'A basic response with category deleted',
            value: {
              message:
                'Category with id: b585170a-7e89-4ecc-a604-83d585b6125f deleted succesfully',
            },
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Category not found' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
