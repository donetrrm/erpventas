import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSaleDto, UpdateSaleDto } from '../dto/sale.dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Sale } from '../entities/sale.entity';
import { Between, Repository } from 'typeorm';
import { SaleDetails } from '../entities/sale-details.entity';
import { ProductBranch } from 'src/products/entities/products-branch.entity';
import { ISaleDetailsProduct } from '../interfaces/sale-details-product.interface';
import { User } from 'src/users/entities/user.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale) private saleRepository: Repository<Sale>,
    @InjectRepository(SaleDetails)
    private saleDetailsRepository: Repository<SaleDetails>,
    @InjectRepository(ProductBranch)
    private productBranchRepository: Repository<ProductBranch>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Branch) private branchRepository: Repository<Branch>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}
  async create(createSaleDto: CreateSaleDto) {
    const productsFormated: ISaleDetailsProduct[] = JSON.parse(
      createSaleDto.productsString,
    );
    let totalCost = 0;
    for await (const item of productsFormated) {
      const productBranch = await this.productBranchRepository
        .createQueryBuilder()
        .where('branch_id = :branchId', { branchId: createSaleDto.branchId })
        .andWhere('product_id = :productId', { productId: item.product })
        .getOne();

      const product = await this.productRepository.findOneBy({
        id: productBranch.productId,
      });
      item.total = item.quantity * productBranch.price;
      item.price = productBranch.price;
      totalCost += item.total;
      const profit = item.price - product.cost;
      item.profit = profit * item.quantity;
      productBranch.stock = productBranch.stock - item.quantity;
      await this.productBranchRepository.save(productBranch);
    }
    const products = await this.saleDetailsRepository.save(productsFormated);
    const user = await this.userRepository.findOneBy({
      id: createSaleDto.userId,
    });
    const branch = await this.branchRepository.findOneBy({
      id: createSaleDto.branchId,
    });
    const saleData = {
      total: totalCost,
      paymentType: createSaleDto.paymentType,
      products,
      branch,
      user,
    };
    const newSale = await this.saleRepository.save(saleData);
    return newSale;
  }

  findAll() {
    return `This action returns all sales`;
  }

  async findOne(id: string) {
    const sale = await this.saleRepository.findOneBy({ id });
    this.validationExist(sale, id);
    return sale;
  }

  update(id: string, updateSaleDto: UpdateSaleDto) {
    return `This action updates a #${id} sale`;
  }

  async remove(id: string) {
    const sale = await this.saleRepository.findOneBy({
      id,
    });
    this.validationExist(sale, id);
    await this.saleRepository.delete(id);
    return { message: `Sale with id: ${id} deleted succesfully` };
  }

  async getSalesByBranch(branchId: string) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 1);
    const branchSales = await this.saleRepository.find({
      order: { createAt: 'ASC' },
      where: {
        branch: { id: branchId },
        createAt: Between(start, end),
      },
    });
    return branchSales;
  }

  validationExist = (sale: Sale, id: string) => {
    if (!sale) {
      throw new NotFoundException(`Sale #${id} not found`);
    }
  };
}
