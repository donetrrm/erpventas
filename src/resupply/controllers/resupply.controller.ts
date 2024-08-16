import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  BadRequestException,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ResupplyService } from '../services/resupply.service';
import { CreateResupplyDto } from '../dto/create-resupply.dto';
import { Resupply } from 'src/branches/entities/resupply.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/roles.model';

@ApiTags('Resupply')
@Controller('resupply')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('jwt')
export class ResupplyController {
  constructor(private readonly resupplyService: ResupplyService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new resupply' })
  @ApiResponse({
    status: 201,
    description: 'The resupply has been successfully created.',
    schema: {
      example: {
        id: '8d8a4d26-377d-4e2c-b3fb-7d913f7b03e8',
        totalCost: 150.0,
        productQuantity: 10,
        products: [
          {
            productId: 'abc123',
            quantity: 5,
            cost: 20.0,
            total: 100.0,
          },
          {
            productId: 'def456',
            quantity: 5,
            cost: 10.0,
            total: 50.0,
          },
        ],
        user: { id: 'userId', name: 'John Doe' },
        branch: { id: 'branchId', name: 'Main Branch' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or malformed data.',
  })
  @ApiResponse({
    status: 404,
    description: 'User or branch not found.',
  })
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  async create(
    @Body() createResupplyDto: CreateResupplyDto,
  ): Promise<Resupply> {
    try {
      return this.resupplyService.create(createResupplyDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException('Invalid data provided');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all resupply entries' })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date for filtering resupplies',
    type: String,
    example: '2023-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date for filtering resupplies',
    type: String,
    example: '2023-12-31',
  })
  @ApiQuery({
    name: 'branchId',
    required: false,
    description: 'Filter resupplies by branch ID',
    type: String,
    example: '2f6e2d88-6c9b-4b5d-9f36-3f1d4bde47c4',
  })
  @ApiResponse({
    status: 200,
    description: 'List of found resupplies.',
    schema: {
      example: [
        {
          id: '8d8a4d26-377d-4e2c-b3fb-7d913f7b03e8',
          totalCost: 150.0,
          productQuantity: 10,
          products: [
            {
              productId: 'abc123',
              quantity: 5,
              cost: 20.0,
              total: 100.0,
            },
            {
              productId: 'def456',
              quantity: 5,
              cost: 10.0,
              total: 50.0,
            },
          ],
          user: { id: 'userId', name: 'John Doe' },
          branch: { id: 'branchId', name: 'Main Branch' },
        },
      ],
    },
  })
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  async findAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('branchId') branchId?: string,
  ): Promise<Resupply[]> {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.resupplyService.findAll(start, end, branchId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an existing resupply' })
  @ApiParam({
    name: 'id',
    description: 'Identifier of the resupply to delete',
    example: '8d8a4d26-377d-4e2c-b3fb-7d913f7b03e8',
  })
  @ApiResponse({
    status: 200,
    description: 'The resupply has been successfully deleted.',
    schema: {
      example: {
        message:
          'Resupply with id: 8d8a4d26-377d-4e2c-b3fb-7d913f7b03e8 deleted successfully',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Resupply not found.',
  })
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string): Promise<object> {
    await this.resupplyService.delete(id);

    try {
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException('Invalid data provided');
    }
    return { message: `Resupply with id: ${id} deleted successfully` };
  }
}
