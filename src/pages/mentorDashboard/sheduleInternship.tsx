import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Internship } from "@/index";
import { getScheduledInternships } from "@/utils/internship";
import { format } from "date-fns";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { ViewInternshipDetail } from "../manageInternship/ViewInternshipDetail";

const SheduleInternship = () => {
  const [internships, setInternships] = useState<Internship[]>([]);

  useEffect(() => {
    const fetchInternships = async () => {
      const res = await getScheduledInternships();
      setInternships(res);
    };
    fetchInternships();
  }, []);
  return (
    <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50  max-h-screen mb-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Clock className="text-pink-400" /> Scheduled Internships
        </CardTitle>
      </CardHeader>
      {internships.length > 0 ? (
        <CardContent className=" overflow-y-scroll">
          {internships.map((internship: Internship) => (
            <RenderCard key={internship.id} internship={internship} />
          ))}
        </CardContent>
      ) : (
        <CardContent className=" flex items-center justify-center h-full">
          <p className=" text-muted-foreground">No Scheduled Internships</p>
        </CardContent>
      )}
    </Card>
  );
};

export default SheduleInternship;

const RenderCard = ({ internship }: { internship: Internship }) => {
  const [ViewInternship, setViewInternship] = useState(false);
  return (
    <>
      <Card className=" bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50">
        {/* Header Section */}
        <CardHeader>
          <div className=" space-y-4">
            <div className=" flex justify-between">
              <CardTitle className="text-2xl font-semibold flex items-center gap-2">
                {internship.internship_title}
              </CardTitle>
              <div className="flex flex-col items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                  ID: {internship.id.slice(0, 5)}
                </span>
                <span className=" text-primary text-2xl font-bold">
                  {internship.price}
                </span>
              </div>
            </div>
            <CardDescription className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="font-medium">{internship.description}</span>
            </CardDescription>
          </div>
        </CardHeader>

        {/* Domains Section */}
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Domains</h2>

          <div className=" space-y-2">
            {Object.entries(internship.domains).map(
              ([domainName, domainData]) => (
                <Card key={domainName} className=" px-1 py-3">
                  <CardHeader className="flex flex-row items-center justify-between px-1">
                    <CardTitle className="text-xl font-bold text-primary capitalize">
                      {domainName}
                    </CardTitle>
                    <div className=" space-x-3">
                      {domainName === internship.my_role.domain && (
                        <Button
                          variant="outline"
                          size="sm"
                          className=" cursor-pointer flex-1 border-green-600/50 bg-green-600/10 text-green-600 hover:bg-green-600/50 hover:text-white"
                        >
                          Payment Details
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className=" cursor-pointer flex-1 border-primary/50 bg-primary/10 text-primary hover:bg-primary/50 hover:text-white"
                        onClick={() => setViewInternship(true)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm px-1">
                    <Separator className=" -mt-2" />
                    <div className="flex gap-2">
                      <span className="font-semibold text-foreground">
                        Skills:
                      </span>
                      <span className="text-muted-foreground">
                        {domainData.skills_required
                          .map((skill: string) => skill)
                          .join(", ")}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div>
                        <span className="font-semibold text-foreground">
                          Hours:
                        </span>{" "}
                        <span className="text-muted-foreground">
                          {domainData.weekly_hours} hours
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
                          {format(domainData.start_date, "dd MMM yyyy")}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-foreground">
                          End:
                        </span>{" "}
                        <span className="text-muted-foreground">
                          {format(domainData.end_date, "dd MMM yyyy")}
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
                          {domainData.join_count}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ),
            )}
          </div>
        </CardContent>
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
