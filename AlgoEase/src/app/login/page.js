"use client";

import React, { useState } from "react";
import { useEffect } from "react";
import { Github, ChevronRight } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";


const loginPage = () => {

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      console.log("✅ User is authenticated, redirecting...");
      router.push("/dashboard");
    }
  }, [status]);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const router = useRouter();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(formData);

  };

  const handleSubmit = async (e) => {
    

    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setApiError("");

    console.log("Logging in with:", formData); 

    const result = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
      callbackUrl: "/dashboard",
       // Prevent NextAuth from handling redirects
    });

    console.log("NextAuth response:", result);

    if (result?.error) {
      console.error("Login error:", result.error);
      setApiError(result.error);
    } else {
      console.log("Login successful, redirecting...");
      router.push(result?.url || "/dashboard");
    }

    setIsLoading(false);
  };


  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleGithubSignIn = () => {
    signIn("github", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full space-y-6 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Log in to AlgoEase</h2>
          <p className="mt-2 text-gray-600">Access your personalized dashboard</p>
        </div>

        {apiError && (
          <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">{apiError}</div>
        )}

        <div className="space-y-4">
          <button 
          
          disabled={isLoading} className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <FaGoogle className="w-5 h-5 mr-2" />
            Continue with Google
          </button>

          <button disabled={isLoading} className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <Github className="w-5 h-5 mr-2" />
            Continue with GitHub
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or log in with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : "Log In"}
              <ChevronRight className="ml-2 w-4 h-4" />
            </button>
          </form>
          <div className="text-center text-sm text-gray-500">
            Don't have an account? <Link href="/signup" className="text-blue-600 hover:underline">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default loginPage;