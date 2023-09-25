import { ObjectType, Field } from "@nestjs/graphql";
import {BaseType} from "../baseType";

ObjectType()
export class User extends BaseType {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  fullname: string;

  @Field({ nullable: true })
  avatarUrl?: string;
}
