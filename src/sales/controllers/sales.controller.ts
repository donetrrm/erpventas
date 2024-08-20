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
import { SalesService } from '../services/sales.service';
import { CreateSaleDto, UpdateSaleDto } from '../dto/sale.dtos';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/roles.model';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { GetSalesCutDto } from '../dto/get-sales-cut.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('jwt')
@Controller('sales')
@ApiTags('Sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @Roles(Role.ADMIN, Role.CUSTOMER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Method to create a sale.' })
  @ApiCreatedResponse({ description: 'Sale created', type: CreateSaleDto })
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.CUSTOMER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Method to get all sales.' })
  @ApiOkResponse({
    description: 'Sales list',
    type: [CreateSaleDto],
  })
  findAll() {
    return this.salesService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.CUSTOMER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Method to get a sale by id.' })
  @ApiOkResponse({ description: 'Sale found', type: CreateSaleDto })
  @ApiNotFoundResponse({ description: 'Sale (id) not found' })
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.CUSTOMER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Method to update a sale by id.' })
  @ApiOkResponse({
    description: 'Sale updated',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {},
        },
        example: 'This action updates a #(id) sale',
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Sale (id) not found' })
  update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto) {
    return this.salesService.update(id, updateSaleDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Method to remove a sale by id.' })
  @ApiOkResponse({
    description: 'Delete a sale by ID',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          items: {},
        },
        examples: {
          example1: {
            summary: 'Basic example',
            description: 'A basic response with sale deleted',
            value: {
              message:
                'Sale with id: b585170a-7e89-4ecc-a604-83d585b6125f deleted succesfully',
            },
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Sale not found' })
  @Get('branch/:branchId')
  @Roles(Role.ADMIN, Role.CUSTOMER)
  getSalesByBranch(@Param('branchId') branchId: string) {
    return this.salesService.getSalesByBranch(branchId);
  }

  @Roles(Role.ADMIN, Role.CUSTOMER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Method to get the sales cut by date.' })
  @ApiOkResponse({
    description: 'Sales cut by date',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          items: {},
        },
        example: {
          reportDate: '2024-08-20T21:53:29.586Z',
          totalCash: 60,
          totalTransfer: 1450,
          totalSales: 1510,
          salesReport: [
            {
              saleDate: '2024-04-03T04:21:41.964Z',
              products: [
                {
                  productName: 'INS PRE Entreno Servicio sobre',
                  quantity: 3,
                  price: 20,
                },
              ],
              paymentType: 'EFECTIVO',
              saleTotal: 60,
            },
            {
              saleDate: '2024-04-03T04:22:17.969Z',
              products: [
                {
                  productName: 'DYM ISO 100 5 LBS',
                  quantity: 1,
                  price: 1450,
                },
              ],
              paymentType: 'TRANSFERENCIA',
              saleTotal: 1450,
            },
          ],
        },
      },
    },
  })
  @Get('cut/:date')
  async getSalesReport(@Query() getSalesCutDto: GetSalesCutDto) {
    return this.salesService.getSalesCut(getSalesCutDto);
  }
}
