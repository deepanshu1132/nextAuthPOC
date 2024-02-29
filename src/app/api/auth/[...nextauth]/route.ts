import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { Account, User as AuthUser } from "next-auth"
import bcrypt from "bcryptjs"
import connect from "@/utils/db"
import User from "@/models/User"
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
        id:"credentials",
        name:"Credentials",
        credentials:{
            email:{label:"Email", type:"text"},
            password:{label:"Password", type:"text"}
        },
        async authorize(credentials :any){
            await connect();
            try{
                const user = await User.findOne({email: credentials.email})
                if(user){
                    const isPasswordCorrect = await bcrypt.compare(
                        credentials.password,
                        user.password
                    )
                    if(isPasswordCorrect){
                        return user;
                    }
                }
            }catch(err:any){
                throw new Error(err)
            }
        }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID ??"",
      clientSecret: process.env.GITHUB_SECRET??"",
    }),
    // ...add more providers here
  ],

  callbacks:{
    async signIn({user, account}:{ user:AuthUser, account: Account}){
        if(account?.provider=="credentials"){
            return true;
        }
        if(account?.provider == "github"){
            await connect();
            try{
                const existingUser = await User.findOne({email: user.email})
                if(!existingUser){
                    const newUser = new User({email: user.email})
                    await newUser.save()
                    return true;
                }
                return true;
            }catch(err){
                console.log("Error saving user", err);
                return false;
            }
        }
    }
  }
}
export default NextAuth(authOptions)
export const handler = NextAuth(authOptions);
export {handler as GET, handler as POST}