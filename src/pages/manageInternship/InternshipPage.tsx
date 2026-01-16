import React, { useEffect } from "react";
import WorkFlowCenter from "./WorkFlowCenter";
import StudentCenter from "./StudentCenter";
import { Button } from "@/components/ui/button";
import { CreateInternship } from "./CreateInternship";
import { getCurrentMentorInternships, getCurrentMentorInternshipsRequests } from "@/utils/internship";
import Loading from "@/components/Loading";
import { Internship } from "@/index";
import RequestCenter from "./RequestCenter";

const InternshipPage = () => {
  const [open, setOpen] = React.useState(false);
  const [internships, setInternships] = React.useState<Internship[] | null>(null);
  const [internshipsRequests, setInternshipsRequests] = React.useState<Internship[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const internships = await getCurrentMentorInternships();
        const internshipsRequests = await getCurrentMentorInternshipsRequests();
        setInternships(internships);
        setInternshipsRequests(internshipsRequests);
        console.log(internships);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
  console.log(internshipsRequests);
  if(!internships || !internshipsRequests)
    return <Loading />

  return (
    <>
      <div className="container mx-auto py-4 max-h-screen">
        <div className="flex items-center justify-between">
          <h1 className=" text-3xl font-bold mb-4">Work Flow Center</h1>
          <Button onClick={() => setOpen(true)}>Create Internship</Button>
        </div>
        <div className=" grid grid-cols-5 gap-3 h-full">
          <WorkFlowCenter internships={internships} />
          <RequestCenter internshipsRequests={internshipsRequests}/>
          {/* <StudentCenter /> */}
        </div>
      </div>
      <CreateInternship open={open} setOpen={setOpen} />
    </>
  );
};

export default InternshipPage;
