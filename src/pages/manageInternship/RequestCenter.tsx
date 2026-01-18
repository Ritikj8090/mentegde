import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Internship } from "@/index";
import { format } from "date-fns";
import AcceptRequestCohost from "./AcceptRequestCohost";
import { useState } from "react";
import { RejectRequest } from "./RejectRequest";

const RequestCenter = ({
  internshipsRequests,
}: {
  internshipsRequests: Internship[];
}) => {
  return (
    <>
      <Card className=" col-span-2 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50  max-h-screen mb-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold mb-4 flex items-center gap-2">
            <User className="text-green-400" /> Request Center
          </CardTitle>
          <CardDescription>Showing recent internship requests</CardDescription>
        </CardHeader>
        {internshipsRequests.length > 0 ? (
          <CardContent className=" overflow-y-scroll space-y-3">
            {internshipsRequests &&
              internshipsRequests.map((internshipsRequest: Internship) => (
                <RenderCard
                  key={internshipsRequest.id}
                  internshipsRequest={internshipsRequest}
                />
              ))}
          </CardContent>
        ) : (
          <CardContent className=" flex items-center justify-center h-full">
            <p className=" text-muted-foreground">No current requests</p>
          </CardContent>
        )}
      </Card>
    </>
  );
};

export default RequestCenter;

const RenderCard = ({
  internshipsRequest,
}: {
  internshipsRequest: Internship;
}) => {
  const [isAcceptOpen, setIsAcceptOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  return (
    <>
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
                  internshipsRequest.my_role.invite_status === "pending"
                    ? " border-yellow-600/50  text-white bg-yellow-600/50"
                    : internshipsRequest.my_role.invite_status === "accepted"
                    ? "flex-1 border-green-600/50 text-white bg-green-600/50"
                    : "flex-1 border-red-600/50 text-white bg-red-600/50"
                )}
              >
                {internshipsRequest.my_role.invite_status}
              </Badge>
              <span className=" font-bold text-primary">
                {internshipsRequest.price}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className=" space-y-3">
          <p className="text-sm text-muted-foreground text-justify">
            Description: {internshipsRequest.description}
          </p>
          <div className=" border rounded-lg px-3 py-2 text-sm">
            NOTE: {internshipsRequest.host[0].full_name} wants you to be co-host
            for this internship ({internshipsRequest.internship_title}) in the
            domains of {internshipsRequest.co_host[0].domain}.
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Date:{" "}
            {format(new Date(internshipsRequest.created_at), "dd MMM yyyy")}
          </p>
          <Separator />
          <div className=" flex items-center gap-3">
            <Button
              variant="outline"
              size="default"
              className=" cursor-pointer flex-1 border-green-500/50 bg-green-500/10 text-green-500 hover:bg-green-500/50 hover:text-green-500/80"
              onClick={() => setIsAcceptOpen(true)}
              disabled={internshipsRequest.my_role.invite_status != "pending"}
            >
              <Check size={11} />
              Accept Request for Co-Host
            </Button>
            <Button
              variant="outline"
              size="default"
              className=" cursor-pointer flex-1 border-red-500/50 bg-red-500/10 text-red-500 hover:bg-red-500/50 hover:text-red-500/80"
              onClick={() => setIsRejectOpen(true)}
              disabled={internshipsRequest.my_role.invite_status != "pending"}
            >
              <X size={11} />
              Reject
            </Button>
          </div>
        </CardContent>
      </Card>
      <AcceptRequestCohost
        setOpen={setIsAcceptOpen}
        open={isAcceptOpen}
        internshipsRequest={internshipsRequest}
      />
      <RejectRequest
        setOpen={setIsRejectOpen}
        open={isRejectOpen}
        internshipId={internshipsRequest.id}
      />
    </>
  );
};
