import { internshipSchema } from "@/pages/manageInternship/schema";
import { api } from "@/services/api";
import { z } from "zod";
import { DomainDetails } from "..";
import {
  assignmentsSchema,
  conceptsSchema,
  milestonesSchema,
  tasksSchema,
} from "@/pages/workboard/schema";

export const createInternship = async (
  data: z.infer<typeof internshipSchema>
) => {
  const result = await api.post("/internships", data);
  return result.data;
};

export const getCurrentMentorInternships = async () => {
  const result = await api.get("/internships/current-mentor-internships");
  return result.data;
};

export const getCurrentMentorInternshipsRequests = async () => {
  const result = await api.get(
    "/internships/current-mentor-requested-internships"
  );
  return result.data;
};

export const acceptAndPost = async (internshipId: string) => {
  const result = await api.post(`/internships/${internshipId}/accept-and-post`);
  return result.data;
};

export const deleteInternship = async (internshipId: string) => {
  const result = await api.delete(`/internships/${internshipId}`);
  return result.data;
};

export const editInternship = async (
  data: z.infer<typeof internshipSchema>,
  internshipId: string
) => {
  const result = await api.put(`/internships/${internshipId}`, data);
  return result.data;
};

export const getInternshipsByStatus = async (status: string) => {
  const result = await api.get(`/internships/status/${status}`);
  return result.data;
};

export const submitCohostDomain = async (
  data: DomainDetails,
  internshipId: string
) => {
  const result = await api.post(
    `/internships/${internshipId}/cohost-domain`,
    data
  );
  return result.data;
};

export const cohostRespondToInternship = async (internshipId: string) => {
  const result = await api.post(`/internships/${internshipId}/cohost-respond`);
  return result.data;
};

export const getScheduledInternships = async () => {
  const result = await api.get(
    "/internships/current-mentor-scheduled-internships"
  );
  return result.data;
};

export const getOngoingInternships = async () => {
  const result = await api.get(
    "/internships/current-mentor-ongoing-internships"
  );
  return result.data;
};

export const createMilestones = async (
  workboardId: string,
  data: z.infer<typeof milestonesSchema>
) => {
  const result = await api.post(
    `/internships/workboards/${workboardId}/milestones`,
    data
  );
  return result.data;
};

export const createConcepts = async (
  milestoneId: string,
  data: z.infer<typeof conceptsSchema>
) => {
  const result = await api.post(
    `/internships/milestones/${milestoneId}/concepts`,
    data
  );
  return result.data;
};

export const createTasks = async (
  milestoneId: string,
  data: z.infer<typeof tasksSchema>
) => {
  const result = await api.post(
    `/internships/milestones/${milestoneId}/tasks`,
    data
  );
  return result.data;
};

export const createAssignments = async (
  milestoneId: string,
  data: z.infer<typeof assignmentsSchema>
) => {
  const result = await api.post(
    `/internships/milestones/${milestoneId}/assignments`,
    data
  );
  return result.data;
};

export const getAllDomainIntern = async (
  internshipId: string,
  domainName: string
) => {
  const result = await api.get(
    `/internships/${internshipId}/domains/${domainName}/interns`
  );
  return result.data;
};

export const getInternWorkboard = async (internshipId: string) => {
  const result = await api.get(
    `/internships/intern/workboards/${internshipId}`
  );
  return result.data;
};

export const getCurrentMentorWorkboard = async (internshipId: string) => {
  const result = await api.get(
    `/internships/workboards/current/${internshipId}`
  );
  return result.data;
};

export const getAllInternshipForIntern = async () => {
  const result = await api.get(`/internships/intern/available-internships`);
  return result.data;
};

export const joinInternship = async (
  internshipId: string,
  domain_id: string,
  domain_name: string
) => {
  const result = await api.post(`/internships/intern/join`, {
    internshipId,
    domain_id,
    domain_name,
  });
  return result.data;
};

export const getOngoingInternshipsForIntern = async () => {
  const result = await api.get(`/internships/intern/ongoing-with-progress`);
  return result.data;
}