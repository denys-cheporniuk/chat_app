import { ObjectType, Field } from "@nestjs/graphql";

ObjectType()
export class BaseType {
  @Field()
  id: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
