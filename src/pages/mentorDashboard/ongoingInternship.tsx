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
import { BookOpen, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { getOngoingInternships } from "@/utils/internship";
import { Internship } from "@/index";
import { useEffect, useState } from "react";
import { format } from "date-fns";

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
  const [internships, setInternships] = useState<Internship[]>([]);

  useEffect(() => {
    const fetchInternships = async () => {
      const res = await getOngoingInternships();
      setInternships(res);
      console.log(res);
    };
    fetchInternships();
  }, []);
  return (
    <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50  max-h-screen mb-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="text-blue-400" /> Ongoing Internships
        </CardTitle>
      </CardHeader>
      {internships.length > 0 ? (
        <CardContent className=" overflow-y-scroll space-y-3">
          {internships.map((internship: Internship) => (
            <RenderCard key={internship.id} internship={internship} />
          ))}
        </CardContent>
      ) : (
        <CardContent className=" flex items-center justify-center h-full">
          <p className=" text-muted-foreground">No Ongoing Internships</p>
        </CardContent>
      )}
    </Card>
  );
};

export default OngoingInternship;

const RenderCard = ({ internship }: { internship: Internship }) => {
  const domainDate =
    internship.my_role.domain === "tech"
      ? internship.domains.tech
      : internship.domains.management;
  return (
    <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50  max-h-screen mb-4">
      {/* Header Section */}
      <CardHeader>
        <div className=" flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <CardTitle className="text-2xl font-semibold">
              {internship.internship_title}
            </CardTitle>
            <CardDescription className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="font-medium">
                Duration: {domainDate?.duration}
              </span>
              <span className="hidden sm:inline">|</span>
              <span>
                Start: {format(domainDate?.start_date as Date, "dd MMM yyyy")}
              </span>
              <span className="hidden sm:inline">|</span>
              <span className=" capitalize">
                Domain: {domainDate?.domain_name}
              </span>
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              ID: {internship.id.slice(0, 5)}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className=" space-y-3">
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
              {domainDate?.domain_description}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-3">
        {/* Action Buttons */}
        <a href={`/workboard/${internship.id}`}>
          <Button size={"sm"} className="flex-1 sm:flex-initial font-medium cursor-pointer">
            View Workboard
          </Button>
        </a>
        <a href="">

        <Button size={"sm"} className="flex-1 sm:flex-initial font-medium cursor-pointer">
          View Intern & Mentor
        </Button>
        </a>
        <Button size={"sm"}
          variant="outline"
          className="gap-2 font-medium bg-transparent cursor-pointer"
        >
          <MessageSquare className="h-4 w-4" />
          Chat
        </Button>
        <Button size={"sm"}
          variant="outline"
          className="font-medium bg-transparent cursor-pointer"
        >
          Status
        </Button>
      </CardFooter>
    </Card>
  );
};
