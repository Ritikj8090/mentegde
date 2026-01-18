import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserTie, FaBook, FaChalkboardTeacher, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { toast } from "sonner";

const MentorLanding = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    expertise: "",
    years_of_experience: "",
    linkedin_portfolio_link: "",
    availability: "",
    resume_link: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<any>({});

  const navigate = useNavigate();

  const expertiseAreas = [
    { value: "Technology", label: "Technology", icon: <FaUserTie /> },
    { value: "Business", label: "Business", icon: <FaBook /> },
    { value: "Career Guidance", label: "Career Guidance", icon: <FaChalkboardTeacher /> },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let newErrors: any = {};

    if (!formData.name) newErrors.name = "Full name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.expertise) newErrors.expertise = "Select an expertise area";
    if (!formData.years_of_experience) newErrors.years_of_experience = "Experience required";
    if (!formData.availability) newErrors.availability = "Availability required";

    if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      const res = await axios.post(
        "https://localhost:4000/api/auth/mentor/register",
        formData,
        { withCredentials: true }
      );

      if (res.status === 201) {
        toast.success("Mentor registration successful!");
        navigate("/mentor-dash");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="h-screen w-full bg-black text-white flex items-start justify-center px-6 py-10">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl h-full">

        {/* Left Section */}
        <motion.div
          className="flex flex-col items-center p-6 md:p-10 bg-gradient-to-b from-gray-800 to-black sticky top-0 h-full"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col items-center mb-6">
            <img src="/mentors.png" alt="Mentor guiding" className="w-36 md:w-40 mb-4" />
            <h2 className="text-3xl font-bold text-center">Why mentor on MentEdge?</h2>
          </div>
          <ul className="space-y-3 text-lg text-center md:text-left">
            <li>✅ Share your knowledge & guide students</li>
            <li>✅ Build your personal brand as a mentor</li>
            <li>✅ Network with talented mentees & professionals</li>
          </ul>
        </motion.div>

        {/* Right Section */}
        <motion.div
          className="flex flex-col justify-start p-10 overflow-y-auto max-h-full"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-6">Register as a Mentor</h2>
          <p className="text-gray-400 mb-6">Guide aspiring professionals & build your mentor profile.</p>

          <form className="space-y-5" onSubmit={handleSubmit}>

            {/* Full Name */}
            <div>
              <label className="block text-sm mb-1">Full Name*</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm mb-1">Email ID*</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border-gray-700 border"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

           {/* Password */}
<div>
  <label className="block text-sm mb-1">Password*</label>

  <div className="relative">
    <input
      name="password"
      value={formData.password}
      onChange={handleChange}
      type={showPassword ? "text" : "password"}
      placeholder="Minimum 6 characters"
      className="w-full px-4 py-3 pr-12 rounded-xl bg-gray-800 text-white border border-gray-700 outline-none"
    />

    <div
      className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-gray-400 hover:text-white"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
    </div>
  </div>

  {errors.password && (
    <p className="text-red-500 text-sm">{errors.password}</p>
  )}
</div>


{/* Confirm Password */}
<div>
  <label className="block text-sm mb-1">Confirm Password*</label>

  <div className="relative">
    <input
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      type={showConfirmPassword ? "text" : "password"}
      placeholder="Re-enter your password"
      className="w-full px-4 py-3 pr-12 rounded-xl bg-gray-800 text-white border border-gray-700 outline-none"
    />

    <div
      className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-gray-400 hover:text-white"
      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    >
      {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
    </div>
  </div>

  {errors.confirmPassword && (
    <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
  )}
</div>

            {/* Expertise */}
            <div>
              <label className="block text-sm mb-2">Expertise Area*</label>
              <div className="flex gap-4 flex-wrap">
                {expertiseAreas.map((exp) => (
                  <div
                    key={exp.value}
                    onClick={() => setFormData({ ...formData, expertise: exp.value })}
                    className={`flex flex-col items-center justify-center gap-2 cursor-pointer w-28 py-3 rounded-xl border 
                      ${
                        formData.expertise === exp.value
                          ? "border-blue-500 bg-blue-600"
                          : "border-gray-700 bg-gray-800"
                      }`}
                  >
                    <div className="text-2xl">{exp.icon}</div>
                    <span className="text-sm">{exp.label}</span>
                  </div>
                ))}
              </div>
              {errors.expertise && <p className="text-red-500 text-sm">{errors.expertise}</p>}
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm mb-1">Years of Experience*</label>
              <input
                name="years_of_experience"
                value={formData.years_of_experience}
                onChange={handleChange}
                type="number"
                placeholder="e.g., 5"
                className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700"
              />
              {errors.years_of_experience && (
                <p className="text-red-500 text-sm">{errors.years_of_experience}</p>
              )}
            </div>

            {/* LinkedIn */}
            <div>
              <label className="block text-sm mb-1">LinkedIn / Portfolio*</label>
              <input
                name="linkedin_portfolio_link"
                value={formData.linkedin_portfolio_link}
                onChange={handleChange}
                type="url"
                placeholder="Paste your LinkedIn or portfolio URL"
                className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700"
              />
            </div>

            {/* Resume */}
            <div>
              <label className="block text-sm mb-1">Resume / CV Link*</label>
              <input
                name="resume_link"
                value={formData.resume_link}
                onChange={handleChange}
                type="url"
                placeholder="Paste your resume link"
                className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700"
              />
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm mb-1">Availability (hours/week)*</label>
              <input
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                type="number"
                placeholder="e.g., 4"
                className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700"
              />
              {errors.availability && (
                <p className="text-red-500 text-sm">{errors.availability}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-white text-black font-semibold text-lg hover:bg-yellow-50"
            >
              Join as Mentor
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default MentorLanding;
