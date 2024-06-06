import { UserRepository } from '../repositories/user.repository';
import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(username: string, password: string) {
    const createdUser = await this.userRepository.findByUsername(username);
    if (createdUser) {
      // Duplicate User
      throw new ConflictException('This User Already Registered!');
    }
    const hashedPassword = await this.hashPassword(password);
    let user = new User(null, username, hashedPassword, []);

    user = await this.userRepository.create(user);
    const newTokens = await this.getTokens(user.id);
    // We Can Use Sessions (sid) For Manage Devices...
    return {
      user: user,
      tokens: { ...newTokens },
    };
  }

  async login(username: string, password: string) {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      // User NotFound
      throw new ForbiddenException(
        'Access Denied, Username Or Password Is Wrong!',
      );
    }

    const passIsTrue = await this.comparePassword(password, user.password);
    if (!passIsTrue) {
      // Password is wrong
      throw new ForbiddenException(
        'Access Denied, Username Or Password Is Wrong!',
      );
    }
    // We Can Use Sessions (sid) For Manage Devices...
    const newTokens = await this.getTokens(user.id);
    return {
      user: user,
      tokens: { ...newTokens },
    };
  }

  async findById(id: string) {
    return await this.userRepository.findById(id);
  }

  async refreshTokens(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new ForbiddenException('Access Denied');
    }
    return await this.getTokens(userId);
  }

  private async getTokens(userId: string) {
    const tokenPayload = {
      sub: userId,
    };
    const [access, refresh] = await Promise.all([
      this.jwtService.signAsync(tokenPayload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '1d',
      }),
      this.jwtService.signAsync(
        {
          sub: userId,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);
    return {
      access,
      refresh,
    };
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  private async comparePassword(
    password: string,
    hashedPass: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPass);
  }
}
