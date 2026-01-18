import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Education {
  year: string;
  degree: string;
  institution: string;
  location: string;
}

interface MentorEducationProps {
  education?: Education[];
}

export default function MentorEducation({ education = [] }: MentorEducationProps) {
  // const education = [
  //   {
  //     year: "2018",
  //     degree: "Master of Computer Science",
  //     institution: "Stanford University",
  //     location: "California, USA",
  //   },
  //   { year: "2016", degree: "Bachelor of Engineering", institution: "MIT", location: "Massachusetts, USA" },
  // ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Education</CardTitle>
      </CardHeader>
      <CardContent>
        {education.length > 0 ? (
          <ol className="relative border-l border-gray-200 dark:border-gray-700">
            {education.map((edu, index) => (
              <li key={index} className="mb-10 ml-4">
                <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                  {edu.year}
                </time>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {edu.degree}
                </h3>
                <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                  {edu.institution}, {edu.location}
                </p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-muted-foreground">No education data available.</p>
        )}
      </CardContent>
    </Card>
  );
}
