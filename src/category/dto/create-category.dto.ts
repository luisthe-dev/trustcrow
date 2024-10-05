import { Category } from '../entities/category.entity';

export class CreateCategoryDto {
  name: string;
  parent_category?: Category;
}
