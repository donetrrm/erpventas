import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateProductDto,
  FilterProducts,
  UpdateProductDto,
} from '../dto/products.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import {
  FindManyOptions,
  FindOptions,
  FindOptionsWhere,
  Like,
  Repository,
} from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) {}
  async create(data: CreateProductDto) {
    const existProduct = await this.productRepo.findOneBy({ name: data.name });
    if (existProduct) {
      throw new BadRequestException('Product already exists');
    }
    const newProduct = this.productRepo.create(data);
    const category = await this.categoryRepo.findOneBy({
      id: data.category_id,
    });
    newProduct.category = category;
    await this.productRepo.save(newProduct);
    return newProduct;
  }

  async findAll(params?: FilterProducts) {
    const where: FindOptionsWhere<Product> = {};
    const take = params.limit;
    const skip = (params.offset - 1) * take;
    const { categoryId } = params;
    const { product_name } = params;
    if (categoryId) {
      where.category = { id: categoryId };
    }
    if (product_name) {
      where.name = Like(`%${product_name}%`);
    }
    const [result, total] = await this.productRepo.findAndCount({
      where,
      relations: ['category'],
    });
    return {
      data: result,
      count: total,
    };
  }

  async findOne(id: string) {
    const product = await this.productRepo.findOneBy({ id });
    this.validationExist(product, id);
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepo.findOneBy({ id });
    this.validationExist(product, id);
    this.productRepo.merge(product, updateProductDto);
    if (updateProductDto.category_id) {
      const category = await this.categoryRepo.findOneBy({
        id: updateProductDto.category_id,
      });
      product.category = category;
    }
    return this.productRepo.save(product);
  }

  async remove(id: string) {
    const product = await this.productRepo.findOneBy({ id });
    this.validationExist(product, id);
    await this.productRepo.delete(id);
    return { message: `Product with id: ${id} deleted succesfully` };
  }

  validationExist = (product: Product, id: string) => {
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
  };
}
