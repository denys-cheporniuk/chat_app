import { ObjectType, Field } from "@nestjs/graphql";
import { User } from "@/modules/user/user.type";

@ObjectType()
export class RegisterResponse {
  @Field(() => User, { nullable: true })
  user?: User
}

@ObjectType()
export class LoginResponse {
  @Field(() => User)
  user?: User
}
