import bcrypt from 'bcryptjs'
import { User } from "../entity/User";
import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class RegisterResolver{

    @Authorized()
    @Query(() => String)
    async helloWorld() {
      return "Hello World!";
    }
    
    @Mutation(() => User)
    async register(
        @Arg("firstname") firstname: string,
        @Arg("lastname") lastname: string,
        @Arg("email") email: string,
        @Arg("password") password: string
    ): Promise<User>{
       const hashedPassword = await bcrypt.hash(password, 12)
       const user = await User.create({
           firstname,
           lastname,
           email,
           password: hashedPassword
       }).save()

       return user;
    }
}