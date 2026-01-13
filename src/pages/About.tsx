import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Users, Video, MessageSquare, Award, Clock, Lightbulb, Target } from "lucide-react"
import { Link } from "react-router-dom"

export default function About() {
  return (
    <div className="flex flex-col min-h-screen container mx-auto">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                About Instant Mentor
              </h1>
              <p className="mx-auto max-w-[700px] text-slate-500 md:text-xl">
                Connecting students with expert mentors for personalized learning experiences and real-time guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-slate-100 px-3 py-1 text-sm">Our Story</div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">The Journey of Instant Mentor</h2>
              <p className="text-slate-500 md:text-lg">
                Instant Mentor was born from a simple observation: despite living in an age of unprecedented access to
                information, students still struggle to find personalized guidance when they need it most.
              </p>
              <p className="text-slate-500 md:text-lg">
                In 2021, after witnessing countless students struggle with remote learning during the pandemic, our
                founder recognized that what was missing wasn't content—it was connection. Students needed more than
                recorded lectures; they needed real-time interaction with experts who could address their specific
                questions and learning styles.
              </p>
              <p className="text-slate-500 md:text-lg">
                What began as a small experiment connecting university students with graduate mentors quickly evolved
                into a comprehensive platform serving learners of all ages and disciplines. Today, Instant Mentor has
                facilitated over 50,000 mentoring sessions and continues to grow with a mission to make personalized
                education accessible to everyone.
              </p>
            </div>
            <div className="relative h-[300px] lg:h-[400px] overflow-hidden rounded-xl">
              <img
                src="/placeholder.svg?height=400&width=600"
                alt="The evolution of Instant Mentor"
                
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-slate-200 px-3 py-1 text-sm">Meet the Founder</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">The Vision Behind Instant Mentor</h2>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex justify-center lg:order-last">
              <div className="relative h-[350px] w-[350px] overflow-hidden rounded-full border-8 border-white shadow-xl">
                <img
                  src="/placeholder.svg?height=350&width=350"
                  alt="Founder portrait"
                  
                  className="object-cover"
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Sarah Johnson</h3>
              <p className="text-slate-600 font-medium">Founder & CEO</p>
              <div className="space-y-4">
                <p className="text-slate-500 md:text-lg">
                  With over 15 years of experience in education technology and a background in cognitive psychology,
                  Sarah has dedicated her career to improving how people learn.
                </p>
                <p className="text-slate-500 md:text-lg">
                  Prior to founding Instant Mentor, Sarah led educational initiatives at major tech companies and served
                  as an advisor to several universities on digital transformation. Her research on personalized learning
                  has been published in leading academic journals.
                </p>
                <blockquote className="border-l-4 border-slate-300 pl-4 italic text-slate-600 md:text-lg">
                  "Education isn't just about transferring information—it's about transformation through connection.
                  When we connect students with the right mentors at the right time, we create moments of insight that
                  can change the trajectory of someone's life."
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-slate-100 px-3 py-1 text-sm">Our Mission</div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Empowering Education Through Connection
              </h2>
              <p className="text-slate-500 md:text-xl">
                At Instant Mentor, we believe that personalized guidance is the key to effective learning. Our platform
                bridges the gap between students seeking knowledge and mentors with expertise, creating a community
                where learning happens naturally through conversation and collaboration.
              </p>
            </div>
            <div className="relative h-[300px] lg:h-[400px] overflow-hidden rounded-xl">
              <img
                src="/placeholder.svg?height=400&width=600"
                alt="Students and mentors collaborating"
                
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-slate-200 px-3 py-1 text-sm">Our Values</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">What Drives Us</h2>
              <p className="mx-auto max-w-[700px] text-slate-500 md:text-lg">
                These core principles guide everything we do at Instant Mentor.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 shadow-sm bg-white">
              <div className="p-2 bg-slate-100 rounded-full">
                <Lightbulb className="h-6 w-6 text-slate-700" />
              </div>
              <h3 className="text-xl font-bold">Accessibility</h3>
              <p className="text-center text-slate-500">
                We believe quality education should be available to everyone, regardless of location or background.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 shadow-sm bg-white">
              <div className="p-2 bg-slate-100 rounded-full">
                <Users className="h-6 w-6 text-slate-700" />
              </div>
              <h3 className="text-xl font-bold">Community</h3>
              <p className="text-center text-slate-500">
                We foster meaningful connections between students and mentors that extend beyond single sessions.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 shadow-sm bg-white">
              <div className="p-2 bg-slate-100 rounded-full">
                <Target className="h-6 w-6 text-slate-700" />
              </div>
              <h3 className="text-xl font-bold">Excellence</h3>
              <p className="text-center text-slate-500">
                We maintain high standards for our mentors and continuously improve our platform based on feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">How Instant Mentor Works</h2>
              <p className="mx-auto max-w-[700px] text-slate-500 md:text-lg">
                Our platform makes it easy for students to connect with mentors and for mentors to share their
                knowledge.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50 border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                  <div className="p-3 rounded-full bg-slate-100">
                    <BookOpen className="h-8 w-8 text-slate-700" />
                  </div>
                  <h3 className="text-xl font-bold">For Students</h3>
                  <ul className="space-y-4 text-left">
                    <li className="flex items-start">
                      <div className="mr-2 mt-1">
                        <Users className="h-5 w-5 text-slate-600" />
                      </div>
                      <span>Browse profiles of expert mentors across various subjects</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1">
                        <MessageSquare className="h-5 w-5 text-slate-600" />
                      </div>
                      <span>Schedule one-on-one sessions to address specific questions</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1">
                        <Video className="h-5 w-5 text-slate-600" />
                      </div>
                      <span>Join live classes for interactive learning experiences</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50 border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                  <div className="p-3 rounded-full bg-slate-100">
                    <Award className="h-8 w-8 text-slate-700" />
                  </div>
                  <h3 className="text-xl font-bold">For Mentors</h3>
                  <ul className="space-y-4 text-left">
                    <li className="flex items-start">
                      <div className="mr-2 mt-1">
                        <Clock className="h-5 w-5 text-slate-600" />
                      </div>
                      <span>Set your own schedule and availability for sessions</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1">
                        <Video className="h-5 w-5 text-slate-600" />
                      </div>
                      <span>Host live classes on topics within your expertise</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1">
                        <Award className="h-5 w-5 text-slate-600" />
                      </div>
                      <span>Build your reputation and earn through sharing knowledge</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Why Choose Instant Mentor</h2>
              <p className="mx-auto max-w-[700px] text-slate-500 md:text-lg">
                Our platform offers unique advantages for both students and mentors.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 shadow-sm bg-white">
              <div className="p-2 bg-slate-100 rounded-full">
                <Clock className="h-6 w-6 text-slate-700" />
              </div>
              <h3 className="text-xl font-bold">Instant Access</h3>
              <p className="text-center text-slate-500">
                Get help when you need it most with on-demand mentoring sessions.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 shadow-sm bg-white">
              <div className="p-2 bg-slate-100 rounded-full">
                <Users className="h-6 w-6 text-slate-700" />
              </div>
              <h3 className="text-xl font-bold">Expert Mentors</h3>
              <p className="text-center text-slate-500">
                Learn from verified professionals with real-world experience.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 shadow-sm bg-white">
              <div className="p-2 bg-slate-100 rounded-full">
                <Video className="h-6 w-6 text-slate-700" />
              </div>
              <h3 className="text-xl font-bold">Live Learning</h3>
              <p className="text-center text-slate-500">
                Participate in interactive live sessions for immersive education.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-900 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to Start Learning?</h2>
              <p className="mx-auto max-w-[600px] text-slate-300 md:text-xl">
                Join our community of students and mentors today and transform your educational journey.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                <Link to="/register">Sign Up Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-slate-800">
                <Link to="/mentors">Browse Mentors</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

