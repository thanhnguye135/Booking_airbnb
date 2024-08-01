import { Test, TestingModule } from '@nestjs/testing';
import { HomeAvailablesService } from './home-availables.service';

describe('HomeAvailablesService', () => {
  let service: HomeAvailablesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HomeAvailablesService],
    }).compile();

    service = module.get<HomeAvailablesService>(HomeAvailablesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
