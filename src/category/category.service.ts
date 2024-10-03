import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindCategoryChildren } from './dto/find-category-children.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    if (typeof createCategoryDto.parent_category == 'number') {
      const category = await this.findOne(createCategoryDto.parent_category);
      if (!category)
        throw new NotFoundException(
          `Invalid Parent Category Id: ${createCategoryDto.parent_category}`,
        );
    }

    const category = this.categoryRepository.create(createCategoryDto);

    return await this.categoryRepository.save(category);
  }

  async findAll() {
    return await this.categoryRepository.find({
      order: { id: 'DESC' },
      relations: { parent_category: true },
    });
  }

  async findOne(id: number) {
    return await this.categoryRepository.findOne({
      where: { id },
      relations: { parent_category: true },
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    if (!category) throw new NotFoundException('Invalid Category Id');

    Object.assign(category, updateCategoryDto);

    return this.categoryRepository.save(category);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    if (!category) throw new NotFoundException('Invalid Category Id');

    return await this.categoryRepository.remove(category);
  }

  async findChildren(id: number) {
    const categoryNode = await this.categoryRepository.findOne({
      where: { id },
    });

    const childrenNodes = await this.categoryRepository.find({
      where: { parent_category: categoryNode },
    });

    const categoryChildren: FindCategoryChildren[] = [];

    await Promise.all(
      childrenNodes.map(async (childNode) =>
        categoryChildren.push(await this.findChildren(childNode.id)),
      ),
    );

    const categoryResponse: FindCategoryChildren = {
      id: categoryNode.id,
      name: categoryNode.name,
      children: categoryChildren,
    };

    return categoryResponse;
  }
}
