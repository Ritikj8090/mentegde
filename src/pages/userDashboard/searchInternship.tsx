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
import { Separator } from "@/components/ui/separator";
import { FaSearch } from "react-icons/fa";

const SearchInternship = () => {
  return (
    <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50  max-h-screen mb-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FaSearch className="text-pink-400" /> Search Internships
        </CardTitle>
      </CardHeader>
      <CardContent className=" overflow-y-scroll space-y-3">
        <RenderCard />
      </CardContent>
    </Card>
  );
};

export default SearchInternship;

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
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <CardTitle className="text-2xl font-semibold">Chess Game</CardTitle>
            <CardDescription className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="font-medium">
                Make ui and backend for chess game
              </span>
            </CardDescription>
          </div>
          <div className="flex flex-col items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              ID: IG78
            </span>
            <span className=" text-primary text-2xl font-bold">$200</span>
          </div>
        </div>
      </CardHeader>

      {/* Domains Section */}
      <CardContent className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Domains</h2>

        <div className=" space-y-2">
          {domains.map((domain) => (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold text-primary">
                  {domain.name}
                </CardTitle>
                <div className=" space-x-3">
                  <Button
                    variant="outline"
                    size="default"
                    className=" cursor-pointer flex-1 border-green-600/50 bg-green-600/10 text-green-600 hover:bg-green-600/50 hover:text-white"
                  >
                    Join
                  </Button>
                  <Button
                    variant="outline"
                    size="default"
                    className=" cursor-pointer flex-1 border-primary/50 bg-primary/10 text-primary hover:bg-primary/50 hover:text-white"
                  >
                    View Details
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="mb-3 space-y-3 text-sm">
                <Separator />
                <div className="flex gap-2">
                  <span className="font-semibold text-foreground">Skills:</span>
                  <span className="text-muted-foreground">
                    {domain.skills}
                  </span>
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
                    <span className="text-muted-foreground">{domain.hours} H</span>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">
                      Duration:
                    </span>{" "}
                    <span className="text-muted-foreground">{domain.duration} weeks</span>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">
                      Start:
                    </span>{" "}
                    <span className="text-muted-foreground">{domain.start}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">End:</span>{" "}
                    <span className="text-muted-foreground">{domain.end}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">
                      Limit:
                    </span>{" "}
                    <span className="text-muted-foreground">{domain.limit}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">
                      Joined:
                    </span>{" "}
                    <span className="text-muted-foreground">{domain.joined}</span>
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
