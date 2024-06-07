import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepository } from '../repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConflictException } from '@nestjs/common';
import { User } from '../entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'UserRepository',
          useValue: {
            findByUsername: jest.fn(),
            create: jest.fn(),
            findById: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>('UserRepository');
  });

  describe('register', () => {
    it('should throw ConflictException if user already exists', async () => {
      jest
        .spyOn(userRepository, 'findByUsername')
        .mockResolvedValue(new User('1', 'test', 'hashedPassword', []));

      await expect(service.register('test', 'password')).rejects.toThrow(
        ConflictException,
      );
    });

    it('should create a new user and return tokens', async () => {
      jest.spyOn(userRepository, 'findByUsername').mockResolvedValue(null);
      jest
        .spyOn(userRepository, 'create')
        .mockResolvedValue(new User('1', 'test', 'hashedPassword', []));

      const result = await service.register('test', 'password');

      expect(result).toEqual({
        user: new User('1', 'test', 'hashedPassword', []),
        tokens: {},
      });
    });
  });

  describe('findById', () => {
    it('should return user by id', async () => {
      const user = new User('1', 'test', 'hashedPassword', []);
      jest.spyOn(userRepository, 'findById').mockResolvedValue(user);

      expect(await service.findById('1')).toEqual(user);
    });
  });
});
