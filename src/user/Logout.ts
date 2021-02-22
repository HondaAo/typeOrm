
import { Ctx, Mutation, Resolver } from "type-graphql";
import { MyContext } from '../MyContext'

@Resolver()
export class LogoutResolver{
    @Mutation(() => Boolean)
    async logout(
        @Ctx() context: MyContext
    ): Promise<Boolean>{
        return new Promise(
            (res, rej) => 
            context.req.session!.destroy((err: Error ) => {
            if(err){
                console.log(err)
                return rej(false)
            }
            context.res.clearCookie('typeorm')
            return res(true)
        })
        )
    }
}