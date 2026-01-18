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
import Profile from "@/components/mentorDashboard/Profile";

export default function MentorDashboardPage() {
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
      <h1 className="text-4xl font-bold mb-8">Mentor Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Profile mentorProfile={mentorProfile} user={user}/>
        </div>
        <div className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50  bg-green-500/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">Availability</CardTitle>
              <Switch />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Toggle to go live or offline
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                Manage Session
              </CardTitle>
            </CardHeader>
            <CardContent className=" space-y-4 space-x-4">
              <StartLiveClass title={"Create a Session"} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                Connection Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingRequests.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No pending requests.
                </p>
              ) : (
                <ul className="space-y-4">
                  {pendingRequests.map((request) => (
                    <li
                      key={request.id}
                      className="grid grid-cols-2 gap-5 items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <Avatar>
                          <AvatarFallback>
                            {request.username
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span>{request.username}</span>
                      </div>
                      <div className="space-x-2 space-y-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(request.id)}
                        >
                          Decline
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleAccept(request.id)}
                        >
                          Accept
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sessions This Month
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">4 more scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Session Rating
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">Out of 5 stars</p>
          </CardContent>
        </Card>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
          <TabsTrigger value="recent">Recent Sessions</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
              <CardDescription>
                Your scheduled mentoring sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {upcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                  >
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {session.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(session.date, "MMMM d, yyyy 'at' h:mm a")}
                      </p>
                      <div className="flex items-center pt-2">
                        <Users className="mr-2 h-4 w-4 opacity-70" />{" "}
                        <span className="text-xs text-muted-foreground">
                          {session.participants} participants
                        </span>
                        <Separator
                          orientation="vertical"
                          className="mx-2 h-4"
                        />
                        <Clock className="mr-2 h-4 w-4 opacity-70" />{" "}
                        <span className="text-xs text-muted-foreground">
                          {session.duration} minutes
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Calendar className="mr-2 h-4 w-4" /> View Full Schedule
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
              <CardDescription>Your past mentoring sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {recentSessions.map((session) => (
                  <div
                    key={session.id}
                    className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                  >
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-slate-500" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {session.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(session.date, "MMMM d, yyyy 'at' h:mm a")}
                      </p>
                      <div className="flex items-center pt-2">
                        <Users className="mr-2 h-4 w-4 opacity-70" />{" "}
                        <span className="text-xs text-muted-foreground">
                          {session.participants} participants
                        </span>
                        <Separator
                          orientation="vertical"
                          className="mx-2 h-4"
                        />
                        <Clock className="mr-2 h-4 w-4 opacity-70" />{" "}
                        <span className="text-xs text-muted-foreground">
                          {session.duration} minutes
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <LayoutDashboard className="mr-2 h-4 w-4" /> View Session
                Analytics
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50 mt-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {["David Brown", "Emma Davis", "Frank Miller"].map(
              (name, index) => (
                <li key={index} className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>
                      {name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">{name}</p>
                    <p className="text-sm text-muted-foreground">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                  </div>
                  <Badge variant="secondary">2 new</Badge>
                </li>
              )
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
