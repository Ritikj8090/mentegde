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
import { BookOpen, Check, Pen, Trash, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Internship } from "@/index";
import { format } from "date-fns";

const WorkFlowCenter = ({ internships }: { internships: Internship[] }) => {
  return (
    <Card className=" col-span-3 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50  max-h-screen mb-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="text-blue-400" /> Workflow Center
        </CardTitle>
        <CardDescription>
          Click buttons to edit, delete, open for co-host, or approve
          internships.
        </CardDescription>
      </CardHeader>
      <CardContent className=" overflow-y-scroll space-y-3">
        {internships.map((internship: Internship) => (
          <RenderCard key={internship.id} internship={internship} />
        ))}
      </CardContent>
    </Card>
  );
};

export default WorkFlowCenter;

const RenderCard = ({ internship }: { internship: Internship }) => {
  return (
    <Card>
      {/* Header Section */}
      <CardHeader>
        <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <CardTitle className="text-2xl font-semibold capitalize">
              {internship.internship_title}
            </CardTitle>
            <CardDescription className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="font-medium">
                ID: {internship.id.slice(0, 6)}
              </span>
              <span className="hidden sm:inline">|</span>
              <span>Host: {internship.host[0].full_name}</span>
              {internship.co_host.length > 0 && (
                <><span className="hidden sm:inline">|</span>
              <span>Co-Host: {internship.co_host[0].full_name}</span></>
              )}
            </CardDescription>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Badge
              className={cn(
                " capitalize",
                internship.status === "draft"
                  ? "border-yellow-600/50  text-white bg-yellow-600/50"
                  : internship.status === "published"
                  ? "border-green-600/50 text-white bg-green-600/50"
                  : "border-red-600/50 text-white bg-red-600/50"
              )}
            >
              {internship.status}
            </Badge>
            <span className=" text-2xl font-bold text-primary">{internship.price}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className=" grid  gap-2">
          {Object.entries(internship.domains).map(
            ([domainName, domainData]) => (
              <Card className="py-4">
                <CardHeader className="flex flex-row items-center justify-between px-3">
                  <CardTitle className=" font-semibold text-primary capitalize text-xl">
                    {domainName}
                  </CardTitle>
                </CardHeader>
                <CardContent className=" space-y-3 px-3">
                  <Separator className=" -mt-3" />
                  <div className="flex gap-2">
                    <span className="font-semibold text-foreground">
                      Skills:
                    </span>

                    {domainData.skills_required.map((skill) => (
                      <Badge
                        key={skill}
                        className=" text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold text-foreground">
                      Tools Used:
                    </span>

                    {domainData.tools_used.map((tool) => (
                      <Badge
                        key={tool}
                        className=" text-xs"
                        variant={"secondary"}
                      >
                        {tool}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold text-foreground">
                      Tasks:
                    </span>
                    <div>

                    {domainData.tasks.map((task, index) => (
                      <span>{index < domainData.tasks.length - 1 && <span> • </span>}{task} </span>
                      
                    ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <span className="font-semibold text-foreground">
                        Difficulty Level:
                      </span>{" "}
                      <span className="text-muted-foreground">
                        {domainData.difficulty_level}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">
                        Marketplace Level:
                      </span>{" "}
                      <span className="text-muted-foreground">
                        {domainData.marketplace_category}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">
                        Duration:
                      </span>{" "}
                      <span className="text-muted-foreground">
                        {domainData.duration}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">
                        Start:
                      </span>{" "}
                      <span className="text-muted-foreground">
                        {format(new Date(domainData.start_date), "dd MMM yyyy")}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">
                        End:
                      </span>{" "}
                      <span className="text-muted-foreground">
                        {format(new Date(domainData.end_date), "dd MMM yyyy")}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">
                        Deadline:
                      </span>{" "}
                      <span className="text-muted-foreground">
                        {format(new Date(domainData.application_deadline), "dd MMM yyyy")}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">
                        Limit:
                      </span>{" "}
                      <span className="text-muted-foreground">
                        {domainData.max_seats}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">
                        Joined:
                      </span>{" "}
                      <span className="text-muted-foreground">
                        {0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-3">
        {/* Action Buttons */}

        <div className=" space-x-3">
          <Button
            variant="outline"
            size="default"
            className=" cursor-pointer flex-1 border-yellow-500/50 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/50 hover:text-yellow-500/80"
          >
            <Pen size={11} />
            Edit
          </Button>
          <Button
            variant="outline"
            size="default"
            className=" cursor-pointer flex-1 border-green-500/50 bg-green-500/10 text-green-500 hover:bg-green-500/50 hover:text-green-500/80"
          >
            <Check size={11} />
            Approve & Post
          </Button>
          <Button
            variant="outline"
            size="default"
            className=" cursor-pointer flex-1 border-blue-500/50 bg-blue-500/10 text-blue-500 hover:bg-blue-500/50 hover:text-blue-500/80"
          >
            <Users size={11} />
            Open for Co-host
          </Button>
          <Button
            variant="outline"
            size="default"
            className=" cursor-pointer flex-1 border-red-500/50 bg-red-500/10 text-red-500 hover:bg-red-500/50 hover:text-red-500/80"
          >
            <Trash size={11} />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
