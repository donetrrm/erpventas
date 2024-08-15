import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import {
  CreateProductDto,
  FilterProducts,
  UpdateProductDto,
} from '../dto/products.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/roles.model';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@Controller('products')
@ApiTags('Products')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('jwt')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBearerAuth()
  @ApiBody({
    description: 'The details of the product to be created',
    examples: {
      example1: {
        summary: 'Basic example',
        description: 'A basic example of creating a product',
        value: {
          name: 'Creatine Spartacus',
          sku: 'RC05',
          stock: 10,
          price: 120,
          cost: 240,
          image: 'imagen.jpg',
          category_id: '69b0e7f1-74b2-448f-9fed-95beda09b1f8',
          product_expiration: '2022-05-13T00:35:51.003Z',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Creates a new product',
    type: CreateProductDto,
  })
  @ApiBadRequestResponse({ description: 'Product already exists' })
  @Roles(Role.ADMIN)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all products' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Returns all products',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          items: {},
        },
        examples: {
          example1: {
            summary: 'Basic example',
            description: 'A basic response with two products',
            value: {
              data: [
                {
                  id: '00cde7da-6bb5-4a78-9892-2cab929cee1e',
                  name: 'CEL C4 RIPPED 30 SERV',
                  sku: 'CELL03',
                  stock: 9,
                  price: 445,
                  cost: 324,
                  image:
                    'http://latienditadelmamado.com/static-files/files-0c47f7d0-b2be-470d-b479-eb87d8a03331.jpg',
                  createAt: '2024-01-16T08:26:25.140Z',
                  updateAt: '2024-03-14T06:04:17.000Z',
                  product_expiration: '2022-05-13T00:35:51.003Z',
                  category: {
                    id: 'ae30d696-6874-496b-80d4-e1e2aad11e28',
                    name: 'Pre-Entreno ',
                    description: 'Pre-Entreno de la tienda ',
                    createAt: '2022-11-29T08:18:48.492Z',
                    updateAt: '2022-11-29T08:20:16.000Z',
                    deleteAt: null,
                  },
                },
                {
                  id: '016e43d9-893c-4f99-a2ee-49ccde1cd52c',
                  name: 'DRAGON VENOM INFERNO',
                  sku: 'DG10',
                  stock: 6,
                  price: 620,
                  cost: 419,
                  image:
                    'http://latienditadelmamado.com/static-files/files-6ec6f689-a15d-4016-bcb5-b7927e20fdb0.jpg',
                  createAt: '2024-01-29T23:04:04.889Z',
                  updateAt: '2024-03-14T05:57:24.000Z',
                  product_expiration: '2022-05-13T00:35:51.003Z',
                  category: {
                    id: 'ae30d696-6874-496b-80d4-e1e2aad11e28',
                    name: 'Pre-Entreno ',
                    description: 'Pre-Entreno de la tienda ',
                    createAt: '2022-11-29T08:18:48.492Z',
                    updateAt: '2022-11-29T08:20:16.000Z',
                    deleteAt: null,
                  },
                },
              ],
              count: 251,
            },
          },
          example2: {
            summary: 'Empty response',
            description: 'An example where no products are found',
            value: { data: [], count: 0 },
          },
        },
      },
    },
  })
  findAll(@Query() params?: FilterProducts) {
    return this.productsService.findAll(params);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get a product with ID a product' })
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
              id: '016e43d9-893c-4f99-a2ee-49ccde1cd52c',
              name: 'DRAGON VENOM INFERNO',
              sku: 'DG10',
              stock: 6,
              price: 620,
              cost: 419,
              image:
                'http://latienditadelmamado.com/static-files/files-6ec6f689-a15d-4016-bcb5-b7927e20fdb0.jpg',
              createAt: '2024-01-29T23:04:04.889Z',
              updateAt: '2024-03-14T05:57:24.000Z',
              product_expiration: '2022-05-13T00:35:51.003Z',
              category: {
                id: 'ae30d696-6874-496b-80d4-e1e2aad11e28',
                name: 'Pre-Entreno ',
                description: 'Pre-Entreno de la tienda ',
                createAt: '2022-11-29T08:18:48.492Z',
                updateAt: '2022-11-29T08:20:16.000Z',
                deleteAt: null,
              },
            },
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Product (id) not found',
    content: {
      'application/json': {
        schema: { type: 'object', items: {} },
        examples: {
          example1: {
            summary: 'Basic example',
            description: 'Category not found',
            value: {
              message: 'Product #016e43d9-893c-4f99--49ccde1cd52c not found',
              error: 'Not Found',
              statusCode: 404,
            },
          },
        },
      },
    },
  })
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiBearerAuth()
  @ApiBody({
    description: 'The details of the product to be updated',
    examples: {
      example1: {
        summary: 'Basic example',
        description: 'A basic example of updating a product',
        value: {
          name: 'Creatine Spartacus',
          sku: 'RC05',
          stock: 10,
          price: 120,
          cost: 240,
          image: 'imagen.jpg',
          category_id: '69b0e7f1-74b2-448f-9fed-95beda09b1f8',
          product_expiration: '2022-05-13T00:35:51.003Z',
        },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiBadRequestResponse({ description: 'Product has already expired' })
  @ApiOkResponse({
    description: 'Updates a product by ID',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          items: {},
        },
        examples: {
          example1: {
            summary: 'Basic example',
            description: 'A basic response with product updated',
            value: {
              id: '4ff45e7c-6d05-400f-ad79-fcc8a85818fb',
              name: 'Creatine Spartacus',
              sku: 'RC05',
              stock: 10,
              price: 120,
              cost: 240,
              image: 'imagen.jpg',
              createAt: '2024-08-13T10:05:13.949Z',
              updateAt: '2024-08-13T10:05:13.949Z',
              product_expiration: '2022-05-13T00:35:51.003Z',
              category: {
                id: '69b0e7f1-74b2-448f-9fed-95beda09b1f8',
                name: 'Aminoácidos',
                description: 'Aminoácidos de la tienda',
                createAt: '2022-11-25T07:25:55.874Z',
                updateAt: '2022-11-25T07:25:55.874Z',
                deleteAt: null,
              },
            },
          },
        },
      },
    },
  })
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Returns a product by ID',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          items: {},
        },
        examples: {
          example1: {
            summary: 'Basic example',
            description: 'A basic response with product deleted',
            value: {
              message:
                'Product with id: 4ff45e7c-6d05-400f-ad79-fcc8a85818fb deleted succesfully',
            },
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Product not found' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
