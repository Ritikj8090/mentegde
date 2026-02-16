import { Award } from "lucide-react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";

interface TemplateProps {
  internName: string;
  internshipTitle: string;
  endDate: string;
  domain: string;
  hours: number;
  mentor: string;
  skills: string[];
  company: string;
  certificateNumber: string;
  certificateLink: string;
  certificateRef?: React.RefObject<HTMLDivElement | null>;
}
const Template = ({
  internName,
  internshipTitle,
  endDate,
  domain,
  hours,
  mentor,
  skills,
  company,
  certificateNumber,
  certificateRef,
  certificateLink,
}: TemplateProps) => {
  return (
    <>
      <div className="md:flex hidden justify-center">
        <div
          ref={certificateRef}
          className="bg-white shadow-2xl"
          style={{
            width: "1122px",
            height: "794px",
            maxWidth: "100%",
          }}
        >
          <div className="relative h-full p-12 bg-gradient-to-br from-amber-50 via-white to-amber-50 border-8 border-amber-200">
            {/* Decorative corners */}
            <div className="absolute top-6 left-6 w-12 h-12 border-t-4 border-l-4 border-amber-400" />
            <div className="absolute top-6 right-6 w-12 h-12 border-t-4 border-r-4 border-amber-400" />
            <div className="absolute bottom-6 left-6 w-12 h-12 border-b-4 border-l-4 border-amber-400" />
            <div className="absolute bottom-6 right-6 w-12 h-12 border-b-4 border-r-4 border-amber-400" />
            <QRCodeSVG
              value={certificateLink}
              size={70}
              level="H"
              className=" absolute right-10 top-10"
            />

            <div className="h-full flex flex-col justify-between">
              {/* Header */}
              <div className="text-center">
                <div className="inline-block p-4 bg-emerald-100 rounded-full mb-2">
                  <Award className="h-10 w-10 text-emerald-600" />
                </div>
                <h2 className="text-amber-700 font-bold text-lg tracking-widest">
                  CERTIFICATE OF COMPLETION
                </h2>
              </div>

              {/* Main Content */}
              <div className="flex-1 flex flex-col justify-center space-y-3">
                {/* Name Section */}
                <div className="text-center space-y-3">
                  <p className="text-zinc-600 text-base">
                    This is presented to
                  </p>
                  <h3 className="text-5xl font-bold text-zinc-900 my-">
                    {internName}
                  </h3>
                  <p className="text-zinc-600 text-base">
                    For successfully completing the
                  </p>
                  <h4 className="text-2xl font-semibold text-emerald-700 my-">
                    {internshipTitle}
                  </h4>
                  <p className="text-zinc-700 text-lg">
                    at <span className="font-semibold">{company}</span>
                  </p>
                </div>

                {/* Details Grid */}
                <div className="flex justify-between items-center gap-8 mx-30 py-6 border-y-2 border-amber-200">
                  <div className="text-center">
                    <p className="text-xs text-zinc-600 mb-1 font-semibold">
                      DURATION
                    </p>
                    <p className="text-lg font-bold text-zinc-900">
                      {hours} Hours
                    </p>
                  </div>
                  <div className="text-center capitalize">
                    <p className="text-xs text-zinc-600 mb-1 font-semibold">
                      DOMAIN
                    </p>
                    <p className="text-lg font-bold text-zinc-900">{domain}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-zinc-600 mb-1 font-semibold">
                      COMPLETED
                    </p>
                    <p className="text-lg font-bold text-zinc-900">{endDate}</p>
                  </div>
                </div>

                {/* Skills */}
                <div className="text-center">
                  <p className="text-sm text-zinc-600 mb-3 font-semibold">
                    SKILLS ACQUIRED
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer - Signatures */}
              <div className="flex justify-between items-center px-20 mt-28">
                <div className="text-center">
                  <div className="border-t-2 border-zinc-400 pt-2 mb-1">
                    <p className="text-xs font-semibold text-zinc-700">
                      MENTOR
                    </p>
                    <p className="text-sm text-zinc-900 font-medium">
                      {mentor}
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="border-t-2 border-zinc-400 pt-2 mb-1">
                    <p className="text-xs font-semibold text-zinc-700">
                      COMPANY
                    </p>
                    <p className="text-sm text-zinc-900 font-medium">
                      {company}
                    </p>
                  </div>
                </div>
              </div>

              {/* Certificate Number */}
              <div className="text-center pt-4 border-t border-amber-200 mt-4">
                <p className="text-xs text-zinc-500">
                  Certificate Number:{" "}
                  <span className="font-mono font-semibold text-zinc-700">
                    {certificateNumber}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MobileTemplate
        internName={internName}
        internshipTitle={internshipTitle}
        endDate={endDate}
        domain={domain}
        hours={hours}
        mentor={mentor}
        skills={skills}
        company={company}
        certificateNumber={certificateNumber}
        certificateLink={certificateLink}
      />
    </>
  );
};

export default Template;

const MobileTemplate = ({
  internName,
  internshipTitle,
  endDate,
  domain,
  hours,
  mentor,
  skills,
  company,
  certificateNumber,
  certificateLink,
}: TemplateProps) => {
  return (
    <div className="flex md:hidden justify-center">
      <div
        className="bg-white shadow-2xl"
        style={{
          width: "561px",
          height: "550px",
          maxWidth: "100%",
        }}
      >
        <div className="relative h-full p-6 bg-gradient-to-br from-amber-50 via-white to-amber-50 border-2 border-amber-200">
          {/* Decorative corners */}
          <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-amber-400" />
          <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-amber-400" />
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-amber-400" />
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-amber-400" />
          <QRCodeSVG
            value={certificateLink}
            size={40}
            level="H"
            className=" absolute right-4 top-4"
          />

          <div className="h-full flex flex-col justify-between">
            {/* Header */}
            <div className="text-center">
              <div className="inline-block p-4 bg-emerald-100 rounded-full">
                <Award className="h-5 w-5 text-emerald-600" />
              </div>
              <h2 className="text-amber-700 font-bold text-sm tracking-widest">
                CERTIFICATE OF COMPLETION
              </h2>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center space-y-2">
              {/* Name Section */}
              <div className="text-center space-y-2">
                <p className="text-zinc-600 text-xs">This is presented to</p>
                <h3 className="text-xl font-bold text-zinc-900">
                  {internName}
                </h3>
                <p className="text-zinc-600 text-xs">
                  For successfully completing the
                </p>
                <h4 className="text-base font-semibold text-emerald-700">
                  {internshipTitle}
                </h4>
                <p className="text-zinc-700 text-sm">
                  at <span className="font-semibold">{company}</span>
                </p>
              </div>

              {/* Details Grid */}
              <div className="flex justify-between items-center gap-4 py-3 border-y-1 border-amber-200">
                <div className="text-center">
                  <p className="text-xs text-zinc-600 mb-1 font-semibold">
                    DURATION
                  </p>
                  <p className="text-xs font-bold text-zinc-900">
                    {hours} Hours
                  </p>
                </div>
                <div className="text-center capitalize">
                  <p className="text-xs text-zinc-600 mb-1 font-semibold">
                    DOMAIN
                  </p>
                  <p className="text-xs font-bold text-zinc-900">{domain}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-zinc-600 mb-1 font-semibold">
                    COMPLETED
                  </p>
                  <p className="text-xs font-bold text-zinc-900">{endDate}</p>
                </div>
              </div>

              {/* Skills */}
              <div className="text-center">
                <p className="text-sm text-zinc-600 font-semibold mb-1">
                  SKILLS ACQUIRED
                </p>
                <div className="flex flex-wrap justify-center gap-1 mx-auto">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer - Signatures */}
            <div className="flex justify-between items-center px-3 mt-16">
              <div className="text-center">
                <div className="border-t-2 border-zinc-400 pt-2 mb-1">
                  <p className="text-xs font-semibold text-zinc-700">MENTOR</p>
                  <p className="text-xs text-zinc-900 font-medium">{mentor}</p>
                </div>
              </div>
              <div className="text-center">
                <div className="border-t-2 border-zinc-400 pt-2 mb-1">
                  <p className="text-xs font-semibold text-zinc-700">COMPANY</p>
                  <p className="text-xs text-zinc-900 font-medium">{company}</p>
                </div>
              </div>
            </div>

            {/* Certificate Number */}
            <div className="text-center pt-2 border-t border-amber-200 mt-2">
              <p className="text-xs text-zinc-500">
                Certificate Number:{" "}
                <span className="font-mono font-semibold text-zinc-700">
                  {certificateNumber}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
