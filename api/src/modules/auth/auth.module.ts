import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import {JwtService} from "@nestjs/jwt";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {UserService} from "@/modules/user/user.service";

@Module({
  providers: [
    AuthResolver,
    AuthService,
    JwtService,
    PrismaService,
    UserService,
  ]
})
export class AuthModule {}
