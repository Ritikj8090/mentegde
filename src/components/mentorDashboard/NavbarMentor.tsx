import { FC, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  MessageSquare,
  Bell,
  User,
  MoreVertical,
  Home,
  Briefcase,
  Users,
  Wallet,
  PlusCircle,
  Settings,
  LogOut,
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";

interface NavbarMentorProps {
  onMenuToggle?: () => void;
}

interface SidebarItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
}

const NavbarMentor: FC<NavbarMentorProps> = ({ onMenuToggle }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const sidebarItems: SidebarItem[] = [
    { icon: Home, label: "Home", path: "/mentor/dashboard" },
    { icon: Briefcase, label: "Internships", path: "/productworkboard" },
    { icon: Users, label: "Students", path: "/mentor/students" },
    { icon: Wallet, label: "Wallets", path: "/mentor/wallet" },
    { icon: PlusCircle, label: "Create Internship", path: "/create-internship" },
    { icon: Settings, label: "Settings", path: "/mentor/settings" },
  ];

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
    if (onMenuToggle) onMenuToggle();
  };

  // ✅ Logout handler
  const handleLogout = async () => {
    try {
      // Optional: Call backend logout endpoint if exists
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );

      // Clear mentor data from localStorage
      localStorage.removeItem("mentor");

      toast.success("Logged out successfully!");
      setSidebarOpen(false);
      navigate("/log-in"); // redirect to login page
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Try again.");
    }
  };

  return (
    <>
      {/* Navbar */}
      <div className="w-full bg-zinc-950 border-b border-zinc-800 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        {/* Left - Hamburger */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-zinc-900 transition"
          >
            <Menu className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Middle - Search Bars */}
      <div className="flex-1 flex items-center justify-center gap-4 max-w-2xl">
  <input
    type="text"
    placeholder="Username"
    className="w-1/2 rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-zinc-600"
  />
  <input
    type="text"
    placeholder="Search..."
    className="w-1/2 rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-zinc-600"
  />
</div>


        {/* Right - Icons */}
        <div className="flex items-center gap-4">
          <MessageSquare className="h-5 w-5 text-zinc-300 cursor-pointer hover:text-white transition" />
          <Bell className="h-5 w-5 text-zinc-300 cursor-pointer hover:text-white transition" />
          <Link to="/mentor/profiles">
            <User className="h-5 w-5 text-zinc-300 cursor-pointer hover:text-white transition" />
          </Link>
          <MoreVertical className="h-5 w-5 text-zinc-300 cursor-pointer hover:text-white transition" />
        </div>
      </div>

      {/* Sidebar Drawer */}
      {sidebarOpen && (
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          className="fixed top-0 left-0 h-full w-64 bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col gap-6 z-50"
        >
          <h2 className="text-lg font-bold mb-4 text-white">Menu</h2>

         <div className="flex flex-col gap-4">
  {sidebarItems.map((item, idx) => (
    <Link
      to={item.path}
      key={idx}
      onClick={() => setSidebarOpen(false)}
      className="flex items-center gap-2 cursor-pointer hover:text-zinc-400 transition"
    >
      <item.icon className="h-5 w-5" /> {item.label}
    </Link>
  ))}

  <div
    onClick={handleLogout}
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
    </>
  );
};

export default NavbarMentor;
