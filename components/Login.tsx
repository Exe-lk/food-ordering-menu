"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchEmployees } from "@/redux/features/employeeSlice";
import { RootState } from "@/redux/store";

const Login = () => {
  // Local state for form fields
  const [selectedRole, setSelectedRole] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // Local state for login loading
  const [loginLoading, setLoginLoading] = useState(false);

  const dispatch = useDispatch<any>();
  const router = useRouter();
  const { employees, loading, error } = useSelector((state: RootState) => state.employee);

  useEffect(() => {
    if (!employees.length) {
      dispatch(fetchEmployees());
    }
  }, [dispatch, employees.length]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginLoading(true); // Set loading to true when login starts

    // Check the credentials synchronously (simulate async behavior if needed)
    const foundEmployee = employees.find(
      (emp) =>
        emp.username === username &&
        emp.password === password &&
        emp.role === selectedRole
    );

    if (foundEmployee) {
      localStorage.setItem("Name", foundEmployee.name);
      localStorage.setItem("empId", foundEmployee.empId);
      localStorage.setItem("role", foundEmployee.role)
      router.push("/order");
    } else {
      alert("Invalid credentials. Please check your username, password, and role.");
    }
    setLoginLoading(false); 
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="relative flex w-full max-w-4xl bg-white shadow-2xl rounded-3xl overflow-hidden">
        {/* Background Image Section */}
        <div
          className="hidden md:block md:w-1/2 bg-cover bg-center relative"
          style={{
            backgroundImage: 'url("/assets/login.png")',
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        ></div>

        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-blue-900 mb-4 text-center">
            Welcome Back!
          </h2>
          <p className="text-gray-600 mb-6 text-center text-sm">
            Please select your role and enter valid credentials to proceed
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                required
              >
                <option value="" disabled>
                  Please Select Your Role
                </option>
                <option value="Kitchen">Kitchen</option>
                <option value="Admin">Admin</option>
                <option value="Cashier">Cashier</option>
                <option value="Waiter">Waiter</option>
              </select>
            </div>
            <div>
              <input
                type="text"
                placeholder="Username"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-900 text-white font-bold py-2 rounded-md hover:bg-blue-800 transition duration-300"
              disabled={loginLoading || loading}
            >
              {loginLoading ? "Loading..." : "Login"}
            </button>
            {error && <p className="text-red-500 text-center">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
