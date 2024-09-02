import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateSaleDto, UpdateSaleDto } from '../dto/sale.dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Sale } from '../entities/sale.entity';
import { Between, In, Repository } from 'typeorm';
import { SaleDetails } from '../entities/sale-details.entity';
import { ProductBranch } from 'src/products/entities/products-branch.entity';
import { ISaleDetailsProduct } from '../interfaces/sale-details-product.interface';
import { User } from 'src/users/entities/user.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { Product } from 'src/products/entities/product.entity';
import { GetSalesCutDto } from '../dto/get-sales-cut.dto';
import { CashStart } from '../entities/cash-start.entity';
import { CashWithdrawal } from '../entities/cash-withdrawal.entity';
import { BranchCash } from '../entities/branch-cash.entity';
import { Promotion } from 'src/promotions/entities/promotion.entity';
import { CreatePromotionSaleDto } from '../dto/create-sale-promotion.dto';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(CashStart)
    private cashStartRepository: Repository<CashStart>,
    @InjectRepository(CashWithdrawal)
    private cashWithdrawalRepository: Repository<CashWithdrawal>,
    @InjectRepository(BranchCash)
    private branchCashRepository: Repository<BranchCash>,
    @InjectRepository(Sale) private saleRepository: Repository<Sale>,
    @InjectRepository(SaleDetails)
    private saleDetailsRepository: Repository<SaleDetails>,
    @InjectRepository(ProductBranch)
    private productBranchRepository: Repository<ProductBranch>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Branch) private branchRepository: Repository<Branch>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Promotion)
    private promotionRepository: Repository<Promotion>,
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

    const branchCash = await this.getBranchCash(branch.id);
    if (branchCash) {
      branchCash.totalCash += totalCost;
      await this.branchCashRepository.save(branchCash);
    }

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

  async getSalesCut(saleCut: GetSalesCutDto) {
    const start = new Date(saleCut.date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 1);

    const branchSales = await this.saleRepository.find({
      where: {
        branch: { id: saleCut.branchId },
        createAt: Between(start, end),
      },
      relations: ['products', 'products.product', 'branch'],
      order: { createAt: 'ASC' },
    });

    if (branchSales.length === 0) {
      throw new NotFoundException(
        `No sales found for branch ID ${saleCut.branchId} on the date: ${saleCut.date}`,
      );
    }

    let totalCash = 0;
    let totalTransfer = 0;
    let totalSales = 0;

    const salesReport = branchSales.map((sale) => {
      const productsSold = sale.products.map((productDetail) => ({
        productName: productDetail.product.name,
        quantity: productDetail.quantity,
        price: productDetail.price,
      }));

      const saleTotal = sale.total;
      totalSales += saleTotal;

      if (sale.paymentType === 'EFECTIVO') {
        totalCash += saleTotal;
      } else if (sale.paymentType === 'TRANSFERENCIA') {
        totalTransfer += saleTotal;
      }

      return {
        saleDate: sale.createAt,
        products: productsSold,
        paymentType: sale.paymentType,
        saleTotal: saleTotal,
        branch: sale.branch,
      };
    });

    return {
      reportDate: new Date(),
      totalCash,
      totalTransfer,
      totalSales,
      salesReport,
    };
  }

  //branch cash methods
  async startCash(initialAmount: number, branchId: string, userId: string) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const existingCashStart = await this.cashStartRepository.findOne({
      where: {
        date: Between(todayStart, todayEnd),
        branch: { id: branchId },
      },
    });

    if (existingCashStart) {
      throw new UnauthorizedException(
        'Cash has already been started for today.',
      );
    }

    const user = await this.getUser(userId);
    const branchCash = await this.getBranchCash(branchId);
    //branchCash.totalCash += initialAmount;

    const newCashStart = this.cashStartRepository.create({
      initialAmount,
      branch: { id: branchId },
      user,
      date: new Date(),
    });

    await this.cashStartRepository.save(newCashStart);
    await this.branchCashRepository.save(branchCash);

    return newCashStart;
  }

  async withdrawCash(
    amount: number,
    concept: string,
    branchId: string,
    userId: string,
    type: string,
    withdrawalMethod: string,
  ) {
    const user = await this.getUser(userId);
    const branchCash = await this.getBranchCash(branchId);

    const newTotal = branchCash.totalCash - amount;
    if (newTotal < 0) {
      throw new UnauthorizedException(
        'Insufficient funds in the cash register.',
      );
    }

    const withdrawal = this.cashWithdrawalRepository.create({
      amount,
      concept,
      type,
      newTotal,
      withdrawalMethod,
      user,
      branch: { id: branchId },
      createdAt: new Date(),
    });

    branchCash.totalCash = newTotal;

    await this.cashWithdrawalRepository.save(withdrawal);
    await this.branchCashRepository.save(branchCash);

    return withdrawal;
  }

  async getCashForTheDay(branchId: string) {
    const totalCashSales = await this.saleRepository
      .createQueryBuilder('sale')
      .select('SUM(sale.total)', 'sum')
      .where('sale.paymentType = :paymentType', { paymentType: 'EFECTIVO' })
      .andWhere('sale.branch_id = :branchId', { branchId })
      .andWhere('sale.created_at BETWEEN :start AND :end', {
        start: new Date(new Date().setHours(0, 0, 0, 0)),
        end: new Date(new Date().setHours(23, 59, 59, 999)),
      })
      .getRawOne();

    return { totalCashSales: totalCashSales.sum || 0 };
  }

  async getTransfersForTheDay(branchId: string) {
    const totalTransferSales = await this.saleRepository
      .createQueryBuilder('sale')
      .select('SUM(sale.total)', 'sum')
      .where('sale.paymentType = :paymentType', {
        paymentType: 'TRANSFERENCIA',
      })
      .andWhere('sale.branch_id = :branchId', { branchId })
      .andWhere('sale.created_at BETWEEN :start AND :end', {
        start: new Date(new Date().setHours(0, 0, 0, 0)),
        end: new Date(new Date().setHours(23, 59, 59, 999)),
      })
      .getRawOne();

    return { totalTransferSales: totalTransferSales.sum || 0 };
  }

  async getTotalCash(branchId: string) {
    const branchCash = await this.getBranchCash(branchId);

    return {
      branchCash: branchCash.totalCash,
      totalCashSales: (await this.getCashForTheDay(branchId)).totalCashSales,
      totalTransferSales: (await this.getTransfersForTheDay(branchId))
        .totalTransferSales,
    };
  }

  private async getUser(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }
    return user;
  }

  private async getBranchCash(branchId: string) {
    const branchCash = await this.branchCashRepository.findOne({
      where: { branch: { id: branchId } },
    });

    if (!branchCash) {
      throw new NotFoundException(
        `Cash register for branch ID ${branchId} not found.`,
      );
    }

    return branchCash;
  }

  async createSalePromotion(createSaleDto: CreatePromotionSaleDto) {
    const { branchId, userId, promotionId, ...saleData } = createSaleDto;

    const promotion = await this.promotionRepository.findOne({
      where: { id: promotionId },
      relations: ['promotionDetails', 'promotionDetails.product'],
    });

    if (!promotion) {
      throw new NotFoundException(
        `Promotion with ID ${promotionId} not found.`,
      );
    }

    if (promotion.stock <= 0) {
      throw new NotFoundException('Promotion out of stock.');
    }

    const branch = await this.branchRepository.findOneBy({ id: branchId });
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!branch || !user) {
      throw new NotFoundException('Branch or User not found.');
    }
    const productsFormated = await Promise.all(
      promotion.promotionDetails.map(async (detail) => {
        const productBranch = await this.productBranchRepository.findOne({
          where: { productId: detail.product.id, branchId },
        });

        if (!productBranch) {
          throw new NotFoundException(
            `Product ${detail.product.id} not found in branch ${branchId}.`,
          );
        }
        console.log(productBranch.stock, detail.quantity);
        if (productBranch.stock < detail.quantity) {
          throw new NotFoundException(
            `Insufficient stock for product ${detail.product.id} in branch ${branchId}.`,
          );
        }

        productBranch.stock -= detail.quantity;
        await this.productBranchRepository.save(productBranch);
        return {
          product: detail.product,
          quantity: detail.quantity,
          price: 0,
          total: 0,
          profit: 0,
        };
      }),
    );

    const saleDetails = await this.saleDetailsRepository.save(productsFormated);

    const sale = this.saleRepository.create({
      ...saleData,
      total: promotion.price,
      branch,
      user,
      products: saleDetails,
    });

    const newSale = await this.saleRepository.save(sale);

    promotion.stock -= 1;
    await this.promotionRepository.save(promotion);

    const branchCash = await this.getBranchCash(branchId);
    branchCash.totalCash += promotion.price;
    await this.branchCashRepository.save(branchCash);

    return newSale;
  }
}
