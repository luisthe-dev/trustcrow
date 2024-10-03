import { Category } from '../entities/category.entity';

export class FindCategoryChildren {
  id: number;
  name: string;
  children: FindCategoryChildren[];
}
