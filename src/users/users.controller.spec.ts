import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersController', () => {
  let usersController: UsersController;
  // let usersService: UsersService;
  // let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findMany: jest.fn().mockResolvedValue([
                {
                  id: '1',
                  firstName: 'John',
                  lastName: 'Doe',
                  email: 'john.doe@example.com',
                  phone: '1234567890',
                  username: 'johndoe',
                  password: 'password',
                  bookings: [],
                  payments: [],
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
                {
                  id: '2',
                  firstName: 'Jane',
                  lastName: 'Smith',
                  email: 'jane.smith@example.com',
                  phone: '0987654321',
                  username: 'janesmith',
                  password: 'password',
                  bookings: [],
                  payments: [],
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              ]),
              findUnique: jest.fn().mockResolvedValue({
                id: '1',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '1234567890',
                username: 'johndoe',
                password: 'password',
                bookings: [],
                payments: [],
                createdAt: new Date(),
                updatedAt: new Date(),
              }),
              create: jest.fn().mockResolvedValue({
                id: '3',
                firstName: 'Alice',
                lastName: 'Johnson',
                email: 'alice.johnson@example.com',
                phone: '1122334455',
                username: 'alicejohnson',
                password: 'password',
                bookings: [],
                payments: [],
                createdAt: new Date(),
                updatedAt: new Date(),
              }),
              update: jest.fn().mockResolvedValue({
                id: '1',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '1234567890',
                username: 'johndoe',
                password: 'password',
                bookings: [],
                payments: [],
                createdAt: new Date(),
                updatedAt: new Date(),
              }),
              delete: jest.fn().mockResolvedValue({
                id: '1',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '1234567890',
                username: 'johndoe',
                password: 'password',
                bookings: [],
                payments: [],
                createdAt: new Date(),
                updatedAt: new Date(),
              }),
            },
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    // usersService = module.get<UsersService>(UsersService);
    // prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const result = await usersController.getAll();

      expect(result).toHaveLength(2);
    });
  });

  describe('getUser', () => {
    it('should return an object of user', async () => {
      const result = await usersController.get('1');

      expect(result).toEqual({
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        username: 'johndoe',
        password: 'password',
        bookings: [],
        payments: [],
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });
});
