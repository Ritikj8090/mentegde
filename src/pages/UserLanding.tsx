import { motion } from "framer-motion";
import { FaUserGraduate, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const UserLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col">
      {/* Navbar */}

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center py-14 px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-5xl font-extrabold"
        >
          Welcome to <span className="text-yellow-50">MentEdge</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-4 text-lg text-gray-300 max-w-2xl"
        >
          Join as a user to access your personalized learning dashboard or sign
          up as a mentor to guide and manage students.
        </motion.p>
      </section>

      {/* Signup Options */}
      {/* Signup Options */}
      {/* Signup Options */}
      <section className="flex flex-col md:flex-row gap-20 justify-center items-stretch px-6 pb-20">
        {/* User Card */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="flex-1 max-w-lg bg-gradient-to-b from-gray-800 to-black rounded-2xl p-10 shadow-lg hover:shadow-indigo-500/40 transition flex flex-col"
        >
          <div className="flex flex-col items-center gap-6 flex-grow">
            <FaUser className="text-6xl text-indigo-400" />
            <h2 className="text-3xl font-bold">User SignUp</h2>
            <p className="text-gray-400 text-center flex-grow text-lg">
              Access your personalized learning dashboard and track progress.
            </p>
            <button
              onClick={() => navigate("/naukri")}
              className=" w-1/2 py-2 rounded-xl text-black bg-white hover:bg-yellow-50 transition font-semibold "
            >
              SignUp as a User
            </button>
          </div>
        </motion.div>

        {/* Mentor Card */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="flex-1 max-w-lg bg-gradient-to-b from-gray-800 to-black rounded-2xl p-10 shadow-lg hover:shadow-indigo-500/40 transition flex flex-col"
        >
          <div className="flex flex-col items-center gap-6 flex-grow">
            <FaUserGraduate className="text-6xl text-indigo-400" />
            <h2 className="text-3xl font-bold">Mentor SignUp</h2>
            <p className="text-gray-400 text-center flex-grow text-lg">
              Access your mentorship portal and manage your students with ease.
            </p>
            <button
              onClick={() => navigate("/mentor")}
              className=" w-1/2 py-2 rounded-xl text-black bg-white hover:bg-yellow-50 transition font-semibold "
            >
              SignUp as a Mentor
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default UserLanding;
