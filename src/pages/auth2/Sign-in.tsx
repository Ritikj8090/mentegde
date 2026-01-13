import { useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaUserGraduate } from "react-icons/fa";
import UserSignIn from "./User-sign-in";
import MentorSignIn from "./Mentor-sign-in";
import { LOGO_NAME } from "@/constant";

const LogIn = () => {
  const [state, setState] = useState<"user" | "mentor" | "">("");

  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col items-center px-4 sm:px-10 py-14">
      
      {/* Hero Header */}
      <section className="flex flex-col items-center text-center mb-16">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-5xl font-extrabold"
        >
          Welcome to <span className="text-yellow-50">{LOGO_NAME}</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-4 text-lg text-gray-300 max-w-2xl"
        >
          Join as a user to access your personalized learning dashboard 
          or sign in as a mentor to guide and manage students.
        </motion.p>
      </section>

      {/* Login Cards */}
      <section className="flex flex-col md:flex-row gap-10 justify-center items-stretch w-full md:w-[80%]">
        
        {/* User Card */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="flex-1 max-w-lg bg-gradient-to-b from-gray-800 to-black rounded-2xl p-10 shadow-lg hover:shadow-indigo-500/40 transition flex flex-col items-center"
        >
          {state === "user" ? (
            <UserSignIn />
          ) : (
            <>
              <FaUser className="text-6xl text-indigo-400" />
              <h2 className="text-3xl font-bold mt-4">User Login</h2>
              <p className="text-gray-400 text-center mt-2 flex-grow">
                Access your personalized learning dashboard and track progress.
              </p>
              <button
                onClick={() => setState("user")}
                className="mt-6 w-1/2 py-2 rounded-xl text-black bg-white hover:bg-yellow-50 transition font-semibold"
              >
                Login as a User
              </button>
            </>
          )}
        </motion.div>

        {/* Mentor Card */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="flex-1 max-w-lg bg-gradient-to-b from-gray-800 to-black rounded-2xl p-10 shadow-lg hover:shadow-indigo-500/40 transition flex flex-col items-center"
        >
          {state === "mentor" ? (
            <MentorSignIn />
          ) : (
            <>
              <FaUserGraduate className="text-6xl text-indigo-400" />
              <h2 className="text-3xl font-bold mt-4">Mentor Login</h2>
              <p className="text-gray-400 text-center mt-2 flex-grow">
                Access your mentorship portal and manage students with ease.
              </p>
              <button
                onClick={() => setState("mentor")}
                className="mt-6 w-1/2 py-2 rounded-xl text-black bg-white hover:bg-yellow-50 transition font-semibold"
              >
                Login as a Mentor
              </button>
            </>
          )}
        </motion.div>

      </section>
    </div>
  );
};

export default LogIn;
