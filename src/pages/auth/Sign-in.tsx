import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FaUser, FaUserGraduate } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LOGO_NAME } from "@/constant";

const SignIn = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-10 h-full">
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
          Join as a user to access your personalized learning dashboard or sign
          in as a mentor to guide and manage students.
        </motion.p>
      </section>

      {/* Signup Cards */}
      <section className=" grid grid-cols-2 gap-4">
        {/* User Card */}
        <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50 hover:shadow-indigo-500/40 transition ease-in-out duration-200">
          <CardContent>
            <div className="flex flex-col justify-center items-center h-80">
              <div className=" flex flex-col items-center space-y-3">
                <FaUser className="text-7xl text-indigo-400" />
                <h2 className="text-3xl font-bold mt-4">User Sign In</h2>
                <p className="text-gray-400 text-center mt-2 flex-grow">
                  Access your personalized learning dashboard and track
                  progress.
                </p>
                <Button
                  onClick={() => navigate("/sign-in/user")}
                  className="mt-4 hover:bg-primary/90 transition font-semibold cursor-pointer"
                >
                  Sign In as a User
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mentor Card */}
        <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50 hover:shadow-indigo-500/40 transition ease-in-out duration-200">
          <CardContent>
            <div className="flex flex-col justify-center items-center h-80">
              <div className=" flex flex-col items-center space-y-3">
                <FaUserGraduate className="text-7xl text-indigo-400" />
                <h2 className="text-3xl font-bold mt-4">Mentor Sign In</h2>
                <p className="text-gray-400 text-center mt-2 flex-grow">
                  Access your mentorship portal and manage your students with
                  ease.
                </p>
                <Button
                  onClick={() => navigate("/sign-in/mentor")}
                  className="mt-4 hover:bg-primary/90 transition font-semibold cursor-pointer"
                >
                  Sign In as a Mentor
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default SignIn;
