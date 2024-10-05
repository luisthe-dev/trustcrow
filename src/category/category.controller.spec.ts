import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

describe('CategoryController', () => {
  let controller: CategoryController, service: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        CategoryService,
        {
          provide: CategoryService,
          useValue: {
            create: () => {},
            findAll: () => {},
            findOne: () => {},
            update: () => {},
            remove: () => {},
            findChildren: () => {},
          },
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    service = await module.resolve<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('CategoryService', () => {
    const categoryData = {
      name: 'Category Name',
    };

    it('should create a new category', async () => {});
  });
});
