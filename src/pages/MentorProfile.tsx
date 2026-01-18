import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BookOpen,
  Briefcase,
  Clock,
  Award,
  FileText,
  Link2,
  Star,
  Target,
  CreditCard,
  Building2,
  Mail,
  Users,
  Edit,
} from "lucide-react"

const MentorProfile =() => {
  return (
    <div className="min-h-screen container py-12 md:px-4 md:py-10 mx-auto">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="flex justify-center mb-6">
            <Avatar className="h-32 w-32 ring-4 ring-primary/10 ring-offset-4 ring-offset-background">
              <AvatarImage src="/professional-mentor.png" alt="Aarav Sharma" />
              <AvatarFallback className="text-4xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                AS
              </AvatarFallback>
            </Avatar>
          </div>
          <h1 className="text-4xl font-bold mb-3 text-balance">Aarav Sharma</h1>
          <p className="text-lg text-muted-foreground mb-4 max-w-2xl mx-auto text-pretty">
            Senior software engineer with a passion for mentoring early-career developers.
          </p>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span className="text-sm">aarav.mentor@example.com</span>
          </div>
        </div>

        {/* Main Grid */ }
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Expertise Area */}
          <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50 p-6 hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Expertise Area</h2>
            </div>
            <p className="text-foreground">Full Stack Development</p>
          </Card>

          {/* Years of Experience */}
          <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50 p-6 hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-accent/10">
                <Briefcase className="h-5 w-5 text-accent" />
              </div>
              <h2 className="text-xl font-semibold">Years of Experience</h2>
            </div>
            <p className="text-foreground font-semibold text-2xl">7 years</p>
          </Card>

          {/* Availability */}
          <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50 p-6 hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-chart-2/10">
                <Clock className="h-5 w-5 text-chart-2" />
              </div>
              <h2 className="text-xl font-semibold">Availability</h2>
            </div>
            <p className="text-foreground font-semibold text-2xl">10 hrs/week</p>
          </Card>

          {/* LinkedIn / Portfolio */}
          <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50 p-6 hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-chart-3/10">
                <Link2 className="h-5 w-5 text-chart-3" />
              </div>
              <h2 className="text-xl font-semibold">LinkedIn / Portfolio</h2>
            </div>
            <Button variant="link" className="p-0 h-auto font-medium text-primary hover:text-primary/80">
              View Profile
            </Button>
          </Card>

          {/* Resume */}
          <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50 p-6 hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-chart-1/10">
                <FileText className="h-5 w-5 text-chart-1" />
              </div>
              <h2 className="text-xl font-semibold">Resume</h2>
            </div>
            <Button variant="link" className="p-0 h-auto font-medium text-primary hover:text-primary/80">
              View Resume
            </Button>
          </Card>

          {/* Mentees Guided */}
          <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50 p-6 hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-chart-4/10">
                <Users className="h-5 w-5 text-chart-4" />
              </div>
              <h2 className="text-xl font-semibold">Mentees Guided</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-sm">
                DSA
              </Badge>
              <Badge variant="secondary" className="text-sm">
                System Design
              </Badge>
              <Badge variant="secondary" className="text-sm">
                React
              </Badge>
              <Badge variant="secondary" className="text-sm">
                Career Guidance
              </Badge>
            </div>
          </Card>

          {/* Certificates - Full Width on Mobile, Spans 2 on Desktop */}
          <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50 p-6 hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-chart-5/10">
                <Award className="h-5 w-5 text-chart-5" />
              </div>
              <h2 className="text-xl font-semibold">Certificates</h2>
            </div>
            <div className="space-y-2">
              <Button variant="link" className="p-0 h-auto font-medium text-primary hover:text-primary/80 block">
                View Certificate 1
              </Button>
              <Button variant="link" className="p-0 h-auto font-medium text-primary hover:text-primary/80 block">
                View Certificate 2
              </Button>
            </div>
          </Card>

          {/* Badges */}
          <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50 p-6 hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Badges</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default" className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                Top Mentor
              </Badge>
              <Badge variant="default" className="bg-gradient-to-r from-chart-2 to-chart-3 text-white">
                Career Coach
              </Badge>
              <Badge variant="default" className="bg-gradient-to-r from-chart-4 to-chart-5 text-white">
                5+ Mentor
              </Badge>
            </div>
          </Card>

          {/* Feedback */}
          <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50 p-6 hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-accent/10">
                <Star className="h-5 w-5 text-accent" />
              </div>
              <h2 className="text-xl font-semibold">Feedback</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4].map((star) => (
                  <Star key={star} className="h-5 w-5 fill-accent text-accent" />
                ))}
                <Star className="h-5 w-5 fill-accent/50 text-accent/50" />
              </div>
              <span className="font-semibold">4.5</span>
              <span className="text-muted-foreground text-sm">from 120+ mentees</span>
            </div>
          </Card>

          {/* UPI ID */}
          <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50 p-6 hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-chart-1/10">
                <CreditCard className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50 h-5 w-5 text-chart-1" />
              </div>
              <h2 className="text-xl font-semibold">UPI ID</h2>
            </div>
            <p className="text-foreground font-mono text-sm">aarav@upi</p>
          </Card>

          {/* Bank Details - Spans Full Width */}
          <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50 p-6 hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-chart-2/10">
                <Building2 className="h-5 w-5 text-chart-2" />
              </div>
              <h2 className="text-xl font-semibold">Bank Details</h2>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Account Holder</p>
                <p className="font-medium">Aarav Sharma</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Account Number</p>
                <p className="font-mono font-medium">******9012</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">IFSC</p>
                <p className="font-mono font-medium">HDFC0001234</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Edit Button */}
        <div className="mt-8 flex justify-end">
          <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300">
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MentorProfile