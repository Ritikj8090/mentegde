import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Briefcase,
  Clock,
  Users,
  Wallet,
  PlusCircle,
  Filter,
  Search,
  BookOpen,
  User,
  Settings,
  Home,
  LogOut,
  MessageSquare,
} from "lucide-react";
import { motion } from "framer-motion";
import NavbarMentor from "../components/mentorDashboard/NavbarMentor";

// Type definitions
interface SidebarItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
}

interface Internship {
  title: string;
  duration: string;
  start: string;
  id: string;
  status: string;
  progress: number;
  desc: string;
  domainTech?: string[];
  domainManagement?: string[];
  price?: number;
  limit?: number;
  joined?: number;
  seatsLeft?: number;
  launchDate?: string;
  endDate?: string;
  published: boolean;
}

interface Mentor {
  name: string;
  field: string;
  type: string;
  internships: number;
}

const MentorDashboardTwo: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [scheduledInternships, setScheduledInternships] = useState<Internship[]>([]);
   const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleDetails = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };
  const navigate = useNavigate();

  const sidebarItems: SidebarItem[] = [
    { icon: Home, label: "Home", path: "/mentor/dashboard" },
    { icon: Briefcase, label: "Internships", path: "/mentor/internships" },
    { icon: Users, label: "Students", path: "/mentor/students" },
    { icon: Wallet, label: "Wallets", path: "/mentor/wallet" },
    { icon: PlusCircle, label: "Create Internship", path: "/create-internship" },
    { icon: Settings, label: "Settings", path: "/mentor/settings" },
  ];

  const ongoingInternships: Internship[] = [
    {
      title: "AI Research",
      duration: "3 months",
      start: "01 Sep 2025",
      id: "AI001",
      status: "In Development",
      progress: 70,
      desc: "Working with ML models",
      published: true,
    },
    {
      title: "UI/UX Design",
      duration: "2 months",
      start: "10 Sep 2025",
      id: "UI002",
      status: "In Progress",
      progress: 45,
      desc: "Designing creative dashboards",
      published: true,
    },
  ];

  const mentors: Mentor[] = [
    { name: "Dr. Smith", field: "AI Specialist", type: "Tech Mentor", internships: 8 },
    { name: "Jane Doe", field: "Frontend Dev", type: "Tech Mentor", internships: 3 },
    { name: "Rahul Mehta", field: "Cloud Engineer", type: "Management Mentor", internships: 6 },
    { name: "Aisha Khan", field: "Marketing Expert", type: "Management Mentor", internships: 4 },
  ];

  // Fetch scheduled internships from backend
// Fetch scheduled internships from backend
useEffect(() => {
  const fetchScheduledInternships = async () => {
    try {
      const response = await axios.get("https://localhost:4000/api/internships"); // same API as CreateInternship
      // Only show approved/posted/published internships
      const publishedInternships = response.data.filter(
        (i: Internship) => i.status === "posted" || i.status === "published"
      );
      setScheduledInternships(publishedInternships);
    } catch (error) {
      console.error("Error fetching scheduled internships:", error);
    }
  };

  fetchScheduledInternships();
}, []);


  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col">
      {/* Navbar */}
      <NavbarMentor onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Sidebar Drawer */}
      {sidebarOpen && (
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          className="fixed top-0 left-0 h-full w-64 bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col gap-6 z-50"
        >
          <h2 className="text-lg font-bold mb-4">Menu</h2>
          <div className="flex flex-col gap-4">
            {sidebarItems.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className="flex items-center gap-2 cursor-pointer hover:text-zinc-400 transition"
              >
                <item.icon className="h-5 w-5" /> {item.label}
              </div>
            ))}
            <div
              onClick={() => {
                navigate("/logout");
                setSidebarOpen(false);
              }}
              className="flex items-center gap-2 cursor-pointer hover:text-red-400 mt-auto transition"
            >
              <LogOut className="h-5 w-5" /> Logout
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white transition"
          >
            ✕
          </button>
        </motion.div>
      )}

      {/* Main Dashboard */}
      <div className="flex-1 p-4 sm:p-8 flex flex-col gap-6 overflow-hidden">
        <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50 w-full h-full bg-gradient-to-b from-gray-800 to-black shadow-lg rounded-2xl overflow-hidden">
          <CardContent className="p-0 h-full flex flex-col lg:flex-row">
            {/* Left Panel - Ongoing Internships */}
            <div className="w-full lg:w-1/3 bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col gap-6">
              <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                <BookOpen className="h-5 w-5" /> Ongoing Internships
              </h2>
              <div className="mt-4 flex flex-col gap-4">
                {ongoingInternships.map((item, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.03 }}
                    className="bg-gradient-to-b from-gray-800 to-black rounded-2xl shadow-lg p-4 hover:shadow-indigo-500/40 transition"
                  >
                    <CardContent className="p-2 flex flex-col gap-2">
                      <div className="flex justify-between items-center text-white">
                        <h3 className="font-semibold">{item.title}</h3>
                        <div className="flex items-center gap-2">
                          <MessageSquare
                            className="h-5 w-5 text-blue-400 cursor-pointer hover:text-blue-500 transition"
                            onClick={() => alert(`Chat opened for ${item.title}`)}
                          />
                          <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-md">
                            {item.status}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-zinc-400">
                        Internship ID: {item.id}
                      </p>

                      <div className="w-full bg-zinc-700 h-2 rounded-full mt-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>

                      <p className="text-xs text-zinc-400">
                        {item.progress}% completed
                      </p>

                      <div className="flex flex-col mt-2">
                        <label className="text-sm text-zinc-300 mb-1">
                          Small Description
                        </label>
                        <textarea
                          defaultValue="Enter brief progress notes or updates here..."
                          className="bg-zinc-800 text-white text-sm rounded-lg p-2 border border-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                          rows={3}
                        ></textarea>
                      </div>

                      <p className="text-sm mt-2">{item.desc}</p>

                      <div className="flex gap-2 mt-3">
                        <Button size="sm" className="bg-white text-black hover:bg-yellow-50 w-full">
                          View Workboard
                        </Button>
                        <Button size="sm" className="bg-white text-black hover:bg-yellow-50 w-full">
                          View Intern
                        </Button>
                        <Button size="sm" className="bg-white text-black hover:bg-yellow-50 w-full">
                          Status
                        </Button>
                      </div>
                    </CardContent>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Middle Panel - Scheduled Internships */}
            <div className="w-full lg:w-1/3 bg-zinc-950 p-6 flex flex-col gap-6 overflow-y-auto">
              <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                <Clock className="h-5 w-5" /> Scheduled Internships
              </h2>

              {scheduledInternships.length === 0 && (
                <p className="text-zinc-400 text-sm mt-2">
                  No scheduled internships yet.
                </p>
              )}

{scheduledInternships.map((item) => (
  <motion.div
    key={item.id}
    whileHover={{ scale: 1.03 }}
    className="bg-gradient-to-b from-gray-800 to-black rounded-2xl shadow-lg p-4 hover:shadow-indigo-500/40 transition"
  >
    <CardContent className="p-3 flex flex-col gap-4">
      
      {/* Title + Small Details */}
      <div className="flex justify-between items-center text-white">
        <div>
          <h3 className="font-semibold text-lg">{item.intern_title}</h3>
          <p className="text-sm text-zinc-400 mt-1">{item.small_details}</p>
        </div>
        <p className="text-xs text-zinc-500">ID: {item.intern_id}</p>
      </div>

      {/* Price */}
      <p className="text-sm text-green-400 font-medium mt-1">
        Price: ₹{item.price}
      </p>

      {/* Basic Info */}
      <p className="text-xs text-zinc-400">Host: {item.host_name}</p>

      {/* ⬇ NEW: Domain Panel (Tech + Management) */}
    {/* Domains Section */}
{item.domains && item.domains.length > 0 && (
  <div className="mt-2 bg-zinc-900/60 p-3 rounded-lg border border-zinc-800">
    <h4 className="text-sm font-semibold text-indigo-400 mb-2">Domains</h4>

    {item.domains.map((domain, idx) => (
      <div key={idx} className="mb-4 p-3 bg-zinc-800 rounded-lg">
        
        {/* Domain Title */}
        <p className="text-sm text-white font-semibold mb-2">
          {domain.domain_name} Domain
        </p>

        {/* Exact DB values */}
        <p className="text-xs text-zinc-400">
          <strong>Skills:</strong> {domain.skills || "N/A"}
        </p>
        <p className="text-xs text-zinc-400 mt-1">
          <strong>Tasks:</strong> {domain.tasks || "N/A"}
        </p>
        <p className="text-xs text-zinc-400 mt-1">
          <strong>Hours:</strong> {domain.hours || "N/A"}
        </p>
        <p className="text-xs text-zinc-400 mt-1">
          <strong>Start Date:</strong> {domain.start_date || "N/A"}
        </p>
        <p className="text-xs text-zinc-400 mt-1">
          <strong>End Date:</strong> {domain.end_date || "N/A"}
        </p>
        <p className="text-xs text-zinc-400 mt-1">
          <strong>Duration:</strong> {domain.duration || "N/A"}
        </p>

        {/* Seat Information */}
        <p className="text-xs text-zinc-400 mt-1">
          <strong>Limit:</strong> {domain.limit_value}
        </p>
        <p className="text-xs text-zinc-400 mt-1">
          <strong>Joined:</strong> {domain.join_count} / {domain.limit_value}
        </p>
        <p className="text-xs text-zinc-400 mt-1">
          <strong>Seats Left:</strong> {domain.seats_left}
        </p>

        {/* Details Toggle */}
        <div className="flex gap-2 mt-3">
          <Button size="sm" className="bg-indigo-500 hover:bg-indigo-600">
            View Payment Status
          </Button>

          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => toggleDetails(domain.id)}
          >
            {expandedId === domain.id ? "Hide Details" : "View Details"}
          </Button>
        </div>

        {expandedId === domain.id && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="bg-zinc-900/40 p-3 mt-3 rounded-xl border border-zinc-700"
          >
            <h4 className="text-sm font-semibold text-indigo-400 mb-2">
              Detailed Information
            </h4>

            <p className="text-xs text-zinc-300 mb-1">
              <strong>Description:</strong>{" "}
              {domain.view_details || "No details available."}
            </p>
          </motion.div>
        )}
      </div>
    ))}
  </div>
)}


      {/* Footer Info */}
      <div className="flex justify-between mt-1">
        <span className="text-xs text-zinc-400">
          Launched at: {new Date(item.created_at).toLocaleDateString()}
        </span>

        <span className="text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded-md">
          Active
        </span>
      </div>
    </CardContent>
  </motion.div>
))}


            </div>

            {/* Right Panel - Search Mentors */}
            <div className="hidden lg:block w-1/3 bg-zinc-900 border-l border-zinc-800 p-6 flex flex-col gap-6">
              <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                <Search className="h-5 w-5" /> Search Mentors
              </h2>
              <input
                type="text"
                placeholder="Search mentor..."
                className="w-full rounded-xl bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-zinc-600"
              />
              <div className="flex items-center gap-2 mt-2">
                <Filter className="h-5 w-5 text-zinc-400" />
                <select className="flex-1 rounded-xl bg-zinc-800 border border-zinc-700 px-2 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-zinc-600">
                  <option value="all">All Mentors</option>
                  <option value="tech">Tech Mentors</option>
                  <option value="management">Management Mentors</option>
                </select>
              </div>
              <div className="flex flex-col gap-4 mt-4">
                {mentors.map((mentor, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.03 }}
                    className="bg-gradient-to-b from-gray-800 to-black rounded-2xl shadow-lg hover:shadow-indigo-500/40 transition p-4"
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <User className="h-8 w-8 text-zinc-400" />
                      <div className="flex flex-col text-white">
                        <h3 className="font-semibold">{mentor.name}</h3>
                        <p className="text-xs text-zinc-400">{mentor.field}</p>
                        <p className="text-xs text-zinc-500">
                          {mentor.type} • {mentor.internships} Internships
                        </p>
                      </div>
                    </CardContent>
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MentorDashboardTwo;
