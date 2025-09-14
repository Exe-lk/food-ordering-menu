"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchEmployees } from "@/redux/features/employeeSlice";
import { RootState } from "@/redux/store";
import { logLogin } from "@/redux/features/loginLogSlice";

const Login = () => {
  // Local state for form fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  

  const dispatch = useDispatch<any>();
  const router = useRouter();
  const { employees, loading, error } = useSelector(
    (state: RootState) => state.employee
  );

  useEffect(() => {
    if (!employees.length) {
      dispatch(fetchEmployees());
    }
  }, [dispatch, employees.length]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
  
    const foundEmployee = employees.find(
      (emp) => emp.username === username && emp.password === password
    );

    if (foundEmployee) {
      localStorage.setItem("Name", foundEmployee.name);
      localStorage.setItem("empId", foundEmployee.empId);
      localStorage.setItem("role", foundEmployee.role);
      dispatch(
        logLogin({
          name: foundEmployee.name,
          username: foundEmployee.username,
          id: foundEmployee.empId,
        })
      );
      router.push("/order");
    } else {
      alert("Invalid credentials. Please check your username and password.");
      setIsLoading(false);

    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      {/* Outer container with fixed width/height to replicate pixel-perfect design */}
      <div className="relative w-[900px] h-[550px] bg-white rounded-[20px] shadow-lg overflow-hidden flex">
        {/* Left section with the background food image */}
        <div className="w-1/2 h-full relative">
          <img
            src="/assets/login.png"
            alt="Food Background"
            className="w-full h-full object-cover"
          />
          {/* Circular cutout in the top-left corner */}
          <div className="absolute top-4 left-4 w-8 h-8 bg-white rounded-full shadow"></div>
        </div>

        {/* Right section: the login form */}
        <div className="w-1/2 h-full flex flex-col justify-center px-10 py-8 bg-[#fefefe]">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Welcome Back!
          </h2>
          <p className="text-gray-600 mb-6 text-center text-sm">
            Please enter valid credentials to proceed
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 focus:ring-2 focus:ring-customGold focus:outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 focus:ring-2 focus:ring-customGold focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-customGold text-white font-bold py-2 rounded-md hover:bg-pink-600 transition duration-300"
            >
              {isLoading ? "Loading...":"Login"}
            </button>
            {error && <p className="text-red-500 text-center">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
