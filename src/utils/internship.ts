import { internshipSchema } from "@/pages/manageInternship/schema";
import { api } from "@/services/api"
import { z } from "zod";

export const createInternship = async(data:z.infer<typeof internshipSchema>) => {
    const result = await api.post("/internships", data);
    return result.data
}

export const getCurrentMentorInternships = async() => {
    const result = await api.get("/internships/current-mentor-internships");
    return result.data
}

export const getCurrentMentorInternshipsRequests = async() => {
  const result = await api.get("/internships/current-mentor-requested-internships");
  return result.data
}