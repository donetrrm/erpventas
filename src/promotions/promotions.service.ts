import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promotion } from './entities/promotion.entity';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { PromotionDetails } from './entities/promotion-details.entity';
import { Product } from 'src/products/entities/product.entity';
import { Category } from 'src/products/entities/category.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { ProductBranch } from 'src/products/entities/products-branch.entity';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

@Injectable()
export class PromotionService {
  constructor(
    @InjectRepository(Promotion)
    private readonly promotionRepository: Repository<Promotion>,
    @InjectRepository(PromotionDetails)
    private readonly promotionDetailsRepository: Repository<PromotionDetails>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    @InjectRepository(ProductBranch)
    private readonly productBranchRepository: Repository<ProductBranch>,
  ) {}

  async create(createPromotionDto: CreatePromotionDto): Promise<Promotion> {
    const { categoryId, branchId, products, sku, ...promotionData } =
      createPromotionDto;

    const existingPromotion = await this.promotionRepository.findOne({
      where: { sku },
    });
    if (existingPromotion) {
      throw new ConflictException(
        `Promotion with SKU '${sku}' already exists.`,
      );
    }
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    const branch = await this.branchRepository.findOne({
      where: { id: branchId },
    });

    if (!category || !branch) {
      throw new NotFoundException('Category or Branch not found');
    }

    const promotion = this.promotionRepository.create({
      ...promotionData,
      sku,
      category,
      branch,
    });

    const savedPromotion = await this.promotionRepository.save(promotion);

    const promotionDetails = products.map(async (productDetail) => {
      const product = await this.productRepository.findOne({
        where: { id: productDetail.productId },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      const productBranch = await this.productBranchRepository.findOne({
        where: { productId: product.id, branchId: branch.id },
      });

      if (!productBranch) {
        throw new NotFoundException(
          `Product ${product.name} not found in branch ${branch.name}`,
        );
      }

      const detail = this.promotionDetailsRepository.create({
        ...productDetail,
        promotion: savedPromotion,
        product,
      });

      return this.promotionDetailsRepository.save(detail);
    });

    await Promise.all(promotionDetails);

    return savedPromotion;
  }

  async getAll(): Promise<Promotion[]> {
    return this.promotionRepository.find({
      relations: [
        'category',
        'branch',
        'promotionDetails',
        'promotionDetails.product',
      ],
    });
  }

  async getByBranch(branchId: string): Promise<Promotion[]> {
    const branch = await this.branchRepository.findOne({
      where: { id: branchId },
    });

    if (!branch) {
      throw new NotFoundException('Branch not found');
    }

    return this.promotionRepository
      .createQueryBuilder('promotion')
      .leftJoinAndSelect('promotion.branch', 'branch')
      .leftJoinAndSelect('promotion.promotionDetails', 'promotionDetails')
      .leftJoinAndSelect('promotionDetails.product', 'product')
      .where('branch.id = :branchId', { branchId })
      .getMany();
  }

  async updatePromotion(id: string, updatePromotionDto: UpdatePromotionDto) {
    const { categoryId, branchId, products, ...updateData } =
      updatePromotionDto;

    const promotion = await this.promotionRepository.findOne({
      where: { id },
      relations: ['promotionDetails', 'category', 'branch'],
    });

    if (!promotion) {
      throw new NotFoundException(`Promotion with ID ${id} not found.`);
    }

    if (categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: categoryId },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      promotion.category = category;
    }

    if (branchId) {
      const branch = await this.branchRepository.findOne({
        where: { id: branchId },
      });
      if (!branch) {
        throw new NotFoundException('Branch not found');
      }
      promotion.branch = branch;
    }

    if (products && products.length > 0) {
      await this.promotionDetailsRepository.delete({
        promotion: { id: promotion.id },
      });

      const newPromotionDetails = await Promise.all(
        products.map(async (productDetail) => {
          console.log('product', productDetail.productId);

          const product = await this.productRepository.findOne({
            where: { id: productDetail.productId },
          });

          if (!product) {
            throw new NotFoundException('Product not found');
          }

          const productBranch = await this.productBranchRepository.findOne({
            where: {
              productId: product.id,
              branchId: branchId || promotion.branch.id,
            },
          });

          if (!productBranch) {
            throw new NotFoundException(
              `Product ${product.name} not found in branch ${
                branchId || promotion.branch.id
              }`,
            );
          }

          const detail = this.promotionDetailsRepository.create({
            ...productDetail,
            promotion,
            product,
          });

          return this.promotionDetailsRepository.save(detail);
        }),
      );

      promotion.promotionDetails = newPromotionDetails;
    }

    this.promotionRepository.merge(promotion, updateData);

    return await this.promotionRepository.save(promotion);
  }
}
