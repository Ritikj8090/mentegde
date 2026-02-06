import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Download,
  Share2,
  Linkedin,
  Twitter,
  Mail,
  Copy,
  Check,
  Award,
  Calendar,
  Users,
  Briefcase,
  Star,
} from "lucide-react";
import Template from "./Template";
import { getCertificateDetail } from "@/utils/internship";
import { CertificateData } from "@/index";
import { useSelector } from "react-redux";
import { RootState } from "@/components/store/store";
import Loading from "@/components/Loading";
import { format } from "date-fns";
import { LOGO_NAME } from "@/constant";
import { Badge } from "@/components/ui/badge";
import { useParams } from "react-router-dom";
import confetti from "canvas-confetti";

const handleClick = () => {
  const duration = 5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
  const randomInRange = (min: number, max: number) =>
    Math.random() * (max - min) + min;
  const interval = window.setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      return clearInterval(interval);
    }
    const particleCount = 50 * (timeLeft / duration);
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
};

const Certificatepage = () => {
  const { certificateNumber } = useParams<{ certificateNumber: string }>();

  const user = useSelector((state: RootState) => state.auth.user);
  const [certificateDetail, setCertificateDetail] = useState<CertificateData>();
  const certificateRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const showConfetti = localStorage.getItem("showConfetti") === "true";

  // ✅ Fetch certificate data
  useEffect(() => {
    if (!certificateNumber) return;

    const fetchData = async () => {
      try {
        const data = await getCertificateDetail(certificateNumber);
        setCertificateDetail(data);
      } catch (err) {
        console.error("Failed to fetch certificate:", err);
      }
    };
    if (showConfetti) {
      handleClick();
    }
    fetchData();

    localStorage.setItem("showConfetti", "false");
  }, [certificateNumber]);

  // ✅ Safe Date Formatter
  const safeFormat = (date?: string, fmt = "dd MMM yyyy") => {
    if (!date) return "";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "" : format(d, fmt);
  };

  // ✅ Total Hours Calculation (Weeks * weekly_hours)
  const getTotalHours = (start?: string, end?: string, weeklyHours = 0) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);

    const weeks = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7),
    );

    return weeks * weeklyHours;
  };

  // ✅ Certificate Link
  const certificateLink = useMemo(() => {
    if (!certificateDetail?.certificateNumber) return "";
    return `${window.location.origin}/certificate/${certificateDetail.certificateNumber}`;
  }, [certificateDetail]);

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;

    setDownloading(true);

    const html = certificateRef.current.outerHTML;

    const res = await fetch("https://localhost:4000/generate-certificate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Server error:", text);
      setDownloading(false);
      return;
    }
    const blob = await res.blob();
    console.log("Blob type:", blob.type, "Size:", blob.size);

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${certificateDetail?.internshipTitle}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    setDownloading(false);
  };

  // ✅ Copy link
  const handleCopyLink = () => {
    if (!certificateLink) return;
    navigator.clipboard.writeText(certificateLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ✅ Share
  const shareOnSocial = (platform: string) => {
    const text = `I completed ${certificateDetail?.internshipTitle} at ${LOGO_NAME} 🎓`;
    const url = certificateLink;

    let shareUrl = "";
    if (platform === "linkedin")
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    if (platform === "twitter")
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;

    if (shareUrl) window.open(shareUrl, "_blank");
  };

  // ✅ Loading State
  if (!certificateNumber || !certificateDetail) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen container mx-auto py-8">
      <div className=" space-y-4">
        {/* Header */}
        {user?.id === certificateDetail?.internId ? (
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3">
              <Award className="h-8 w-8 text-emerald-500" />
              <h1 className="text-4xl font-bold text-white">
                Congratulations!
              </h1>
              <Award className="h-8 w-8 text-emerald-500" />
            </div>
            <p className="text-lg text-muted-foreground">
              You have successfully completed your internship program
            </p>
          </div>
        ) : (
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3">
              <Award className="h-8 w-8 text-emerald-500" />
              <h1 className="text-4xl font-bold text-white">
                Verified Certificate
              </h1>
              <Award className="h-8 w-8 text-emerald-500" />
            </div>
            <p className="text-lg text-muted-foreground">
              This certificate is verified by {LOGO_NAME}
            </p>
          </div>
        )}
        {/* Certificate - Landscape Format */}
        <Template
          internName={certificateDetail?.internName || ""}
          internshipTitle={certificateDetail?.internshipTitle || ""}
          endDate={safeFormat(certificateDetail.end_date, "dd MMMM yyyy")}
          domain={certificateDetail?.domain_name as "tech" | "management"}
          hours={getTotalHours(
            certificateDetail.start_date,
            certificateDetail.end_date,
            certificateDetail.weekly_hours,
          )}
          mentor={certificateDetail?.mentor_full_name || ""}
          skills={certificateDetail?.skills_required || []}
          company={LOGO_NAME}
          certificateNumber={certificateNumber}
          certificateLink={certificateLink}
          certificateRef={certificateRef}
        />

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Download Section */}
          <div className="space-y-3">
            <Button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 h-11"
            >
              <Download className="h-4 w-4" />
              {downloading ? "Downloading..." : "Download as PDF"}
            </Button>
          </div>

          {/* Share Section */}
          <div className="space-y-3">
            <div className="relative">
              <Button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2 h-11"
              >
                <Share2 className="h-4 w-4" />
                Share Achievement
              </Button>

              {showShareMenu && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden z-10">
                  <button
                    onClick={() => shareOnSocial("linkedin")}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-zinc-700 transition-colors text-white"
                  >
                    <Linkedin className="h-4 w-4" />
                    Share on LinkedIn
                  </button>
                  <button
                    onClick={() => shareOnSocial("twitter")}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-zinc-700 transition-colors text-white border-t border-zinc-700"
                  >
                    <Twitter className="h-4 w-4" />
                    Share on Twitter
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-zinc-700 transition-colors text-white border-t border-zinc-700"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy Link
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Internship Details Card */}
        <div className="border rounded-xl p-8">
          <h3 className="text-xl font-semibold mb-6">Internship Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Briefcase className="h-5 w-5 text-emerald-500" />
                <span className="text-sm">Internship Title</span>
              </div>
              <p className=" font-medium">
                {certificateDetail?.internshipTitle}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Users className="h-5 w-5 text-blue-500" />
                <span className="text-sm">Mentor</span>
              </div>
              <p className=" font-medium">
                {certificateDetail?.mentor_full_name}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="h-5 w-5 text-violet-500" />
                <span className="text-sm">Duration</span>
              </div>
              <p className="font-medium">
                {safeFormat(certificateDetail.start_date, "dd MMM yyyy")} -{" "}
                {safeFormat(certificateDetail.end_date, "dd MMM yyyy")}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Star className="h-5 w-5 text-amber-500" />
                <span className="text-sm">Hours Completed</span>
              </div>
              <p className=" font-medium">
                {getTotalHours(
                  certificateDetail.start_date,
                  certificateDetail.end_date,
                  certificateDetail.weekly_hours,
                )}{" "}
                hours
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Award className="h-5 w-5 text-emerald-500" />
                <span className="text-sm">Domain</span>
              </div>
              <p className="font-medium capitalize">
                {certificateDetail?.domain_name}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3 text-zinc-400">
                <Mail className="h-5 w-5 text-pink-500" />
                <span className="text-sm">Certificate ID</span>
              </div>
              <p className="text-white font-mono text-sm font-medium">
                {certificateNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className=" border rounded-xl p-8">
          <h3 className="text-xl font-semibold mb-6">Skills & Competencies</h3>
          <div className="flex flex-wrap gap-2">
            {certificateDetail?.skills_required.map((skill) => (
              <Badge key={skill} className=" text-center transition-colors">
                <p className=" font-medium text-sm">{skill}</p>
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificatepage;
