import { Controller, Get, Param, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { FilterByDatesAndBranchDto } from './dto/reports.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@Controller('reports')
@ApiTags('Reports')
@ApiBearerAuth('jwt')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('/getSalesByDatesAndBranch')
  @ApiOperation({ summary: 'Get sales by dates and branch' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Sales by dates and branch',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {},
        },
        example: [
          {
            id: '459739f5-47e6-422d-8250-3e8a4fed3528',
            total: 60,
            paymentType: 'EFECTIVO',
            createAt: '2024-04-03T04:21:41.964Z',
            updateAt: '2024-04-03T04:21:41.964Z',
            user: {
              id: 'dde0bf54-5a2c-4bdf-b27d-4a638cb96798',
              name: 'Israel',
              surnames: 'Santiago Gutierrez',
              username: 'admin',
              createAt: '2024-01-10T06:03:52.421Z',
              updateAt: '2024-01-10T06:16:22.000Z',
              role: {
                id: 'a957b53f-4009-4437-aba3-77dd16d1aaea',
                name: 'Administrador',
                createAt: '2024-01-10T06:03:24.820Z',
                updateAt: '2024-01-10T06:03:24.820Z',
              },
              branch: {
                id: '2a799ef8-f8c5-4216-baae-4a829f479368',
                name: 'Sucursal San Cristobal',
                description: 'Sucursal San Cristobal',
                createAt: '2024-01-10T06:15:47.707Z',
                updateAt: '2024-03-11T10:40:02.128Z',
              },
            },
            products: [
              {
                id: '5bd0223b-9d81-4c71-a0ac-1d04e147936a',
                price: 20,
                quantity: 3,
                total: 60,
                profit: 6,
                createAt: '2024-04-03T04:21:41.948Z',
                updateAt: '2024-04-03T04:21:41.000Z',
                product: {
                  id: '6cbf36ff-1d45-4a2c-8178-67a6bbe844a1',
                  name: 'INS PRE Entreno Servicio sobre',
                  sku: 'INS14',
                  stock: 0,
                  price: 20,
                  cost: 18,
                  image:
                    'http://latienditadelmamado.com/static-files/files-f3535a63-6f13-4f11-8747-3d6a5690b5ef.jpg',
                  createAt: '2024-04-02T01:18:43.108Z',
                  updateAt: '2024-04-02T01:21:59.000Z',
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
            ],
          },
        ],
      },
    },
  })
  getSalesByDayAndBranch(@Query() params: FilterByDatesAndBranchDto) {
    return this.reportsService.getSalesByDatesAndBranch(params);
  }

  @Get('/financial')
  @ApiOperation({ summary: 'Get financial report' })
  @ApiBearerAuth()
  getFinancialReport(@Query() params: FilterByDatesAndBranchDto) {
    return this.reportsService.getFinancialReport(params);
  }
}
