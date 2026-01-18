import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Experience {
  year: string;
  role: string;
  company: string;
  location: string;
}

interface MentorExperienceProps {
  experiences?: Experience[];
}

export default function MentorExperience({
  experiences = [],
}: MentorExperienceProps) {
  // const experiences = [
  //   { year: "Present", role: "Software Developer", company: "Google Inc.", location: "New York, USA" },
  //   { year: "2020", role: "Frontend Developer", company: "Facebook", location: "California, USA" },
  //   { year: "2018", role: "Junior Developer", company: "StartUp Inc.", location: "San Francisco, USA" },
  // ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Experience</CardTitle>
      </CardHeader>
      <CardContent>
        {experiences.length > 0 ? (
          <ol className="relative border-l border-gray-200 dark:border-gray-700">
            {experiences.map((exp, index) => (
              <li key={index} className="mb-10 ml-4">
                <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                  {exp.year}
                </time>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {exp.role}
                </h3>
                <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                  {exp.company}, {exp.location}
                </p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-muted-foreground">No experience data available.</p>
        )}
      </CardContent>
    </Card>
  );
}
