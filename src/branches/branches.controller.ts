import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Query } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { AddProductBranchDto, CreateBranchDto, UpdateBranchDto, UpdateProductBranchDto } from './dto/branches.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/roles.model';
import { FilterProducts } from 'src/products/dto/products.dto';


@Controller('branches')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('jwt')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchesService.create(createBranchDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.branchesService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.CUSTOMER)
  findOne(@Param('id') id: string) {
    return this.branchesService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchesService.update(id, updateBranchDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.branchesService.remove(id);
  }

  @Post(':id/addProduct')
  @Roles(Role.ADMIN)
  addProduct(@Param('id') id: string, @Body() addProductBranchDto: AddProductBranchDto){
    return this.branchesService.addProduct(id,addProductBranchDto);
  }

  @Put(':id/updateProduct')
  @Roles(Role.ADMIN)
  updateProduct(@Param('id') id: string, @Body() updateProductBranchDto: UpdateProductBranchDto){
    return this.branchesService.updateProduct(id,updateProductBranchDto);
  }

  @Delete(':id/deleteProduct')
  @Roles(Role.ADMIN)
  deleteProduct(@Param('id') id: string) {
    return this.branchesService.deleteProduct(id);
  }

  @Get(':id/getProduct')
  @Roles(Role.ADMIN, Role.CUSTOMER)
  getProduct(@Param('id') id: string) {
    return this.branchesService.getProduct(id);
  }

  @Get(':id/getProducts')
  getProductsBranch(@Param('id') id: string, @Query() params?: FilterProducts ){
    return this.branchesService.getProductsBranch(id,params)
  }
}
