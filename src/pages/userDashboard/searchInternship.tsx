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
import { getAllInternshipForIntern } from "@/utils/internship";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { ViewInternshipDetail } from "../manageInternship/ViewInternshipDetail";

const SearchInternship = () => {
  const [internships, setInternships] = useState<Internship[]>([]);
  useEffect(() => {
    const fetchAllInternships = async () => {
      const res = await getAllInternshipForIntern();
      console.log(res);
      setInternships(res);
    };
    fetchAllInternships();
  }, []);

  return (
    <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50  max-h-screen mb-4">
      <CardHeader className=" px-2">
        <CardTitle className="md:text-2xl text-lg font-bold md:mb-4 flex items-center gap-2">
          <FaSearch className="text-pink-400" /> Search Internships
        </CardTitle>
      </CardHeader>
      <CardContent className=" overflow-y-scroll space-y-3 h-full px-2">
        {internships.length > 0 ? (
          internships.map((internship) => (
            <RenderCard key={internship.id} internship={internship} />
          ))
        ) : (
          <p className="flex items-center justify-center text-center h-full text-muted-foreground">
            No internships available at the moment.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchInternship;

const RenderCard = ({ internship }: { internship: Internship }) => {
  const [ViewInternship, setViewInternship] = useState(false);
  return (
    <>
      <Card>
        {/* Header Section */}
        <CardHeader>
          <div className="space-y-2">
            <div className=" flex justify-between">
              <CardTitle className="md:text-xl font-semibold">
                {internship.internship_title}
              </CardTitle>
              <div className="flex flex-col items-center gap-3">
                <span className="md:text-sm text-xs font-medium text-muted-foreground whitespace-nowrap">
                  ID: {internship.id.slice(0, 5)}
                </span>
                <span className=" text-primary md:text-xl font-bold">
                  {internship.price}
                </span>
              </div>
            </div>
            <CardDescription className="md:text-sm text-xs text-muted-foreground">
              <span className="font-medium">{internship.description}</span>
            </CardDescription>
          </div>
        </CardHeader>

        {/* Domains Section */}
        <CardContent className="space-y-4">
          <h2 className="md:text-xl font-semibold text-foreground">Domains</h2>

          <div className=" space-y-2">
            {Object.entries(internship.domains).map(
              ([domainName, domainData]) => (
                <Card key={domainName} className="py-2 px-0 pt-4">
                  <CardHeader className="flex flex-row items-center justify-between px-3">
                    <CardTitle className="md:text-xl font-bold text-primary capitalize">
                      {domainName}
                    </CardTitle>
                    <div className=" space-x-3">
                      <a
                        href={`/payment?internshipId=${internship.id}&domainId=${domainData.id}&domainName=${domainName}`}
                      >
                        <Button
                          variant="outline"
                          size="default"
                          className=" text-xs md:text-base cursor-pointer flex-1 border-green-600/50 bg-green-600/10 text-green-600 hover:bg-green-600/50 hover:text-white"
                        >
                          Join
                        </Button>
                      </a>
                      <Button
                        variant="outline"
                        size="default"
                        className="text-xs md:text-base cursor-pointer flex-1 border-primary/50 bg-primary/10 text-primary hover:bg-primary/50 hover:text-white"
                        onClick={() => setViewInternship(true)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-xs md:text-sm px-3">
                    <Separator className="-mt-3" />
                    <div className="flex gap-2">
                      <span className="font-semibold text-foreground">
                        Skills:
                      </span>
                      <span className="text-muted-foreground">
                        {domainData.skills_required.join(", ")}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-semibold text-foreground">
                        Tools Used:
                      </span>
                      <span className="text-pretty text-muted-foreground">
                        {domainData.tools_used.join(", ")}
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
