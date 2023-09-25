import {
  BadRequestException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';

import { PrismaService } from "@/modules/prisma/prisma.service";
import { UserService } from "@/modules/user/user.service";
import { User } from "@/modules/user/user.type";
import { LoginDto, RegisterDto } from "@/modules/auth/dto";
import { AuthErrors, TOKEN_EXPIRES_IN } from "@/modules/auth/auth.constants";


@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies['refresh_token'];

    if (!refreshToken) {
      throw new UnauthorizedException(AuthErrors.RefreshTokenNotFound);
    }

    let payload;

    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET')
      })
    } catch (error) {
      throw new UnauthorizedException(AuthErrors.InvalidOrExpiredRefreshToken);
    }

    const user = await this.userService.findUserById(payload.sub);

    if (!user) {
      throw new BadRequestException(AuthErrors.UserNotFound);
    }

    const expiresIn = TOKEN_EXPIRES_IN;
    const expiration = Math.floor(Date.now() / 1000) + expiresIn;
    const accessToken = this.jwtService.sign(
      { ...payload, exp: expiration },
      {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET')
      }
    );

    res.cookie('access_token', accessToken, { httpOnly: true });

    return accessToken;
  }

  private issueTokens(user: User, res: Response) {
    const payload = { userName: user.fullname, sub: user.id };

    const accessToken = this.jwtService.sign(
      { ...payload },
      {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: '150sec',
      }
    );

    const refreshToken = this.jwtService.sign(
      { ...payload },
      {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: '7d',
      }
    );

    res.cookie(
      'access_token',
      accessToken,
      { httpOnly: true },
    );

    res.cookie(
      'refresh_token',
      refreshToken,
      { httpOnly: true },
    );

    return { user };
  }

  async validateUser(loginDto: LoginDto) {
    const user = await this.userService.findUserByEmail(loginDto.email);
    let comparePasswords;

    if (user) {
      comparePasswords = await bcrypt.compare(
        loginDto.password, user.password,
      );
    }

    return user && comparePasswords
      ? user
      : null;
  }

  async register(registerDto: RegisterDto, res: Response) {
    const existingUser = await this.userService.findUserByEmail(registerDto.email);

    if (existingUser) {
      throw new BadRequestException(AuthErrors.EmailAlreadyInUse);
    }

    const user = await this.userService.createUser({
      fullname: registerDto.fullname,
      email: registerDto.email,
      password: registerDto.password,
    });

    return this.issueTokens(user, res);
  }

  async login(loginDto: LoginDto, res: Response) {
    const user = await this.validateUser(loginDto);

    if (!user) {
      throw new BadRequestException(AuthErrors.InvalidCredentials);
    }

    return this.issueTokens(user, res);
  }

  async logout(res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return 'Successfully logged out';
  }
}
