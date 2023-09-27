import { Module } from '@nestjs/common';
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver } from "@nestjs/apollo";
import { join } from 'path';
import { ConfigService, ConfigModule } from "@nestjs/config";

import { AuthModule } from "@/modules/auth/auth.module";
import { AppController } from "@/modules/app/app.controller";
import { AppService } from "@/modules/app/app.service";
import { UserModule } from "@/modules/user/user.module";
import { RedisPubSub } from 'graphql-redis-subscriptions';
import {TokenService} from "@/modules/token/token.service";
import {AppErrors} from "@/modules/app/app.constants";

const pubSub = new RedisPubSub({
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    retryStrategy: (times) => {
      // retry strategy
      return Math.min(times * 50, 2000);
    },
  },
});

@Module({
  imports: [
    AuthModule,
    UserModule,
    GraphQLModule.forRootAsync({
      imports: [ConfigModule, AuthModule],
      inject: [ConfigService],
      driver: ApolloDriver,
      useFactory: async(
        configService: ConfigService,
        tokenService: TokenService,
      ) => ({
        installSubscriptionHandlers: true,
        playground: true,
        autoSchemaFile: join(process.cwd(), 'src/modules/schemas.gql'),
        sortSchema: true,
        subscriptions: {
          'graphql-ws': true,
          'subscriptions-transport-ws': true,
        },
        onConnect: (connectionParams) => {
          const token = tokenService.extractToken(connectionParams);

          if (!token) {
            throw new Error(AppErrors.TokenNotProvided);
          }

          const user = tokenService.validateToken(token);

          if (!user) {
            throw new Error(AppErrors.InvalidToken);
          }

          return { user };
        },
      })
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
