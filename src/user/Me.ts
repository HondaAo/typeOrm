import { User } from "../entity/User";
import { Ctx, Resolver, Query } from "type-graphql";
import { MyContext } from '../MyContext'

@Resolver()
export class MeResolver{
    @Query(() => User, { nullable: true })
    async me(
    @Ctx() context: MyContext
    ){
        if(!context.req.session.id){
            return null
        }

        return User.findOne(context.req.session.userId)
    }
}