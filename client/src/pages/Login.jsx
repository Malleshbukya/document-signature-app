import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const navigate =
    useNavigate();

  const handleLogin =
    async (e) => {
      e.preventDefault();

      try {
        const response =
          await axios.post(
            "http://localhost:5000/api/auth/login",
            {
              email,
              password,
            }
          );

        localStorage.setItem(
          "token",
          response.data.token
        );

        alert(
          "Login Successful"
        );

        navigate("/");

      } catch (error) {

        console.log(error);

        alert(
          "Invalid Email or Password"
        );

      }
    };

  return (
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gradient-to-br
        from-blue-100
        via-white
        to-green-100
      "
    >
      <div
        className="
          bg-white
          p-10
          rounded-3xl
          shadow-2xl
          w-full
          max-w-md
        "
      >
        <h1
          className="
            text-4xl
            font-bold
            text-center
            text-blue-900
            mb-8
          "
        >
          Welcome Back 👋
        </h1>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >
          <div>
            <label
              className="
                block
                text-gray-700
                font-semibold
                mb-2
              "
            >
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              placeholder="Enter your email"
              className="
                w-full
                border
                border-gray-300
                rounded-xl
                px-4
                py-3
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
              required
            />
          </div>

          <div>
            <label
              className="
                block
                text-gray-700
                font-semibold
                mb-2
              "
            >
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              placeholder="Enter password"
              className="
                w-full
                border
                border-gray-300
                rounded-xl
                px-4
                py-3
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
              required
            />
          </div>

          <button
            type="submit"
            className="
              w-full
              bg-blue-600
              hover:bg-blue-700
              text-white
              py-3
              rounded-xl
              font-semibold
              transition
              duration-300
            "
          >
            Login
          </button>
        </form>

        <p
          className="
            text-center
            mt-6
            text-gray-600
          "
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            className="
              text-green-600
              font-semibold
              hover:underline
            "
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;