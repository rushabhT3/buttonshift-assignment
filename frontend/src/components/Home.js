import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-4">
          Welcome to WorkBoards!
        </h1>
        <div className="flex justify-between">
          <button
            onClick={() => navigate("/signup")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Sign Up
          </button>
          <button
            onClick={() => navigate("/signin")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
