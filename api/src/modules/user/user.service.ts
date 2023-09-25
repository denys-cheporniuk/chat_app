import { Injectable } from '@nestjs/common';
import { User } from "@/modules/user/user.type";
import { PrismaService } from "@/modules/prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  async findUserById(id: number): Promise<User> {
    return this.prismaService.user.findUnique({
      where: {
        id,
      }
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: {
        email,
      }
    });
  }

  async createUser(
    values: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<User> {
    return this.prismaService.user.create({
      data: {
        ...values,
      }
    })
  }

  async updateUser(
    userId: number,
    values: Partial<Omit<User, 'id' >>,
  ): Promise<User> {
    const user = await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        ...values,
      }
    })

    return user;
  }
}
