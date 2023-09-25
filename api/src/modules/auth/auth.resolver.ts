import {Mutation, Query, Resolver, Args, Context} from '@nestjs/graphql';
import {LoginDto, RegisterDto} from "@/modules/auth/dto";
import {Request, Response} from "express";
import {BadRequestException} from "@nestjs/common";
import {AuthErrors} from "@/modules/auth/auth.constants";
import {AuthService} from "@/modules/auth/auth.service";

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
  ) {
  }

  @Mutation(() => String)
  async register(
    @Args('registerInput') registerDto: RegisterDto,
    @Context() context: { res: Response },
  ) {
    if(registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException(AuthErrors.PasswordsAreNotTheSame);
    }

    const { user } = await this.authService.register(registerDto, context.res);

    return { user };
  }

  @Mutation(() => String)
  async login(
    @Args('loginInput') loginDto: LoginDto,
    @Context() context: { res: Response },
  ) {
    return this.authService.login(loginDto, context.res);
  }

  @Mutation(() => String)
  async logout(
    @Context() context: { res: Response },
  ) {
    return this.authService.logout(context.res);
  }

  @Mutation(() => String)
  async refreshToken(
    @Context() context: { req: Request, res: Response },
  ) {
    try {
      return this.authService.refreshToken(context.req, context.res);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
