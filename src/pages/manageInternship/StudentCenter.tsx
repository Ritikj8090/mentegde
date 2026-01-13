import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Check, Pen, Trash, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const StudentCenter = () => {
  return (
        <Card className=" col-span-2 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50  max-h-screen mb-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold mb-4 flex items-center gap-2">
          <User className="text-green-400" /> Student Center
        </CardTitle>
        <CardDescription>
          Showing recent approved & posted internships
        </CardDescription>
      </CardHeader>
      <CardContent className=" overflow-y-scroll space-y-3">
        <RenderCard />
      </CardContent>
    </Card>
  )
}

export default StudentCenter

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

const RenderCard = () => {
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
              {intern.title}
            </CardTitle>
            <CardDescription className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span >ID: IG78</span>
              <span className="hidden sm:inline">|</span>
              <span>Host: Suraj</span>
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              className={cn(
                " text-xs px-0.5 py-0.5",
                intern.status === "active"
                  ? " border-green-600/50  text-white bg-green-600/50"
                  : "flex-1 border-red-600/50 text-white bg-red-600/50"
              )}
            >
              {intern.status}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className=" grid grid-cols-2 gap-2">
          {domains.map((domain) => (
            <Card className='py-4'>
              <CardHeader className="flex flex-row items-center justify-between px-3">
                <CardTitle className=" font-semibold text-primary">
                  {domain.name}
                </CardTitle>
              </CardHeader>
              <CardContent className=" space-y-3 text-xs px-3">
                <Separator  className=' -mt-3'/>
                <div className="flex gap-2">
                  <span className="font-semibold text-foreground">Skills:</span>
                  <span className="text-muted-foreground">{domain.skills}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold text-foreground">Tasks:</span>
                  <span className="text-pretty text-muted-foreground">
                    {domain.tasks}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <span className="font-semibold text-foreground">
                      Hours:
                    </span>{" "}
                    <span className="text-muted-foreground">
                      {domain.hours} H
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">
                      Duration:
                    </span>{" "}
                    <span className="text-muted-foreground">
                      {domain.duration} weeks
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">
                      Start:
                    </span>{" "}
                    <span className="text-muted-foreground">
                      {domain.start}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">End:</span>{" "}
                    <span className="text-muted-foreground">{domain.end}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">
                      Limit:
                    </span>{" "}
                    <span className="text-muted-foreground">
                      {domain.limit}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">
                      Joined:
                    </span>{" "}
                    <span className="text-muted-foreground">
                      {domain.joined}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};