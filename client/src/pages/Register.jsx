import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const navigate =
    useNavigate();

  const handleRegister =
    async (e) => {

      e.preventDefault();

      try {

        await axios.post(
            "https://document-signature-app-lgxn.onrender.com/api/auth/register",

          {
            name,
            email,
            password,
          }
        );

        alert(
          "Registration Successful"
        );

        navigate("/login");

      } catch (error) {

        console.log(error);

        alert(
          "Registration Failed"
        );

      }

    };

  return (

    <div className="min-h-screen bg-gray-100 flex items-center justify-center">

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Register
        </h1>

        <form
          onSubmit={
            handleRegister
          }
          className="space-y-4"
        >

          <div>

            <label className="block text-gray-700 font-medium mb-2">
              Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              className="
                w-full
                border
                rounded-lg
                px-4
                py-2
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
              required
            />

          </div>

          <div>

            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className="
                w-full
                border
                rounded-lg
                px-4
                py-2
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
              required
            />

          </div>

          <div>

            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="
                w-full
                border
                rounded-lg
                px-4
                py-2
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
              bg-green-600
              hover:bg-green-700
              text-white
              font-semibold
              py-3
              rounded-lg
              transition
            "
          >
            Register
          </button>

        </form>

        <p className="text-center text-gray-500 mt-4">
          Already have an account?
          <span
            className="
              text-blue-600
              ml-1
              cursor-pointer
              hover:underline
            "
            onClick={() =>
              navigate("/login")
            }
          >
            Login
          </span>
        </p>

      </div>

    </div>

  );

}

export default Register;