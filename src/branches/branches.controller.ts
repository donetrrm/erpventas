import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { BranchesService } from './branches.service';
import {
  AddProductBranchDto,
  CreateBranchDto,
  UpdateBranchDto,
  UpdateProductBranchDto,
} from './dto/branches.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/roles.model';
import { FilterProducts } from 'src/products/dto/products.dto';

@Controller('branches')
@ApiTags('Branches')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('jwt')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new branch' })
  @ApiBody({
    description: 'The details of the branch to be created',
    examples: {
      example1: {
        summary: 'Basic example',
        description: 'A basic example of creating a branch',
        value: {
          name: 'Sucursal Suchiapa',
          description: 'Sucursal en el centro de Suchiapa',
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Branch already exists' })
  @ApiCreatedResponse({
    description: 'Creates a new branch',
    type: CreateBranchDto,
  })
  @Roles(Role.ADMIN)
  create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchesService.create(createBranchDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all branches' })
  @ApiOkResponse({
    description: 'Returns all branches',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {},
        },
        examples: {
          example1: {
            summary: 'Basic example',
            description: 'A basic response with two branches',
            value: [
              {
                id: '2a799ef8-f8c5-4216-baae-4a829f479368',
                name: 'Sucursal San Cristobal',
                description: 'Sucursal San Cristobal',
                createAt: '2024-01-10T06:15:47.707Z',
                updateAt: '2024-03-11T10:40:02.128Z',
              },
              {
                id: 'e1368084-c0dc-4345-8c55-ebee6fce71cc',
                name: 'Sucursal Suchiapa',
                description: 'Sucursal en el centro de Suchiapa',
                createAt: '2024-08-13T11:20:22.589Z',
                updateAt: '2024-08-13T11:20:22.589Z',
              },
            ],
          },
          example2: {
            summary: 'Empty response',
            description: 'An example where no branches are found',
            value: [],
          },
        },
      },
    },
  })
  @Roles(Role.ADMIN)
  findAll() {
    return this.branchesService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.CUSTOMER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a branch by ID' })
  @ApiOkResponse({
    description: 'Returns a branch by ID',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          items: {},
        },
        examples: {
          example1: {
            summary: 'Basic example',
            description: 'A basic response with branch found',
            value: {
              id: '2a799ef8-f8c5-4216-baae-4a829f479368',
              name: 'Sucursal San Cristobal',
              description: 'Sucursal San Cristobal',
              createAt: '2024-01-10T06:15:47.707Z',
              updateAt: '2024-03-11T10:40:02.128Z',
              productsBranch: [],
            },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Branch (id) not found' })
  findOne(@Param('id') id: string) {
    return this.branchesService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a branch by ID' })
  @ApiBody({
    description: 'The details of the branch to be updated',
    examples: {
      example1: {
        summary: 'Basic example',
        description: 'A basic example of updating a branch',
        value: {
          name: 'Sucursal Suchiapa',
          description: 'Sucursal en el centro de Suchiapa',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Updates a branch by ID',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          items: {},
        },
        examples: {
          example1: {
            summary: 'Basic example',
            description: 'A basic response with branch updated',
            value: {
              id: 'e1368084-c0dc-4345-8c55-ebee6fce71cc',
              name: 'Sucursal Suchiapa',
              description: 'Sucursal en el centro de Suchiapa',
              createAt: '2024-08-13T11:20:22.589Z',
              updateAt: '2024-08-13T11:20:22.589Z',
            },
          },
        },
      },
    },
  })
  update(@Param('id') id: string, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchesService.update(id, updateBranchDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a branch by ID' })
  @ApiOkResponse({
    description: 'Deletes a branch by ID',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          items: {},
        },
        examples: {
          example1: {
            summary: 'Basic example',
            description: 'A basic response with branch deleted',
            value: {
              message:
                'Branch with id: e1368084-c0dc-4345-8c55-ebee6fce71cc deleted succesfully',
            },
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Branch (id) not found' })
  remove(@Param('id') id: string) {
    return this.branchesService.remove(id);
  }

  @Post(':id/addProduct')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a product to a branch' })
  @ApiBody({
    description: 'The details of the product to be added',
    examples: {
      example1: {
        summary: 'Basic example',
        description: 'A basic example of adding a product to a branch',
        value: {
          product_id: '4ff45e7c-6d05-400f-ad79-fcc8a85818fb',
          stock: 10,
          price: 120,
          product_expiration: '2022-05-13T00:35:51.003Z',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Returns the branch with the product added',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          items: {},
        },
        examples: {
          example1: {
            summary: 'Basic example',
            description: 'A basic response of the branch with product added',
            value: {
              stock: 10,
              price: 120,
              product_expiration: '2022-05-13T00:35:51.003Z',
              branch: {
                id: 'e1368084-c0dc-4345-8c55-ebee6fce71cc',
                name: 'Sucursal Suchiapa',
                description: 'Sucursal en el centro de Suchiapa',
                createAt: '2024-08-13T11:20:22.589Z',
                updateAt: '2024-08-13T11:20:22.589Z',
              },
              product: {
                id: '4ff45e7c-6d05-400f-ad79-fcc8a85818fb',
                name: 'Creatine Spartacus',
                sku: 'RC05',
                stock: -10,
                price: 120,
                cost: 240,
                product_expiration: '2022-05-13T00:35:51.003Z',
                image: 'imagen.jpg',
                createAt: '2024-08-13T10:05:13.949Z',
                updateAt: '2024-08-13T12:00:08.000Z',
                category: {
                  id: '69b0e7f1-74b2-448f-9fed-95beda09b1f8',
                  name: 'Aminoácidos',
                  description: 'Aminoácidos de la tienda',
                  createAt: '2022-11-25T07:25:55.874Z',
                  updateAt: '2022-11-25T07:25:55.874Z',
                  deleteAt: null,
                },
              },
              productId: '4ff45e7c-6d05-400f-ad79-fcc8a85818fb',
              branchId: 'e1368084-c0dc-4345-8c55-ebee6fce71cc',
              id: 'cc773751-4db8-47ea-894b-5713c39ea573',
              created_at: '2024-08-13T12:00:07.406Z',
              updated_at: '2024-08-13T12:00:07.406Z',
            },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Product already exists in this branch',
  })
  addProduct(
    @Param('id') id: string,
    @Body() addProductBranchDto: AddProductBranchDto,
  ) {
    return this.branchesService.addProduct(id, addProductBranchDto);
  }

  @Put(':id/updateProduct')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product of a branch' })
  @ApiBody({
    description: 'The details of the product to be updated',
    examples: {
      example1: {
        summary: 'Basic example',
        description: 'A basic example of updating a product of a branch',
        value: {
          product_id: '4ff45e7c-6d05-400f-ad79-fcc8a85818fb',
          stock: 10,
          price: 120,
          product_expiration: '2022-05-13T00:35:51.003Z',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Returns the branch with the product updated',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          items: {},
        },
        examples: {
          example1: {
            summary: 'Basic example',
            description: 'A basic response of the branch with product updated',
            value: {
              id: 'cc773751-4db8-47ea-894b-5713c39ea573',
              productId: '4ff45e7c-6d05-400f-ad79-fcc8a85818fb',
              branchId: 'e1368084-c0dc-4345-8c55-ebee6fce71cc',
              stock: 8,
              price: 120,
              product_expiration: '2022-05-13T00:35:51.003Z',
              created_at: '2024-08-13T12:00:07.406Z',
              updated_at: '2024-08-13T12:24:03.000Z',
              product: {
                id: '4ff45e7c-6d05-400f-ad79-fcc8a85818fb',
                name: 'Creatine Spartacus',
                sku: 'RC05',
                stock: 20,
                price: 120,
                cost: 240,
                image: 'imagen.jpg',
                product_expiration: '2022-05-13T00:35:51.003Z',
                createAt: '2024-08-13T10:05:13.949Z',
                updateAt: '2024-08-13T12:14:26.145Z',
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
    },
  })
  @ApiBadRequestResponse({ description: 'Product has already expired' })
  updateProduct(
    @Param('id') id: string,
    @Body() updateProductBranchDto: UpdateProductBranchDto,
  ) {
    return this.branchesService.updateProduct(id, updateProductBranchDto);
  }

  @Delete(':id/deleteProduct')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product of a branch' })
  @ApiOkResponse({
    description: 'Returns a message deleted',
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
              message: 'Product (id) deleted succesfully',
            },
          },
        },
      },
    },
  })
  deleteProduct(@Param('id') id: string) {
    return this.branchesService.deleteProduct(id);
  }

  @Get(':id/getProduct')
  @Roles(Role.ADMIN, Role.CUSTOMER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a product of a branch' })
  @ApiOkResponse({
    description: 'Returns a product of a branch',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          items: {},
        },
        examples: {
          example1: {
            summary: 'Basic example',
            description: 'A basic response with product found',
            value: {
              id: 'cc773751-4db8-47ea-894b-5713c39ea573',
              productId: '4ff45e7c-6d05-400f-ad79-fcc8a85818fb',
              branchId: 'e1368084-c0dc-4345-8c55-ebee6fce71cc',
              stock: 8,
              price: 120,
              product_expiration: '2022-05-13T00:35:51.003Z',
              created_at: '2024-08-13T12:00:07.406Z',
              updated_at: '2024-08-13T12:24:03.000Z',
              product: {
                id: '4ff45e7c-6d05-400f-ad79-fcc8a85818fb',
                name: 'Creatine Spartacus',
                sku: 'RC05',
                stock: 20,
                price: 120,
                cost: 240,
                image: 'imagen.jpg',
                product_expiration: '2022-05-13T00:35:51.003Z',
                createAt: '2024-08-13T10:05:13.949Z',
                updateAt: '2024-08-13T12:14:26.145Z',
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
    },
  })
  getProduct(@Param('id') id: string) {
    return this.branchesService.getProduct(id);
  }

  @Get(':id/getProducts')
  @Roles(Role.ADMIN, Role.CUSTOMER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get products of a branch' })
  @ApiOkResponse({
    description: 'Returns products of a branch',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {},
        },
        examples: {
          example1: {
            summary: 'Basic example',
            description: 'A basic response with products found',
            value: [
              {
                id: 'cc773751-4db8-47ea-894b-5713c39ea573',
                productId: '4ff45e7c-6d05-400f-ad79-fcc8a85818fb',
                branchId: 'e1368084-c0dc-4345-8c55-ebee6fce71cc',
                stock: 8,
                price: 120,
                product_expiration: '2022-05-13T00:35:51.003Z',
                created_at: '2024-08-13T12:00:07.406Z',
                updated_at: '2024-08-13T12:24:03.000Z',
                product: {
                  id: '4ff45e7c-6d05-400f-ad79-fcc8a85818fb',
                  name: 'Creatine Spartacus',
                  sku: 'RC05',
                  stock: 20,
                  price: 120,
                  cost: 240,
                  image: 'imagen.jpg',
                  product_expiration: '2022-05-13T00:35:51.003Z',
                  createAt: '2024-08-13T10:05:13.949Z',
                  updateAt: '2024-08-13T12:14:26.145Z',
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
            ],
          },
          example2: {
            summary: 'Empty response',
            description: 'An example where no products are found',
            value: [],
          },
        },
      },
    },
  })
  getProductsBranch(@Param('id') id: string, @Query() params?: FilterProducts) {
    return this.branchesService.getProductsBranch(id, params);
  }
}
