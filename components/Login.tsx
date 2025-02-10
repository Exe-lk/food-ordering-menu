import React from "react";

const Login = () => {
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

        {/* Login Form Section */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-blue-900 mb-4 text-center">
            Welcome Back!
          </h2>
          <p className="text-gray-600 mb-6 text-center text-sm">
            Please select your role and enter valid credentials to proceed
          </p>

          <form className="space-y-4">
            <div>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                defaultValue=""
              >
                <option value="" disabled>
                  Please Select Your Role
                </option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="manager">Manager</option>
              </select>
            </div>
            <div>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-900 text-white font-bold py-2 rounded-md hover:bg-blue-800 transition duration-300"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
