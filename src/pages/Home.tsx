import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  CheckCircle,
  ChevronRight,
  Clock,
  MessageSquare,
  Search,
  Star,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import Hero from "@/assets/hero.svg";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full items-center flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Connect with Expert Mentors for Personalized Guidance
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Find the perfect mentor to help you overcome challenges,
                    develop new skills, and achieve your goals.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <a href="/user">
                    <Button size="lg" className="gap-1">
                      Find a Mentor <ChevronRight className="h-4 w-4" />
                    </Button>
                  </a>
                  <a href="/user">
                    <Button size="lg" variant="outline">
                      Become a Mentor
                    </Button>
                  </a>
                </div>
              </div>
              <img
                src={Hero}
                width={550}
                height={550}
                alt="Students connecting with mentors"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  How MentorConnect Works
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform makes it easy to connect with experienced mentors
                  in just a few simple steps.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">1. Find Your Mentor</h3>
                <p className="text-center text-muted-foreground">
                  Browse profiles of experienced mentors based on your specific
                  needs and interests.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">2. Connect & Schedule</h3>
                <p className="text-center text-muted-foreground">
                  Reach out to mentors, discuss your goals, and schedule
                  personalized sessions.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">3. Learn & Grow</h3>
                <p className="text-center text-muted-foreground">
                  Gain valuable insights, overcome challenges, and achieve your
                  personal and professional goals.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Why Choose MentorConnect
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform offers unique benefits for both students and
                  mentors.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <h3 className="font-bold">Verified Expert Mentors</h3>
                </div>
                <p className="text-muted-foreground pl-7">
                  All mentors are thoroughly vetted for their expertise and
                  experience.
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <h3 className="font-bold">Personalized Matching</h3>
                </div>
                <p className="text-muted-foreground pl-7">
                  Our algorithm helps you find the perfect mentor based on your
                  specific needs.
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <h3 className="font-bold">Flexible Scheduling</h3>
                </div>
                <p className="text-muted-foreground pl-7">
                  Connect with mentors at times that work for your schedule.
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <h3 className="font-bold">Secure Platform</h3>
                </div>
                <p className="text-muted-foreground pl-7">
                  Our platform ensures safe and confidential interactions
                  between mentors and students.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Success Stories
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Hear from students and mentors who have transformed their
                  lives through MentorConnect.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <img
                    src="/placeholder.svg?height=40&width=40"
                    width={40}
                    height={40}
                    alt="Student"
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-bold">Sarah J.</h3>
                    <p className="text-sm text-muted-foreground">
                      Computer Science Student
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "Finding a mentor on MentorConnect completely changed my
                  career trajectory. My mentor helped me navigate complex coding
                  challenges and land my dream internship."
                </p>
              </div>
              <div className="flex flex-col space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <img
                    src="/placeholder.svg?height=40&width=40"
                    width={40}
                    height={40}
                    alt="Student"
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-bold">Michael T.</h3>
                    <p className="text-sm text-muted-foreground">
                      Business Major
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "My mentor provided invaluable insights that helped me develop
                  my business plan and secure funding for my startup. I couldn't
                  have done it without MentorConnect."
                </p>
              </div>
              <div className="flex flex-col space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <img
                    src="/placeholder.svg?height=40&width=40"
                    width={40}
                    height={40}
                    alt="Mentor"
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-bold">Dr. Lisa R.</h3>
                    <p className="text-sm text-muted-foreground">
                      Engineering Mentor
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "Being a mentor on this platform has been incredibly
                  rewarding. I've helped dozens of students overcome challenges
                  and achieve their goals in engineering."
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Join Our Growing Community
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Connect with mentors and students from around the world and take
                your learning to the next level.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row lg:justify-end">
              <Button size="lg" className="gap-1">
                Find a Mentor <ChevronRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Become a Mentor
              </Button>
            </div>
          </div>
          <div className="container px-4 md:px-6 py-12">
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
              <div className="flex flex-col items-center justify-center space-y-2 border rounded-lg p-4">
                <Users className="h-10 w-10 text-primary" />
                <div className="text-center">
                  <h3 className="text-3xl font-bold">10,000+</h3>
                  <p className="text-sm text-muted-foreground">
                    Active Mentors
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2 border rounded-lg p-4">
                <Users className="h-10 w-10 text-primary" />
                <div className="text-center">
                  <h3 className="text-3xl font-bold">50,000+</h3>
                  <p className="text-sm text-muted-foreground">Students</p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2 border rounded-lg p-4">
                <MessageSquare className="h-10 w-10 text-primary" />
                <div className="text-center">
                  <h3 className="text-3xl font-bold">100,000+</h3>
                  <p className="text-sm text-muted-foreground">
                    Sessions Completed
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2 border rounded-lg p-4">
                <Clock className="h-10 w-10 text-primary" />
                <div className="text-center">
                  <h3 className="text-3xl font-bold">500,000+</h3>
                  <p className="text-sm text-muted-foreground">
                    Hours of Mentoring
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Ready to Transform Your Learning Journey?
                </h2>
                <p className="max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join MentorConnect today and connect with expert mentors who
                  can help you achieve your goals.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex w-full max-w-sm items-center space-x-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="bg-primary-foreground text-primary-foreground placeholder:text-muted-foreground focus-visible:ring-primary-foreground"
                  />
                  <Button type="submit" variant="secondary">
                    Get Started
                  </Button>
                </form>
                <p className="text-xs">
                  By signing up, you agree to our Terms of Service and Privacy
                  Policy.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2 font-bold">
            <BookOpen className="h-6 w-6 text-primary" />
            <span>MentorConnect</span>
          </div>
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} MentorConnect. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              to="#"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Terms
            </Link>
            <Link
              to="#"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Privacy
            </Link>
            <Link
              to="#"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
