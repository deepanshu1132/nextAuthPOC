"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";

const Login = () => {
  const [error, setError] = useState("");
  const router = useRouter();
  const session = useSession();

  useEffect(()=>{
    if(session?.status ==="authenticated"){
      router.replace('/dashboard')
    }
  }, [session, router])

  const isValidEmail = (email:string)=>{
    const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/
    console.log(emailRegex.test(email))
    return emailRegex.test(email);
  }

  const handleSubmit = async (e: any)=>{
    e.preventDefault();
    const email = e.target[0].value
    const password = e.target[1].value

    if(!isValidEmail(email)){
      setError("Email is invalid")
      return;
    }
    if(!password || password.length< 8){
      setError("Password is not valid")
      return;
    }

    const res = await signIn("credentials",{
      redirect:false,
      email,
      password
    })

    if(res?.error){
      setError("Invalid email or password")
    } else{
      setError("")
    }

    // console.log(email, password)
    // sx(true)
    // e.target[0].value = ""
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="bg-[#212121] p-8 rounded shadow-md w-96">
        <h1 className="tex-4xl text-center font-semibold mb-8">Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className=" w-full border border-gray-300 text-black px-3 py-2 mb-4 rounded focus:outline-none focus:border-blue-400 focus:text-black"
            placeholder="Email"
            required
          />
          {/* {x && <p>dsfads</p>} */}
          <input
            type="password"
            className=" w-full border border-gray-300 text-black px-3 py-2 mb-4 rounded focus:outline-none focus:border-blue-400 focus:text-black"
            placeholder="Password"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
          <p className="text-red-600 text-[16px] mb-4">{error && error}</p>
        </form>
        <button className="w-full bg-black text-white- py-2 rounded hover:bg-gray-800" onClick={()=>signIn("github")}>Sign In with Github</button>
        <div className="text-center text-gray-500 mt-4">- OR -</div>
        <Link
          className="block text-center text-blue-500 hover:underline mt-2"
          href="/login"
        >
          {" "}
          Register here
        </Link>
      </div>
    </div>
  );
};

export default Login;
