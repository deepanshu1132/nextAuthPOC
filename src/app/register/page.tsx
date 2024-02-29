'use client'
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { POST } from "../api/register/route";

const Register = () => {
  console.log('first')
  // const [x, sx] = useState(false)
  const [error, setError] = useState("");
  const router = useRouter();
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

    try{
      const res = await fetch('/api/register/', {
        method: "POST",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify({
          email, password
        })
      })
      console.log(res)
      if(res.status ===400){
        setError("This email is already registered")
      }
      if(res.status == 200){
        setError("")
        router.push("/login")
      }
    } catch(error){
      setError("Error, try again!")
      console.log(error)
    }

    // console.log(email, password)
    // sx(true)
    // e.target[0].value = ""
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="bg-[#212121] p-8 rounded shadow-md w-96">
        <h1 className="tex-4xl text-center font-semibold mb-8">Register</h1>
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
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Register</button>
          <p className="text-red-600 text-[16px] mb-4">{error && error}</p>
        </form>
        <div className="text-center text-gray-500 mt-4">- OR -</div>
        <Link className="block text-center text-blue-500 hover:underline mt-2" href="/login"> Login with Existing account</Link>
      </div>
    </div>
  );
};

export default Register;
