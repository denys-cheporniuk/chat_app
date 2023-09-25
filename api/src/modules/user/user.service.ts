import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from "@/modules/user/user.type";
import { PrismaService } from "@/modules/prisma/prisma.service";
import { UserErrors} from "@/modules/user/user.constants";

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  async getUserById(id: number): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      }
    });

    if (!user) {
      throw new BadRequestException(UserErrors.NotFound);
    }

    return user;
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
}
