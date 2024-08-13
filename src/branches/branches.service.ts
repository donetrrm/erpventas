import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AddProductBranchDto,
  CreateBranchDto,
  UpdateBranchDto,
  UpdateProductBranchDto,
} from './dto/branches.dto';
import { Branch } from './entities/branch.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOperator, FindOptionsWhere, MoreThan, Repository } from 'typeorm';
import { ProductBranch } from 'src/products/entities/products-branch.entity';
import { ProductsService } from 'src/products/services/products.service';
import { FilterProducts } from 'src/products/dto/products.dto';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class BranchesService {
  constructor(
    @InjectRepository(Branch) private branchRepo: Repository<Branch>,
    @InjectRepository(ProductBranch)
    private productBranchRepo: Repository<ProductBranch>,
    private readonly productService: ProductsService,
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}
  async create(createBranchDto: CreateBranchDto) {
    const existBranch = await this.branchRepo.findOne({
      where: {
        name: CreateBranchDto.name,
      },
    });

    if (existBranch) {
      throw new BadRequestException('Branch already exists');
    }
    const newBranch = this.branchRepo.create(createBranchDto);
    return this.branchRepo.save(newBranch);
  }

  findAll() {
    return this.branchRepo.find();
  }

  async findOne(id: string) {
    const branch = await this.branchRepo.findOne({
      where: { id },
      relations: ['productsBranch', 'productsBranch.product'],
    });
    this.validationExist(branch, id);
    return branch;
  }

  async update(id: string, updateBranchDto: UpdateBranchDto) {
    const branch = await this.branchRepo.findOneBy({
      id,
    });
    this.validationExist(branch, id);
    this.branchRepo.merge(branch, updateBranchDto);
    return this.branchRepo.save(branch);
  }

  async remove(id: string) {
    const branch = await this.branchRepo.findOneBy({
      id,
    });
    this.validationExist(branch, id);
    await this.branchRepo.delete(id);
    return { message: `Branch with id: ${id} deleted succesfully` };
  }

  /**
   *
   * @param id id of relation table products_branch
   * @returns The product branch
   */
  async getProduct(id: string) {
    const productBranch = await this.productBranchRepo.findOneBy({ id });
    if (!productBranch) {
      throw new NotFoundException(`ProductBranch #${id} not found`);
    }
    return productBranch;
  }

  /**
   *
   * @param id ID of the branch to add product
   * @param productBranchDto data to save in relation table products_branch
   * @returns
   */
  async addProduct(id: string, productBranchDto: AddProductBranchDto) {
    const branch = await this.branchRepo.findOneBy({ id });
    const product = await this.productService.findOne(
      productBranchDto.product_id,
    );
    let productBranch = await this.productBranchRepo.findOneBy({
      branchId: branch.id,
      productId: product.id,
    });
    if (productBranch) {
      throw new BadRequestException('Product alreadys exists in this branch');
    }
    productBranch = this.productBranchRepo.create(productBranchDto);
    productBranch.branch = branch;
    productBranch.product = product;
    //implementar mapper to readProduct
    await this.productBranchRepo.save(productBranch);
    product.stock = product.stock - productBranchDto.stock;
    await this.productRepo.save(product);
    return productBranch;
  }

  /**
   * Update product of branch
   * @param id id of relation table products_branch
   * @param updateProductDto data to update in relation table products_branch
   * @returns
   */
  async updateProduct(id: string, updateProductDto: UpdateProductBranchDto) {
    const productBranch = await this.productBranchRepo.findOneBy({ id });
    const oldStock = productBranch.stock;
    const newStock = updateProductDto.stock;
    if(oldStock < newStock){
      const quantityToDiscount = newStock - oldStock;
      const product = await this.productRepo.findOneBy({id: productBranch.productId});
      const newProductStock = product.stock - quantityToDiscount;
      if(newProductStock >= 0){
        product.stock=newProductStock;
        await this.productRepo.save(product);
      }else{
        throw new BadRequestException("Insufficient stock")
      }
    }
    this.productBranchRepo.merge(productBranch, updateProductDto);
    if(updateProductDto.stock){

    }
    return this.productBranchRepo.save(productBranch);
  }

  /**
   *
   * @param id id of relation table products_branch
   * @returns message deleted
   */
  async deleteProduct(id: string) {
    await this.productBranchRepo.delete(id);
    return { message: `Product deleted succesfully` };
  }

  /**
   * Method to return products of branch with filter
   * @param id Id of branch
   * @param params Params optional filter
   * @returns products of branch
   */
  async getProductsBranch(id: string, params?: FilterProducts) {
    const where: FindOptionsWhere<ProductBranch> = {};
    const { categoryId, stock } = params;
    if (categoryId) {
      where.product = {
        category: {
          id: categoryId,
        },
      };
    }
    if(stock){
      where.stock = MoreThan(stock);
    }
    
    where.branchId = id;
    const products = await this.productBranchRepo.find({
      where
    });
    return products;
  }

  validationExist = (branch: Branch, id: string) => {
    if (!branch) {
      throw new NotFoundException(`Branch #${id} not found`);
    }
  };
}
