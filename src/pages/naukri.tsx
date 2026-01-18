import { motion } from "framer-motion";
import { useState, ChangeEvent, FormEvent } from "react";
import {
  FaMale,
  FaFemale,
  FaTransgender,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// ---------------------------
// INTERFACE
// ---------------------------
interface FormData {
  name: string;
  email: string;
  password: string;
  current_city: string;
  current_status: string;
  resume_link: string;
  hear_about: string;
  skills: string;
  confirmPassword?: string; // used only in validation
}

const Naukri: React.FC = () => {
  const navigate = useNavigate();

  const [selectedGender, setSelectedGender] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    current_city: "",
    current_status: "",
    resume_link: "",
    hear_about: "",
    skills: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const genders = [
    { value: "Male", label: "Male", icon: <FaMale /> },
    { value: "Female", label: "Female", icon: <FaFemale /> },
    { value: "Other", label: "Other", icon: <FaTransgender /> },
  ];

  const hearAboutOptions = ["Social Media", "Friend", "Referral", "Other"];
  const currentStatusOptions = ["Student", "Fresher", "Working"];

  // ---------------------------
  // HANDLE INPUT CHANGE
  // ---------------------------
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ---------------------------
  // FORM VALIDATION
  // ---------------------------
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = "Full Name is required";

    if (!formData.email.trim()) newErrors.email = "Email is required";

    if (!formData.password.trim())
      newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!formData.confirmPassword?.trim())
      newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!selectedGender) newErrors.gender = "Please select gender";

    if (!formData.current_status)
      newErrors.current_status = "Select your current status";

    if (!formData.hear_about)
      newErrors.hear_about = "Please select an option";

    if (!formData.skills.trim()) newErrors.skills = "Please enter skills";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------------------
  // SUBMIT FORM
  // ---------------------------
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      ...formData,
      gender: selectedGender,
    };

    try {
      const res = await fetch(
        "https://localhost:4000/api/auth/user/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      navigate("/user/dashboard");
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again.");
    }
  };

  return (
    <div className="h-screen w-full bg-black text-white flex items-start justify-center px-6 py-10">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl h-full">
        {/* ---------------- LEFT PANEL ---------------- */}
        <motion.div
          className="flex flex-col items-center p-6 md:p-10 bg-gradient-to-b from-gray-800 to-black sticky top-0 h-full"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col items-center mb-6">
            <img src="/user.png" alt="mentor" className="w-36 md:w-40 mb-4" />
            <h2 className="text-3xl font-bold text-center">
              Why join MentEdge?
            </h2>
          </div>

          <ul className="space-y-3 text-lg text-center md:text-left">
            <li className="flex items-center gap-2 justify-center md:justify-start">
              ✅ Build your profile & let mentors guide you
            </li>
            <li className="flex items-center gap-2 justify-center md:justify-start">
              ✅ Get internships & learning opportunities
            </li>
            <li className="flex items-center gap-2 justify-center md:justify-start">
              ✅ Connect with top mentors & grow your career
            </li>
          </ul>
        </motion.div>

        {/* ---------------- RIGHT FORM ---------------- */}
        <motion.div
          className="flex flex-col justify-start p-10 overflow-y-auto max-h-full"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-6">
            Create your MentEdge Profile
          </h2>

          <p className="text-gray-400 mb-6">
            Connect with mentors, find internships & shape your career
            journey
          </p>

          {/* -------- FORM STARTS -------- */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* NAME */}
            <div>
              <label className="block text-sm mb-1">Full Name*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 outline-none"
              />
              {errors.name && (
                <p className="text-red-400 text-sm">{errors.name}</p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm mb-1">Email ID*</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 outline-none"
              />
              {errors.email && (
                <p className="text-red-400 text-sm">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1">Password*</label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  className="w-full px-4 py-3 pr-12 rounded-2xl bg-gray-800 text-white border border-gray-700 outline-none"
                />

                <span
                  className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </span>
              </div>

              {errors.password && (
                <p className="text-red-400 text-sm">{errors.password}</p>
              )}
            </div>



            {/* CONFIRM PASSWORD */}
            <div>
              <label className="block text-sm mb-1">Confirm Password*</label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-gray-800 text-white border border-gray-700 outline-none"
                />

                <span
                  className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-gray-400 hover:text-white"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </span>
              </div>

              {errors.confirmPassword && (
                <p className="text-red-400 text-sm">{errors.confirmPassword}</p>
              )}
            </div>


            {/* GENDER SELECT */}
            <div>
              <label className="block text-sm mb-1">Gender*</label>
              <div className="flex gap-4">
                {genders.map((g) => (
                  <button
                    type="button"
                    key={g.value}
                    onClick={() => setSelectedGender(g.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${selectedGender === g.value
                      ? "bg-blue-500 text-white"
                      : "bg-gray-800 border-gray-700"
                      }`}
                  >
                    {g.icon} {g.label}
                  </button>
                ))}
              </div>
              {errors.gender && (
                <p className="text-red-400 text-sm">{errors.gender}</p>
              )}
            </div>

            {/* CITY */}
            <div>
              <label className="block text-sm mb-1">Current City*</label>
              <input
                type="text"
                name="current_city"
                value={formData.current_city}
                onChange={handleChange}
                placeholder="Enter your current current_city"
                className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 outline-none"
              />
            </div>

            {/* STATUS */}
            <div>
              <label className="block text-sm mb-1">Current Status*</label>
              <select
                name="current_status"
                value={formData.current_status}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 outline-none"
              >
                <option value="">Select status</option>
                {currentStatusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.current_status && (
                <p className="text-red-400 text-sm">
                  {errors.current_status}
                </p>
              )}
            </div>

            {/* RESUME LINK */}
            <div>
              <label className="block text-sm mb-1">Resume Link*</label>
              <input
                type="url"
                name="resume_link"
                value={formData.resume_link}
                onChange={handleChange}
                placeholder="Paste your resume link"
                className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 outline-none"
              />
            </div>

            {/* HEAR ABOUT */}
            <div>
              <label className="block text-sm mb-1">
                How did you hear about us?
              </label>
              <select
                name="hear_about"
                value={formData.hear_about}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 outline-none"
              >
                <option value="">Select option</option>
                {hearAboutOptions.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              {errors.hear_about && (
                <p className="text-red-400 text-sm">
                  {errors.hear_about}
                </p>
              )}
            </div>

            {/* SKILLS */}
            <div>
              <label className="block text-sm mb-1">Skills*</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g., JavaScript, Python, AI"
                className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 outline-none"
              />
              {errors.skills && (
                <p className="text-red-400 text-sm">{errors.skills}</p>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-white hover:bg-yellow-50 text-black transition font-semibold text-lg"
            >
              Register Now
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Naukri;
