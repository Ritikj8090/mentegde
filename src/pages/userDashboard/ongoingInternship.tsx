import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import React from "react";
import { FaClipboardList } from "react-icons/fa";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const intern = {
  id: "INT-20",
  title: "Frontend Developer",
  status: "Ongoing",
  duration: "3 Months",
  startDate: "2024-05-01",
  progress: 65,
  description:
    "Join us as a Frontend Developer intern and work on building responsive web applications using React.js. Gain hands-on experience with modern web technologies and collaborate with our development team to create user-friendly interfaces.",
};
const OngoingInternship = () => {
  return (
    <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50  max-h-screen mb-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FaClipboardList className="text-blue-400" /> Ongoing Internships
        </CardTitle>
      </CardHeader>
      <CardContent className=" overflow-y-scroll space-y-3">
        <RenderCard />
      </CardContent>
    </Card>
  );
};

export default OngoingInternship;

const RenderCard = () => {
  return (
    <Card>
      {/* Header Section */}
      <CardHeader>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <CardTitle className="text-2xl font-semibold">
              {intern.title}
            </CardTitle>
            <CardDescription className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="font-medium">Duration: {intern.duration}</span>
              <span className="hidden sm:inline">|</span>
              <span>Start: {intern.startDate}</span>
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              ID: {intern.id}
            </span>
            <Badge
              className={cn("", intern.status === "active" ? "flex-1 border-green-600/50  text-white bg-green-600/50" : "flex-1 border-red-600/50 text-white bg-red-600/50")}
            >
              {intern.status}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="mb-8 space-y-3">
        {/* Progress Section */}
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-card-foreground">Progress</span>
          <span className="font-semibold text-primary">
            {intern.progress}% completed
          </span>
        </div>
        <div className="relative h-3 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${intern.progress}%` }}
          />
        </div>
        {/* Description Section */}
        <div className=" space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Description
          </h2>
          <div className="rounded-lg bg-muted/50 p-4 backdrop-blur-sm">
            <p className="text-base text-card-foreground">
              {intern.description}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-3">
        {/* Action Buttons */}

        <Button className="flex-1 sm:flex-initial font-medium cursor-pointer">
          View Workboard
        </Button>
        <Button className="flex-1 sm:flex-initial font-medium cursor-pointer">
          View Intern & Mentor
        </Button>
        <Button
          variant="outline"
          className="gap-2 font-medium bg-transparent cursor-pointer"
        >
          <MessageSquare className="h-4 w-4" />
          Chat
        </Button>
        <Button
          variant="outline"
          className="font-medium bg-transparent cursor-pointer"
        >
          Status
        </Button>
      </CardFooter>
    </Card>
  );
};
