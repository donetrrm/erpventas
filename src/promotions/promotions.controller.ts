import { Controller, Post, Body, UseGuards, Get, Param, Patch } from '@nestjs/common';
import { PromotionService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/roles.model';
import { Promotion } from './entities/promotion.entity';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('jwt')
@Controller('promotions')
@ApiTags('Promotions')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Method to create a promotion.' })
  @ApiCreatedResponse({
    description: 'Promotion created',
    type: CreatePromotionDto,
  })
  async createPromotion(@Body() createPromotionDto: CreatePromotionDto) {
    return await this.promotionService.create(createPromotionDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Method to get all promotions.' })
  @ApiOkResponse({
    description: 'Promotions list',
    type: [CreatePromotionDto],
  })
  async getAllPromotions() {
    return await this.promotionService.getAll();
  }

  @Get('branch/:branchId')
  @Roles(Role.ADMIN, Role.CUSTOMER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Method to get a promotion by id.' })
  @ApiOkResponse({
    description: 'Promotion',
    type: CreatePromotionDto,
  })
  async getByBranch(@Param('branchId') branchId: string): Promise<Promotion[]> {
    return this.promotionService.getByBranch(branchId);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Method to update a promotion sale.' })
  @ApiOkResponse({
    description: 'Promotion sale updated',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {},
        },
        example: 'This action updates a promotion sale',
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Promotion sale not found' })
  @Patch(':id')
  async updatePromotion(
    @Param('id') id: string,
    @Body() updatePromotionDto: UpdatePromotionDto,
  ) {
    return this.promotionService.updatePromotion(id, updatePromotionDto);
  }
}
