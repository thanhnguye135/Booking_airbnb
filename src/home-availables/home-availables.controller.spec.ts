import { Test, TestingModule } from '@nestjs/testing';
import { HomeAvailablesController } from './home-availables.controller';

describe('HomeAvailablesController', () => {
  let controller: HomeAvailablesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomeAvailablesController],
    }).compile();

    controller = module.get<HomeAvailablesController>(HomeAvailablesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
