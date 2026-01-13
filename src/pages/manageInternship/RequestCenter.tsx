import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Check, Pen, Trash, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Internship } from "@/index";
import { format } from "date-fns";

const RequestCenter = ({
  internshipsRequests,
}: {
  internshipsRequests: Internship[];
}) => {
  return (
    <Card className=" col-span-2 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50  max-h-screen mb-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold mb-4 flex items-center gap-2">
          <User className="text-green-400" /> Request Center
        </CardTitle>
        <CardDescription>Showing recent internship requests</CardDescription>
      </CardHeader>
      <CardContent className=" overflow-y-scroll space-y-3">
        {internshipsRequests.map((internshipsRequest: Internship) => (
          <RenderCard
            key={internshipsRequest.id}
            internshipsRequest={internshipsRequest}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default RequestCenter;

interface Domain {
  name: string;
  skills: string;
  tasks: string;
  hours: number;
  start: string;
  end: string;
  duration: number;
  limit: number;
  joined: number;
  seatsLeft: number;
}

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

const RenderCard = ({
  internshipsRequest,
}: {
  internshipsRequest: Internship;
}) => {
  const domains: Domain[] = [
    {
      name: "Management",
      skills: "Power BI, MS Excel",
      tasks: "Communicate and collaborate with the teams",
      hours: 12,
      start: "2026-01-08",
      end: "2026-03-13",
      duration: 6,
      limit: 4,
      joined: 0,
      seatsLeft: 4,
    },
    {
      name: "Tech",
      skills: "—",
      tasks: "—",
      hours: 23,
      start: "2026-01-07",
      end: "2026-03-19",
      duration: 0,
      limit: 4,
      joined: 0,
      seatsLeft: 4,
    },
  ];
  return (
    <Card>
      {/* Header Section */}
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <CardTitle className="font-semibold">
              {internshipsRequest.internship_title}
            </CardTitle>
            <CardDescription className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span>ID: {internshipsRequest.id.slice(0, 6)}</span>
              <span className="hidden sm:inline">|</span>
              <span>Host: {internshipsRequest.host[0].full_name}</span>
            </CardDescription>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Badge
              className={cn(
                " text-xs px-0.5 py-0.5 capitalize",
                internshipsRequest.status === "draft"
                  ? " border-yellow-600/50  text-white bg-yellow-600/50"
                  : internshipsRequest.status === "published"
                  ? "flex-1 border-green-600/50 text-white bg-green-600/50"
                  : "flex-1 border-red-600/50 text-white bg-red-600/50"
              )}
            >
              {internshipsRequest.status}
            </Badge>
            <span className=" font-bold text-primary">
              {internshipsRequest.price}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        
          <p className="text-sm text-muted-foreground text-justify">
            Description: {internshipsRequest.description}
          </p>
       
        <Separator className="my-4" />
        <p className="text-sm text-muted-foreground">
              Date: {format(new Date(internshipsRequest.created_at), "dd MMM yyyy")}
        </p>

        <div>
            <Button>Accept Request for Co-Host</Button>
            <Button>Decline Request</Button>
        </div>
      </CardContent>
    </Card>
  );
};
