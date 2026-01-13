import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  FaBars,
  FaBell,
  FaTimes,
  FaCommentDots,
  FaCog,
  FaSearch,
  FaClipboardList,
} from "react-icons/fa";
import { LogOut } from "lucide-react";
import axios from "axios";

interface Internship {
  id: string;
  title: string;
  duration: string;
  startDate: string;
  progress: number;
  description: string;
  status: string;
}

interface Domain {
  id?: number;
  domain_name: string;
  skills?: string;
  tasks?: string;
  hours?: string;
}

interface SearchInternship {
  id: number;
  intern_id: string;
  title: string;
  intern_title?: string; // sometimes title stored as intern_title
  intern_category?: string;
  tags?: string[];
  duration: string;
  limit_value: number;
  seats_left: number;
  start_date: string;
  end_date: string;
  small_details?: string;
  view_details?: string;
  price?: number;
  host_name?: string;
  // NEW: domains array returned from backend join
  domains?: Domain[];
  status?: string;
}

const ongoingInternships: Internship[] = [
  {
    id: "AI001",
    title: "AI Research",
    duration: "3 months",
       startDate: "01 Sep 2025",
    progress: 70,
    description: "Work on ML model optimization",
    status: "Active",
  },
  {
    id: "WD002",
    title: "Web Development",
    duration: "2 months",
    startDate: "10 Sep 2025",
    progress: 50,
    description: "Full stack practice project",
    status: "Active",
  },
];

  

const searchInternships: SearchInternship[] = [
  {
    id: "001",
    title: "Frontend Internship",
    description:
      "Internship short details go here. This gives a quick overview.",
    domain: "Tech",
    tags: ["HTML", "CSS", "JS"],
    duration: "3 months",
    price:"150",
    limit: 5,
    joined: 2,
  },
  {
    id: "002",
    title: "Management Internship",
    description: "Develop leadership and communication skills.",
    domain: "Management",
    tags: ["Communication", "Leadership", "Marketing"],
    duration: "2 months",
    price:"200",
    limit: 3,
    joined: 0,
  },
];

const InternDashboard: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchInternships, setSearchInternships] = useState<SearchInternship[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const navigate = useNavigate();

  const toggleDetails = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Fetch internships from backend
  const fetchInternships = async () => {
    try {
      const response = await axios.get("https://localhost:4000/api/internships");

      // Keep backward compatibility: prefer `intern_title` if present, else `title`
      const normalized = (response.data || []).map((i: any) => ({
        ...i,
        // internal fields normalized
        title: i.title || i.intern_title || i.intern_title,
        intern_title: i.intern_title || i.title || i.intern_title,
        // ensure numeric values are numbers
        limit_value: Number(i.limit_value ?? i.limit ?? 0),
        seats_left: Number(i.seats_left ?? i.seatsLeft ?? i.seats_left ?? 0),
        // domains may be returned as JSON string in some setups; try to parse if needed
        domains: (() => {
          if (!i.domains) return undefined;
          if (typeof i.domains === "string") {
            try {
              return JSON.parse(i.domains);
            } catch {
              return undefined;
            }
          }
          return i.domains;
        })(),
      }));

      const published = normalized.filter(
        (i: any) => i.status === "posted" || i.status === "published"
      );

      setSearchInternships(published);
    } catch (error) {
      console.error("Error fetching internships:", error);
      setSearchInternships([]);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  // JOIN HANDLER (updates seats + joined)
 const handleJoin = async (domainId: number) => {
  try {
    const userJson = localStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;
    const intern_id = user?.id;

    if (!intern_id) {
      alert("Please login to join internships.");
      return;
    }

    await axios.post("https://localhost:4000/api/internships/intern/join", {
      intern_id,
      domain_id: domainId,
    });

    await fetchInternships();
    alert("Joined Successfully 🎉");
  } catch (error: any) {
    alert(error?.response?.data?.message || "Already Joined / Error");
  }
};


  const handleLogout = () => {
  // Remove stored login/session data
  localStorage.removeItem("authUser");
  localStorage.removeItem("resetAuth"); 
  localStorage.removeItem("token");

  // Redirect to login page
  window.location.href = "/login";
};


  const handleClick = () => {
    navigate("/user/profile");
  };

  return (
    <div className="w-full bg-[#0d1117] text-white flex flex-col ">
      {/* Header */}
      <header className="bg-[#161b22] flex items-center justify-between px-0 py-3">
        <div className="flex items-center gap-3 px-0">
          <button
            onClick={() => setMenuOpen(true)}
            className="text-gray-300 hover:text-white top-4 left-4 bg-gray-800 p-2 rounded-md z-0"
          >
            <FaBars size={20} />
          </button>
          <input
            type="text"
            placeholder="Search..."
            className="bg-[#21262d] text-sm text-gray-200 rounded-md px-3 py-1.5 focus:outline-none w-64"
          />
        </div>

        <div className="flex items-center gap-5 text-gray-300">
          <FaBell className="hover:text-yellow-400 cursor-pointer" size={18} />
          <FaCommentDots className="hover:text-blue-400 cursor-pointer" size={18} />
          <FaCog className="hover:text-gray-400 cursor-pointer" size={18} />
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -240 }}
          animate={{ x: menuOpen ? 0 : -240 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="bg-[#161b22] w-56 p-5 fixed top-[3.5rem] left-0 bottom-0 z-0 shadow-lg overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-semibold">Menu</h2>
            <FaTimes
              className="cursor-pointer hover:text-red-400"
              size={18}
              onClick={() => setMenuOpen(false)}
            />
          </div>

          <ul className="space-y-3">
            <Button
              onClick={handleClick}
              className="bg-gray-700 rounded-md p-2 cursor-pointer"
            >
              Profile
            </Button>

            <li className="hover:bg-gray-700 rounded-md p-2 cursor-pointer">Internships</li>
            <li className="hover:bg-gray-700 rounded-md p-2 cursor-pointer">Messages</li>
            <li className="hover:bg-gray-700 rounded-md p-2 cursor-pointer">Settings</li>
                {/* 🔴 LOGOUT BUTTON */}
    <li
      onClick={handleLogout}
      className="flex items-center gap-2 cursor-pointer hover:text-red-400 mt-auto transition"
    >  <LogOut className="h-5 w-5" /> Logout</li>
          </ul>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:ml-0 mt-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ongoing Internships Section — unchanged */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-[#161b22] rounded-xl p-6 shadow-lg"
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FaClipboardList className="text-blue-400" /> Ongoing Internships
              </h2>
              <div className="space-y-6">
                {ongoingInternships.map((intern) => (
                  <motion.div
                    key={intern.id}
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-b from-gray-800 to-black rounded-2xl p-5 shadow-lg hover:shadow-indigo-500/40 transition"
                  >
                    <div>
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold">{intern.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400">ID: {intern.id}</span>
                          <span className="bg-yellow-500/30 text-yellow-400 text-sm px-3 py-1 rounded-lg">
                            {intern.status}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-400 text-sm mb-3">
                        Duration: {intern.duration} | Start: {intern.startDate}
                      </p>

                      <div className="w-full bg-gray-700 h-3 rounded-full mb-1">
                        <div
                          className="bg-blue-500 h-3 rounded-full"
                          style={{ width: `${intern.progress}%` }}
                        ></div>
                      </div>

                      <p className="text-sm text-gray-400 mb-3">{intern.progress}% completed</p>

                      <p className="font-semibold mb-2">Small Description</p>
                      <div className="bg-gray-800 p-3 rounded-md text-sm text-gray-300">
                        {intern.description}
                      </div>

                      <div className="flex flex-wrap gap-3 mt-4">
                        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm">
                          View Workboard
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm">
                          View Intern & Mentor
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm">
                          Chat 💬
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm">
                          Status
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* SEARCH INTERNSHIPS (dynamic) */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-[#161b22] rounded-xl p-6 shadow-lg"
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FaSearch className="text-pink-400" /> Search Internships
              </h2>

              {searchInternships.length === 0 && (
                <p className="text-gray-400 text-sm mt-2">No internships available.</p>
              )}

             {searchInternships.map((intern) => {
  const seatsLeft = Number(intern.seats_left ?? 0);
  const joined = Number(intern.limit_value ?? 0) - seatsLeft;

  return (
    <motion.div
      key={intern.id}
      whileHover={{ scale: 1.05 }}
      className="bg-gradient-to-b from-gray-800 to-black mb-5 rounded-2xl p-5 shadow-lg hover:shadow-indigo-500/40 transition"
    >
      {/* Title / Basic Info */}
      <h3 className="text-lg font-semibold">
        {intern.title || intern.intern_title}
      </h3>

      <p className="text-sm text-gray-400 mb-3">ID: {intern.intern_id}</p>

      <p className="text-gray-300 mb-3">{intern.small_details}</p>

      {/* DOMAINS */}
      <div className="bg-gray-800 p-3 rounded-lg mb-3">
        {intern.domains && intern.domains.length > 0 ? (
          <>
            <p className="font-semibold text-gray-200 mb-2">Domains</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {intern.domains.map((d) => {
                const domainJoined =
                  Number(d.limit_value ?? 0) - Number(d.seats_left ?? 0);

                return (
                  <div
                    key={d.id}
                    className="bg-gray-900 p-3 rounded-md border border-gray-700"
                  >
                    {/* Domain Title */}
                    <strong className="text-sm text-indigo-300">
                      {d.domain_name}
                    </strong>

                    {/* Fields */}
                    <p className="text-xs text-gray-400 mt-1">
                      <strong>Skills:</strong> {d.skills || "—"}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      <strong>Tasks:</strong>{" "}
                      {d.tasks
                        ? `${d.tasks.slice(0, 80)}${
                            d.tasks.length > 80 ? "..." : ""
                          }`
                        : "—"}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      <strong>Hours:</strong> {d.hours || "—"}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      <strong>Start:</strong> {d.start_date || "—"}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      <strong>End:</strong> {d.end_date || "—"}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      <strong>Duration:</strong> {d.duration || "—"}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      <strong>Limit:</strong> {d.limit_value}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      <strong>Joined:</strong> {domainJoined}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      <strong>Seats Left:</strong> {d.seats_left}
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => toggleDetails(d.id)}
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm"
                      >
                        {expandedId === d.id
                          ? "Hide Details"
                          : "View Details"}
                      </button>

                      <button
                        onClick={() => handleJoin(d.id)}
                        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-sm"
                      >
                        Join
                      </button>
                    </div>

                    {/* Expanded Details */}
                    {expandedId === d.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}
                        className="bg-zinc-900/40 p-3 mt-3 rounded-xl border border-zinc-700"
                      >
                        <h4 className="text-sm font-semibold text-indigo-400 mb-2">
                          Detailed Information
                        </h4>

                        <p className="text-xs text-zinc-300">
                          <strong>Description:</strong>{" "}
                          {d.view_details || "No detailed info available."}
                        </p>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <p className="text-gray-300">No domains available</p>
        )}
      </div>

      {/* Main-level info */}
      <p className="text-sm text-gray-400">
        Host: {intern.host_name || "N/A"} | Price: ₹{intern.price ?? 0}
      </p>

      <p className="text-sm text-gray-400">
        Duration: {intern.domains?.[0]?.duration || "—"}
      </p>

      <p className="text-sm text-gray-400">
        Start Date: {intern.start_date || "—"}
      </p>
    </motion.div>
  );
})}

            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InternDashboard;
