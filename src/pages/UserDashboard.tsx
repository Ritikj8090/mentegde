import {
  Star,
  BookOpen,
  Briefcase,
  Mail,
  Phone,
  Calendar,
  Users,
  Clock,
  LayoutDashboard,
  Pen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import StartLiveClass from "@/components/StartLiveClass";
import { useSelector } from "react-redux";
import { RootState } from "@/components/store/store";
import apis from "@/services/api";
import Profile from "@/components/userDashboard/Profile";

export default function UserDashboardPage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const { user } = useSelector((state: RootState) => state.auth);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [mentorProfile, setMentorProfile] = useState<any>(null);

  const upcomingSessions = [
    {
      id: "session-1",
      title: "Introduction to React Hooks",
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      participants: 8,
      duration: 60,
    },
    {
      id: "session-2",
      title: "Advanced TypeScript Techniques",
      date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
      participants: 12,
      duration: 90,
    },
    {
      id: "session-3",
      title: "Building RESTful APIs with Node.js",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      participants: 15,
      duration: 120,
    },
  ];

  // Mock data for recent sessions
  const recentSessions = [
    {
      id: "recent-1",
      title: "JavaScript ES6+ Features",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      participants: 10,
      duration: 75,
    },
    {
      id: "recent-2",
      title: "CSS Grid and Flexbox Mastery",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      participants: 8,
      duration: 60,
    },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await apis.getMentorProfile();
        setMentorProfile(profile);
        console.log(profile);
      } catch (err) {
        console.error("Failed to load mentor profile", err);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const requests = await apis.getPendingFollowRequests(); // hitting your `/follow/pending` API
        setPendingRequests(requests);
      } catch (error) {
        console.error("Error fetching pending requests:", error);
      }
    };

    fetchPendingRequests();
  }, []);

  const handleAccept = async (userId: string) => {
    try {
      await apis.acceptFollowRequest(userId);
      setPendingRequests((prev) => prev.filter((req) => req.id !== userId)); // remove accepted
    } catch (error) {
      console.error("Accept error:", error);
    }
  };

  const handleReject = async (userId: string) => {
    try {
      await apis.rejectFollowRequest(userId);
      setPendingRequests((prev) => prev.filter((req) => req.id !== userId)); // remove rejected
    } catch (error) {
      console.error("Reject error:", error);
    }
  };

  return (
    <div className="container mx-auto py-10 space-y-6">
      <h1 className="text-4xl font-bold mb-8">User Dashboard</h1>
      <Profile mentorProfile={mentorProfile} user={user} />
    </div>
  );
}
