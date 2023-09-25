import { Module } from '@nestjs/common';
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver } from "@nestjs/apollo";
import { join } from 'path';
import { ConfigService, ConfigModule } from "@nestjs/config";

import { AuthModule } from "@/modules/auth/auth.module";
import { AppController } from "@/modules/app/app.controller";
import { AppService } from "@/modules/app/app.service";
import { UserModule } from "@/modules/user/user.module";

@Module({
  imports: [
    AuthModule,
    UserModule,
    GraphQLModule.forRootAsync({
      imports: [ConfigModule, AuthModule],
      inject: [ConfigService],
      driver: ApolloDriver,
      useFactory: async(configService: ConfigService,) => ({
        playground: true,
        autoSchemaFile: join(process.cwd(), 'src/modules/schemas.gql'),
        sortSchema: true,
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
