import { Resolver, Query, Context, Mutation, Args } from '@nestjs/graphql';
import { User } from './user.type';
import { Request } from 'express';
import { UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from '@/modules/auth/graphql-auth.guard';
import { UserService } from "@/modules/user/user.service";
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { UserEntity } from "@/modules/user/user.entity";


@Resolver()
export class UserResolver {
  constructor(
    private readonly userService: UserService
  ) {}

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => String)
  async updateUser(
    @Args('fullname') fullname: string,
    @Args('file', { type: () => GraphQLUpload, nullable: true })
      file: GraphQLUpload.FileUpload,
    @Context() context: { req: Request },
  ) {
    const userEntity = new UserEntity();

    const imageUrl = file
      ? await userEntity.storeImageAndGetUrl(file)
      : null;

    const userId = context.req.user.sub;

    return this.userService.updateUser(userId, {
      fullname,
      avatarUrl: imageUrl,
    })
  }

  @Query(() => String)
  async hello() {
    return 'hello';
  }
}
