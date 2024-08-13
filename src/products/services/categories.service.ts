import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/categories.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) { }
  async create(createCategoryDto: CreateCategoryDto) {

    const existCategory = await this.categoryRepo.findOne({
      where: {
        name: createCategoryDto.name,
      },
    });

    if (existCategory) {
      throw new BadRequestException('Category already exists');
    }
    const newCategory = this.categoryRepo.create(createCategoryDto);
    return this.categoryRepo.save(newCategory);
  }

  async findAll() {
    return this.categoryRepo.find();
  }

  async findOne(id: string) {
    const category = await this.categoryRepo.findOneBy({
      id
    });
    this.validationExist(category, id);
    return category;
  }

  async update(id: string, changes: UpdateCategoryDto) {
    const category = await this.categoryRepo.findOneBy({
      id
    });
    this.validationExist(category, id);
    this.categoryRepo.merge(category, changes);
    return this.categoryRepo.save(category);
  }

  async remove(id: string) {
    const category = await this.categoryRepo.findOneBy({
      id
    });
    this.validationExist(category, id);
    await this.categoryRepo.delete(id);
    return { message: `Category with id: ${id} deleted succesfully` };
  }

  validationExist = (category: Category, id: string) => {
    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }
  };
}
