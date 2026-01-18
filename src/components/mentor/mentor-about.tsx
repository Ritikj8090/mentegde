import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface MentorAboutProps {
  mentor: {
    bio?: string;
  };
}

export default function MentorAbout({ mentor }: MentorAboutProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About Me</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          {mentor?.bio || "No biography available."}
        </p>
      </CardContent>
    </Card>
  );
}
