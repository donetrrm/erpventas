import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Resupply } from 'src/branches/entities/resupply.entity';
import { CreateResupplyDto } from '../dto/create-resupply.dto';
import { ResupplyDetails } from 'src/branches/entities/resupply-details.entity';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { ProductBranch } from 'src/products/entities/products-branch.entity';
import { AddProductBranchDto } from 'src/branches/dto/branches.dto';

@Injectable()
export class ResupplyService {
  constructor(
    @InjectRepository(Resupply)
    private readonly resupplyRepository: Repository<Resupply>,

    @InjectRepository(ResupplyDetails)
    private readonly resupplyDetailsRepository: Repository<ResupplyDetails>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,

    @InjectRepository(ProductBranch)
    private readonly productBranchRepository: Repository<ProductBranch>,
  ) {}

  async create(createResupplyDto: CreateResupplyDto): Promise<Resupply> {
    const { products, userId, branchId } = createResupplyDto;

    let totalCost = 0;
    let productQuantity = 0;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const branch = await this.branchRepository.findOne({
      where: { id: branchId },
    });
    if (!branch) {
      throw new NotFoundException(`Branch with ID ${branchId} not found`);
    }

    const resupply = this.resupplyRepository.create({
      user: { id: userId },
      branch: { id: branchId },
    });

    const resupplyDetails = await Promise.all(
      products.map(async (product) => {
        const { quantity } = product;

        const globalProduct = await this.verifyProductByID(product.productId);
        if (!globalProduct) {
          throw new NotFoundException(
            `Product with ID ${product.productId} not found`,
          );
        }

        let productBranch = await this.productBranchRepository.findOne({
          where: { productId: product.productId, branchId: branchId },
        });

        if (!productBranch) {
          const newProductBranch: AddProductBranchDto = {
            product_id: product.productId,
            stock: quantity,
            price: globalProduct.price,
            product_expiration: globalProduct.product_expiration,
          };

          productBranch = this.productBranchRepository.create({
            ...newProductBranch,
            branch: branch,
            product: globalProduct,
          });
        } else {
          productBranch.stock += quantity;
        }

        const total = globalProduct.cost * quantity;
        totalCost += total;
        productQuantity += quantity;

        globalProduct.stock -= quantity;
        if (globalProduct.stock < 0) {
          throw new BadRequestException(
            `Insufficient global stock for product with ID ${product.productId}`,
          );
        }

        await this.productRepository.save(globalProduct);
        await this.productBranchRepository.save(productBranch);

        const resupplySaved = this.resupplyDetailsRepository.create({
          ...product,
          total,
          resupply: resupply,
          cost: globalProduct.cost,
          product: { id: product.productId },
        });
        return resupplySaved;
      }),
    );

    resupply.totalCost = totalCost;
    resupply.productQuantity = productQuantity;
    resupply.products =
      await this.resupplyDetailsRepository.save(resupplyDetails);

    return this.resupplyRepository.save(resupply);
  }

  async delete(id: string): Promise<void> {
    const resupply = await this.resupplyRepository.findOne({
      where: { id },
      relations: ['products', 'branch'],
    });

    if (!resupply) {
      throw new NotFoundException(`Resupply with ID ${id} not found`);
    }

    for (const detail of resupply.products) {
      const product = await this.productRepository.findOne({
        where: { id: detail.product.id },
      });

      if (product) {
        product.stock += detail.quantity;
        await this.productRepository.save(product);
      }

      const productBranch = await this.productBranchRepository.findOne({
        where: { productId: detail.product.id, branchId: resupply.branch.id },
      });

      if (productBranch) {
        productBranch.stock -= detail.quantity;
        await this.productBranchRepository.save(productBranch);
      }
    }

    await this.resupplyDetailsRepository.delete({
      resupply: { id: resupply.id },
    });

    await this.resupplyRepository.delete(id);
  }
  async findAll(
    startDate?: Date,
    endDate?: Date,
    branchId?: string,
  ): Promise<Resupply[]> {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    if (end) {
      end.setDate(end.getDate() + 1);
    }

    const whereConditions: any = {};

    if (branchId) {
      whereConditions.branch = { id: branchId };
    }

    if (start && end) {
      whereConditions.createAt = Between(start, end);
    } else if (start) {
      whereConditions.createAt = MoreThanOrEqual(start);
    } else if (end) {
      whereConditions.createAt = LessThanOrEqual(end);
    }

    const resupplyList = await this.resupplyRepository.find({
      where: whereConditions,
      relations: ['products', 'products.product'],
    });

    return resupplyList;
  }

  async verifyProductByID(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    return product;
  }
}
