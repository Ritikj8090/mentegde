import MentorCard from "@/components/MentorCard";
import apis from "@/services/api";
import { useEffect, useState } from "react";
import type { Mentor } from "@/components/store/slices/mentorSlice" 

export default function MentorList() {
  const [mentors, setMentors] = useState<Mentor[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await apis.getMentors(); // GET from /api/auth/mentors
        setMentors(data);
      } catch (err) {
        console.error("Failed to fetch mentors", err);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Top Mentors</h1>
          <p className="text-muted-foreground mt-2">
            Connect with industry experts who can guide you through your career
            journey
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
          {mentors.map((mentor) => (
            <MentorCard
              key={mentor.id}
              id={mentor.user_id}
              name={mentor.username}
              bio={mentor.bio}
              expertise={mentor.expertise || []}
              title={mentor.title}
              hourlyRate={mentor.hourlyRate}
              rating={mentor.rating}
              image={mentor.avatar}
              ranking={5} // optional
              isLive={mentor.is_live}
            />
          ))}
        </div>
      </div>
    </div>
  );
}