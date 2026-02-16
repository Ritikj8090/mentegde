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
import { getOngoingInternships } from "@/utils/internship";
import { Internship } from "@/index";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ViewInternshipDetail } from "../manageInternship/ViewInternshipDetail";

const OngoingInternship = () => {
  const [internships, setInternships] = useState<Internship[]>([]);

  useEffect(() => {
    const fetchInternships = async () => {
      const res = await getOngoingInternships();
      setInternships(res);
    };
    fetchInternships();
  }, []);
  return (
    <>
      <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50  max-h-screen mb-4">
        <CardHeader>
          <CardTitle className="md:text-2xl text-lg font-bold md:mb-4 flex items-center gap-2">
            <BookOpen className="text-blue-400" /> Ongoing Internships
          </CardTitle>
        </CardHeader>
        {internships.length > 0 ? (
          <CardContent className=" overflow-y-scroll space-y-3 px-3">
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
    </>
  );
};

export default OngoingInternship;

const RenderCard = ({ internship }: { internship: Internship }) => {
  const [ViewInternship, setViewInternship] = useState(false);
  const domainDate =
    internship.my_role.domain === "tech"
      ? internship.domains.tech
      : internship.domains.management;
  return (
    <>
      <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50 max-h-screen mb-4">
        {/* Header Section */}
        <CardHeader>
          <div className=" flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <CardTitle className="md:text-2xl text-lg font-semibold">
                {internship.internship_title}
              </CardTitle>
              <CardDescription className="flex flex-wrap items-center gap-3 md:text-sm text-xs text-muted-foreground">
                <span className="font-medium">
                  Duration: {domainDate?.duration}
                </span>
                <span>|</span>
                <span>
                  Start: {format(domainDate?.start_date as Date, "dd MMM yyyy")}
                </span>
                <span>|</span>
                <span className=" capitalize">
                  Domain: {domainDate?.domain_name}
                </span>
                <span className=" md:hidden inline">|</span>
                <span className=" md:hidden inline">ID: {internship.id.slice(0, 5)}</span>
                 
              </CardDescription>
            </div>
            <div className="hidden md:inline items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                ID: {internship.id.slice(0, 5)}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className=" space-y-3">
          {/* Description Section */}
          <div className=" space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Description
            </h2>
            <div className="rounded-lg bg-muted/50 md:p-4 p-2 backdrop-blur-sm">
              <p className="md:text-base text-sm text-card-foreground">
                {domainDate?.domain_description}
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-wrap gap-3">
          {/* Action Buttons */}
          <a href={`/workboard/${internship.id}`}>
            <Button
              size={"sm"}
              className="flex md:text-sm text-xs md:px-3 px-1 font-medium cursor-pointer"
            >
              View Workboard
            </Button>
          </a>
          <Button
            size={"sm"}
            className="flex md:text-sm text-xs md:px-3 px-1 font-medium cursor-pointer"
            onClick={() => setViewInternship(true)}
          >
            View Intern & Mentor
          </Button>
          <a href={`/internship-chat/${internship.id}`}>
            <Button
              size={"sm"}
              variant="outline"
              className="gap-2 md:text-base text-xs md:px-3 px-1 font-medium bg-transparent cursor-pointer"
            >
              <MessageSquare className="md:h-4 md:w-4 h-2 w-2" />
              Chat
            </Button>
          </a>
        </CardFooter>
      </Card>
      {ViewInternship && (
        <ViewInternshipDetail
          open={ViewInternship}
          setOpen={setViewInternship}
          internship={internship}
        />
      )}
    </>
  );
};
