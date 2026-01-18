import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, Linkedin, Twitter, Facebook } from "lucide-react"
import { Link } from "react-router-dom"

interface MentorContactProps {
  mentor: {
    email?: string;
    expertise?: string[]; // assuming skills are here
    github?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

export default function MentorContact({ mentor }: MentorContactProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">EMAIL ADDRESS</p>
            {mentor.email ? (
              <a
                href={`mailto:${mentor.email}`}
                className="text-blue-600 hover:underline"
              >
                {mentor.email}
              </a>
            ) : (
              <p className="text-muted-foreground">Not available</p>
            )}
          </div>

          <div>
            <p className="font-semibold">SOCIAL MEDIA</p>
            <div className="flex gap-2 mt-1">
              {mentor.github && (
                <a href={mentor.github} target="_blank" rel="noreferrer">
                  <Github size={20} />
                </a>
              )}
              {mentor.linkedin && (
                <a href={mentor.linkedin} target="_blank" rel="noreferrer">
                  <Linkedin size={20} />
                </a>
              )}
              {mentor.twitter && (
                <a href={mentor.twitter} target="_blank" rel="noreferrer">
                  <Twitter size={20} />
                </a>
              )}
              {mentor.facebook && (
                <a href={mentor.facebook} target="_blank" rel="noreferrer">
                  <Facebook size={20} />
                </a>
              )}
              {!mentor.github && !mentor.linkedin && !mentor.twitter && !mentor.facebook && (
                <p className="text-muted-foreground">No links provided</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <p className="font-semibold mb-2">SKILLS</p>
          <div className="flex flex-wrap gap-2">
            {mentor.expertise && mentor.expertise.length > 0 ? (
              mentor.expertise.map((skill, index) => (
                <Badge key={index}>{skill}</Badge>
              ))
            ) : (
              <p className="text-muted-foreground">No skills listed</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}