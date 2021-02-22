import bcrypt from 'bcryptjs'
import { User } from "../entity/User";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { MyContext } from '../MyContext'

@Resolver()
export class LoginResolver{
    @Mutation(() => User, { nullable: true })
    async login(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() context: MyContext
    ): Promise<User | null>{
        const user = await User.findOne({ where: { email }});
        if(!user){
            return null
        }
        const valid = await bcrypt.compare(password, user.password)

        if(!valid){
            return null
        }

        context.req.session.userId = user.id;
 
        return user;
    }
}