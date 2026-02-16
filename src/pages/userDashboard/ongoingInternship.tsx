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
import { File, MessageSquare } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FaClipboardList } from "react-icons/fa";
import { cn } from "@/lib/utils";
import {
  getInternship,
  getOngoingInternshipsForIntern,
} from "@/utils/internship";
import { Internship, OngoingInternshipsForIntern } from "@/index";
import { format } from "date-fns";
import { ViewInternshipDetail } from "../manageInternship/ViewInternshipDetail";

const OngoingInternship = () => {
  const [ongoingInternships, setOngoingInternships] =
    React.useState<OngoingInternshipsForIntern[]>();

  useEffect(() => {
    const fetchOngingInternship = async () => {
      const res = await getOngoingInternshipsForIntern();
      setOngoingInternships(res);
      console.log(res);
    };
    fetchOngingInternship();
  }, []);
  return (
    <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50 max-h-screen mb-4">
      <CardHeader>
        <CardTitle className="md:text-2xl text-lg font-bold md:mb-4 flex items-center gap-2">
          <FaClipboardList className="text-blue-400" /> Ongoing Internships
        </CardTitle>
      </CardHeader>
      <CardContent className=" overflow-y-scroll space-y-3 h-full px-3">
        {ongoingInternships && ongoingInternships.length > 0 ? (
          ongoingInternships.map((internship) => (
            <RenderCard
              key={internship.internship_id}
              internship={internship}
            />
          ))
        ) : (
          <p className="flex items-center justify-center text-center h-full text-muted-foreground">
            No ongoing internships found.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default OngoingInternship;

const RenderCard = ({
  internship,
}: {
  internship: OngoingInternshipsForIntern;
}) => {
  const [ViewInternship, setViewInternship] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState<Internship>();

  const handleViewInternship = async (internship_id: string) => {
    const res = await getInternship(internship_id);
    setSelectedInternship(res);
    setViewInternship(true);
  };
  return (
    <>
      <Card>
        {/* Header Section */}
        <CardHeader>
          <div className=" flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <CardTitle className="md:text-2xl text-lg font-semibold">
                {internship.internship_title}
              </CardTitle>
              <CardDescription className="flex flex-wrap items-center gap-3 md:text-sm text-xs text-muted-foreground">
                <span className="font-medium">
                  Duration: {internship.duration}
                </span>
                <span className="">|</span>
                <span>
                  Start: {format(internship.start_date, "dd MMM yyyy")}
                </span>
              </CardDescription>
            </div>
            <div className="flex md:flex-col items-center gap-3 justify-between">
              <span className="md:text-sm text-xs font-medium text-muted-foreground whitespace-nowrap">
                ID: {internship.internship_id.slice(0, 5)}
              </span>
              <Badge
                className={cn(
                  " capitalize md:text-sm text-xs",
                  internship.status === "published"
                    ? "flex border-green-600/50  text-white bg-green-600/50"
                    : "flex border-red-600/50 text-white bg-red-600/50",
                )}
              >
                Ongoing
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className=" space-y-3">
          {/* Progress Section */}
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium md:text-base text-xs text-card-foreground">Progress</span>
            <span className="font-semibold md:text-base text-xs text-primary">
              {internship.progress_percent}% completed
            </span>
          </div>
          <div className="relative h-3 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${internship.progress_percent}%` }}
            />
          </div>
          {/* Description Section */}
          <div className=" space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Description
            </h2>
            <div className="rounded-lg bg-muted/50 md:p-4 p-2 backdrop-blur-sm">
              <p className="md:text-base text-sm text-card-foreground">
                {internship.domain_description || internship.description}
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-wrap gap-3">
          {/* Action Buttons */}
          <a href={`/workboard/${internship.internship_id}`}>
            <Button className="flex md:text-sm text-xs md:px-3 px-1 font-medium cursor-pointer">
              View Workboard
            </Button>
          </a>
          <Button
            className="flex md:text-sm text-xs md:px-3 px-1 font-medium cursor-pointer"
            onClick={() => handleViewInternship(internship.internship_id)}
          >
            View Intern & Mentor
          </Button>
          <a href={`/internship-chat/${internship.internship_id}`}>
            <Button
              variant="outline"
              className="gap-2 md:text-base text-xs md:px-3 px-1 font-medium bg-transparent cursor-pointer"
            >
              <MessageSquare className="md:h-4 md:w-4 h-2 w-2" />
              Chat
            </Button>
          </a>
          {internship.completed_items === internship.total_items && (
            <a href={`/certificate/${internship.certificate_number}`}>
              <Button
                variant="outline"
                className="gap-2 md:text-base text-xs md:px-3 px-1 font-medium bg-transparent cursor-pointer"
              >
                <File className="md:h-4 md:w-4 h-2 w-2" />
                View Certificate
              </Button>
            </a>
          )}
        </CardFooter>
      </Card>
      {ViewInternship && (
        <ViewInternshipDetail
          open={ViewInternship}
          setOpen={setViewInternship}
          internship={selectedInternship!}
        />
      )}
    </>
  );
};
