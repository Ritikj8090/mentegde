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
            <Button
              size={"sm"}
              className="flex-1 sm:flex-initial font-medium cursor-pointer"
            >
              View Workboard
            </Button>
          </a>
          <Button
            size={"sm"}
            className="flex-1 sm:flex-initial font-medium cursor-pointer"
            onClick={() => setViewInternship(true)}
          >
            View Intern & Mentor
          </Button>
          <a href={`/internship-chat/${internship.id}`}>
            <Button
              size={"sm"}
              variant="outline"
              className="gap-2 font-medium bg-transparent cursor-pointer"
            >
              <MessageSquare className="h-4 w-4" />
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
