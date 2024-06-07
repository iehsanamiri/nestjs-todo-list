import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../src/domain/repositories/user.repository';
import { AppModule } from '../src/app.module';
import { User } from '../src/domain/entities/user.entity';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userRepository: UserRepository;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userRepository = moduleFixture.get<UserRepository>('UserRepository');
    jwtService = moduleFixture.get<JwtService>(JwtService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user', async () => {
      jest.spyOn(userRepository, 'findByUsername').mockResolvedValue(null);
      jest
        .spyOn(userRepository, 'create')
        .mockResolvedValue(new User('1', 'testuser', 'hashedPassword', []));
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('testToken');

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ username: 'testuser', password: 'password' })
        .expect(201);

      expect(response.body).toEqual({
        user: {
          id: '1',
          username: 'testuser',
          password: 'hashedPassword',
          todoLists: [],
        },
        tokens: { access: 'testToken', refresh: 'testToken' },
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      jest
        .spyOn(userRepository, 'findByUsername')
        .mockResolvedValue(new User('1', 'testuser', 'hashedPassword', []));

      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ username: 'testuser', password: 'password' })
        .expect(409);
    });
  });

  describe('/auth/login (POST)', () => {
    it('should login a user', async () => {
      jest
        .spyOn(userRepository, 'findByUsername')
        .mockResolvedValue(new User('1', 'testuser', 'hashedPassword', []));
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('testToken');

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'testuser', password: 'password' })
        .expect(200);

      expect(response.body).toEqual({
        user: {
          id: '1',
          username: 'testuser',
          password: 'hashedPassword',
          todoLists: [],
        },
        tokens: { access: 'testToken', refresh: 'testToken' },
      });
    });

    it('should throw ForbiddenException if username is incorrect', async () => {
      jest.spyOn(userRepository, 'findByUsername').mockResolvedValue(null);

      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'wronguser', password: 'password' })
        .expect(403);
    });

    it('should throw ForbiddenException if password is incorrect', async () => {
      jest
        .spyOn(userRepository, 'findByUsername')
        .mockResolvedValue(new User('1', 'testuser', 'hashedPassword', []));

      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'testuser', password: 'wrongpassword' })
        .expect(403);
    });
  });
});
